/* Le Petit Ranger — shared interface pieces. */
(function () {
  'use strict';
  var PR = (window.PR = window.PR || {});
  var el = PR.el;

  var LINES = {
    praise: ['Bravo !', 'Super, petit ranger !', 'Excellent !', 'Génial !', 'Bien joué !', 'Tu es un vrai ranger !', 'Magnifique !'],
    encourage: ['Presque ! Essaie encore.', 'Ce n\'est pas grave. On réessaie ?', 'Courage, tu vas trouver !', 'Regarde bien, tu y es presque !', 'Pas tout à fait. Encore un essai !']
  };
  PR.line = function (kind) { return PR.pick(LINES[kind]); };

  /* ---------------- top bar ---------------- */
  PR.topbar = function (o) {
    o = o || {};
    var bar = document.querySelector('.topbar');
    bar.hidden = !!o.hidden;
    var title = bar.querySelector('.title');
    title.textContent = '';
    if (o.title) {
      title.appendChild(document.createTextNode(PR.fr(o.title)));
      if (o.ar) title.appendChild(PR.arLine(' ' + o.ar, 'inline'));
    }
    PR.progress(o.total || 0, 0);
  };
  PR.progress = function (total, done) {
    var box = document.querySelector('.topbar .progress');
    box.textContent = '';
    for (var i = 0; i < total; i++) {
      box.appendChild(el('i' + (i < done ? '.done' : i === done ? '.now' : '')));
    }
  };

  /* ---------------- Suri ---------------- */
  var dock, fig, bubbleTimer;
  PR.suri = {
    mount: function () {
      dock = document.querySelector('.suri-dock');
      fig = dock.querySelector('.suri-fig');
      fig.innerHTML = PR.svg('suri', { title: 'Suri' });
    },
    // say(text, mood, {ar, good, keep})
    say: function (text, mood, o) {
      o = o || {};
      if (!dock) return;
      dock.hidden = false;
      fig.querySelector('svg').setAttribute('data-mood', mood || 'happy');
      var old = dock.querySelector('.bubble');
      if (old) old.remove();
      if (text) {
        var b = el('div.bubble' + (o.good ? '.good' : ''), { role: 'status', 'aria-live': 'polite' }, el('div', { text: text }));
        if (o.ar) b.appendChild(PR.arLine(o.ar));
        dock.appendChild(b);
      }
      dock.classList.remove('hop');
      void dock.offsetWidth;
      if (mood === 'cheer') dock.classList.add('hop');
      clearTimeout(bubbleTimer);
      if (mood === 'cheer' || mood === 'encourage') {
        bubbleTimer = setTimeout(function () {
          var s = fig.querySelector('svg');
          if (s) s.setAttribute('data-mood', 'happy');
        }, 2200);
      }
    },
    hide: function () { if (dock) dock.hidden = true; }
  };

  /* ---------------- small helpers ---------------- */
  PR.sayButton = function (text, cls) {
    var b = el('button.icon-btn.say' + (cls ? '.' + cls : ''), {
      type: 'button', 'aria-label': PR.fr('Écouter : ' + text), html: PR.icons.speak,
      onclick: function (e) { e.stopPropagation(); PR.audio.unlock(); PR.audio.say(text); }
    });
    b.style.color = 'var(--sky-dark)';
    return b;
  };
  // « la crinière » with the article softened, for big display
  PR.wordEl = function (word, cls) {
    var m = word.match(/^(les |le |la |l')(.*)$/);
    var node = el('div.word' + (cls ? '.' + cls : ''));
    if (m) {
      node.appendChild(el('span.art-w', { text: m[1] }));
      node.appendChild(el('span', { text: m[2] }));
    } else node.textContent = PR.fr(word);
    return node;
  };

  /* ---------------- interactive animal scene ---------------- */
  PR.Scene = function (animalId, o) {
    o = o || {};
    var a = PR.data.animal(animalId);
    var wrap = el('div.scene-wrap');
    var card = el('div.scene-card');
    wrap.appendChild(card);
    card.innerHTML = PR.svg(animalId, { title: PR.fr(a.name) });
    var svg = card.querySelector('svg');
    var pre = svg.getAttribute('data-prefix');
    var labelEl = null, actTimer;

    function groups(part) {
      return svg.querySelectorAll('[data-part="' + part + '"],[data-alt="' + part + '"]');
    }
    var api = {
      el: wrap, card: card, svg: svg, animal: a,
      light: function (part, kind) {
        Array.prototype.forEach.call(groups(part), function (g) {
          if (kind) g.setAttribute('filter', 'url(#' + pre + '_' + kind + ')');
          else g.removeAttribute('filter');
        });
      },
      clear: function () {
        Array.prototype.forEach.call(svg.querySelectorAll('[filter]'), function (g) {
          if (g.hasAttribute('data-part') || g.hasAttribute('data-alt')) g.removeAttribute('filter');
        });
        if (labelEl) { labelEl.remove(); labelEl = null; }
      },
      // position (in % of the card) of a card's anchor
      anchor: function (c) { return [c.anchor[0] / 8, c.anchor[1] / 6]; },
      label: function (text, xPct, yPct, kind) {
        if (labelEl) labelEl.remove();
        // near the top (under the question bubble) the label goes below the point
        var below = yPct < 30;
        labelEl = el('div.part-label' + (kind ? '.' + kind : '') + (below ? '.below' : ''), { text: text });
        labelEl.style.left = Math.max(14, Math.min(86, xPct)) + '%';
        labelEl.style.top = (below ? yPct + 6 : yPct) + '%';
        card.appendChild(labelEl);
        return labelEl;
      },
      ripple: function (xPct, yPct, kind) {
        var r = el('div.tap-ripple' + (kind ? '.' + kind : ''));
        r.style.left = xPct + '%'; r.style.top = yPct + '%';
        card.appendChild(r);
        setTimeout(function () { r.remove(); }, 700);
      },
      onTap: function (fn) {
        svg.addEventListener('click', function (e) {
          PR.audio.unlock();
          var rect = card.getBoundingClientRect();
          var x = ((e.clientX - rect.left) / rect.width) * 100;
          var y = ((e.clientY - rect.top) / rect.height) * 100;
          var p = e.target.closest('[data-part]');
          var alt = e.target.closest('[data-alt]');
          fn({ part: p && p.getAttribute('data-part'), alt: alt && alt.getAttribute('data-alt'), x: x, y: y, cx: e.clientX, cy: e.clientY });
        });
      },
      // the animal "speaks": real recording + a little animation
      act: function () {
        svg.classList.remove('act');
        void svg.getBoundingClientRect();
        svg.classList.add('act');
        clearTimeout(actTimer);
        actTimer = setTimeout(function () { svg.classList.remove('act'); }, 3200);
        return PR.audio.animal(animalId);
      }
    };
    return api;
  };

  // Close-up of one part, for quiz and memory cards.
  PR.zoomSVG = function (c) {
    return PR.svg(c.animal, { viewBox: c.zoom, cls: 'zoom' });
  };
  PR.portraitSVG = function (animalId) {
    return PR.svg(animalId, { viewBox: PR.data.animal(animalId).portrait, cls: 'portrait' });
  };

  /* ---------------- effects ---------------- */
  var SPARK_COLORS = ['#FFD54A', '#FFB02E', '#5BE38A', '#7FD1F7', '#FF8FB1'];
  PR.sparkle = function (cx, cy, n) {
    if (PR.reducedMotion()) return;
    n = n || 12;
    for (var i = 0; i < n; i++) {
      var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('viewBox', '0 0 20 20');
      s.setAttribute('class', 'spark');
      s.innerHTML = '<path d="M10 0 L12.5 7.5 L20 10 L12.5 12.5 L10 20 L7.5 12.5 L0 10 L7.5 7.5 Z" fill="' + SPARK_COLORS[i % SPARK_COLORS.length] + '"/>';
      s.style.left = (cx - 7) + 'px'; s.style.top = (cy - 7) + 'px';
      document.body.appendChild(s);
      var ang = (i / n) * Math.PI * 2 + Math.random() * 0.5, dist = 50 + Math.random() * 60;
      var anim = s.animate([
        { transform: 'translate(0,0) scale(.4) rotate(0deg)', opacity: 1 },
        { transform: 'translate(' + Math.cos(ang) * dist + 'px,' + Math.sin(ang) * dist + 'px) scale(1.2) rotate(180deg)', opacity: 0 }
      ], { duration: 700 + Math.random() * 300, easing: 'cubic-bezier(.2,.8,.3,1)' });
      anim.onfinish = (function (node) { return function () { node.remove(); }; })(s);
    }
  };

  PR.confetti = function () {
    if (PR.reducedMotion()) return;
    var c = el('canvas.fx-layer');
    document.body.appendChild(c);
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    var g = c.getContext('2d'); g.scale(dpr, dpr);
    var colors = ['#FFD54A', '#F5A524', '#2E9E6A', '#3FA9E0', '#E5677E', '#8E6FD8'];
    var parts = [];
    for (var i = 0; i < 140; i++) {
      parts.push({
        x: innerWidth / 2 + (Math.random() - 0.5) * 160, y: innerHeight * 0.35,
        vx: (Math.random() - 0.5) * 14, vy: -8 - Math.random() * 10,
        r: 5 + Math.random() * 6, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
        c: colors[i % colors.length], shape: i % 3
      });
    }
    var t0 = performance.now();
    (function frame(t) {
      var dt = Math.min(2, (t - (frame.last || t)) / 16.7); frame.last = t;
      g.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach(function (p) {
        p.vy += 0.35 * dt; p.vx *= 0.99; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
        g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.fillStyle = p.c;
        if (p.shape === 0) g.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        else if (p.shape === 1) { g.beginPath(); g.arc(0, 0, p.r * 0.7, 0, 7); g.fill(); }
        else { g.beginPath(); g.moveTo(0, -p.r); g.lineTo(p.r, p.r); g.lineTo(-p.r, p.r); g.fill(); }
        g.restore();
      });
      if (t - t0 < 3200) requestAnimationFrame(frame); else c.remove();
    })(t0);
  };

  /* ---------------- end of a round ---------------- */
  // o: {stars (1..3), title, text, again(), ar}
  PR.finish = function (o) {
    PR.audio.sfx('win');
    setTimeout(PR.confetti, 150);
    var stars = el('div.stars');
    for (var i = 0; i < 3; i++) {
      var holder = el('span', { html: PR.icons.star(i < o.stars) });
      holder.firstChild.style.animationDelay = (0.25 + i * 0.22) + 's';
      stars.appendChild(holder.firstChild);
    }
    var suriBox = el('div.suri-mini', { html: PR.svg('suri') });
    suriBox.querySelector('svg').setAttribute('data-mood', 'cheer');
    var overlay = el('div.overlay', { role: 'dialog', 'aria-modal': 'true' },
      el('div.card.finish',
        suriBox,
        el('h2', { text: o.title || 'Bravo, petit ranger !' }),
        stars,
        el('p', { text: o.text || '' }),
        o.ar ? PR.arLine(o.ar) : null,
        el('div.row',
          el('button.btn.sun', { type: 'button', html: PR.icons.again + '<span>' + PR.fr('Rejouer') + '</span>', onclick: function () { overlay.remove(); o.again(); } }),
          el('button.btn', { type: 'button', text: 'Retour au camp', onclick: function () { overlay.remove(); PR.go('home'); } })
        )
      )
    );
    document.body.appendChild(overlay);
    PR.suri.say('', 'cheer');
    overlay.querySelector('.btn').focus();
    PR.currentOverlay = overlay;
  };

  PR.starsFor = function (score, total) {
    var r = score / total;
    return r >= 0.85 ? 3 : r >= 0.55 ? 2 : 1;
  };
})();

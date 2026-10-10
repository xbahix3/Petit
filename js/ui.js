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
      fig.appendChild(PR.suriImg('happy'));
    },
    // say(text, mood, {ar, good, keep})
    say: function (text, mood, o) {
      o = o || {};
      if (!dock) return;
      dock.hidden = false;
      PR.suriMood(fig.querySelector('img'), mood || 'happy');
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
          PR.suriMood(fig.querySelector('img'), 'happy');
        }, 2200);
      }
    },
    hide: function () { if (dock) dock.hidden = true; }
  };

  /* ---------------- painted Suri ---------------- */
  PR.SURI_MOODS = ['happy', 'cheer', 'encourage', 'think', 'binoculars'];
  PR.suriImg = function (mood, cls) {
    return el('img.suri-img' + (cls ? '.' + cls : ''), { src: 'img/suri/' + mood + '.webp', alt: 'Suri', draggable: 'false', 'data-mood': mood });
  };
  PR.suriMood = function (img, mood) {
    if (!img || img.getAttribute('data-mood') === mood) return;
    img.setAttribute('data-mood', mood);
    img.src = 'img/suri/' + mood + '.webp';
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
    var P = PR.plates[animalId], sh = P.shadow;
    // backdrop and soft ground shadow live in the card background (no repaint while animating)
    card.style.background =
      'radial-gradient(ellipse ' + (sh[2] / P.w * 100) + '% ' + (sh[3] * 2.4 / P.h * 100) + '% at ' + (sh[0] / P.w * 100) + '% ' + (sh[1] / P.h * 100) + '%, rgba(58,38,16,.30), rgba(58,38,16,0) 70%),' +
      'radial-gradient(ellipse 78% 78% at 50% 40%, ' + P.backdrop[0] + ', ' + P.backdrop[1] + ')';
    for (var m = 0; m < 6; m++) {
      var mote = el('span.mote');
      mote.style.left = (8 + m * 15 + (m % 2) * 6) + '%';
      mote.style.animationDelay = (m * 1.7) + 's';
      mote.style.animationDuration = (9 + (m % 3) * 3) + 's';
      card.appendChild(mote);
    }
    var paint = el('img.paint-live', { src: P.img, alt: PR.fr(a.name), draggable: 'false' });
    card.appendChild(paint);
    card.insertAdjacentHTML('beforeend', PR.svg(animalId, { title: PR.fr(a.name), scene: false, paint: false, shadow: false }));
    var svg = card.querySelector('svg');
    var pre = svg.getAttribute('data-prefix');
    var dims = PR.plateDims(animalId);
    var labelEl = null, actTimer;

    var api = {
      el: wrap, card: card, svg: svg, animal: a,
      // light up a part: kind = 'glow' (gold, pulsing), 'good' (green), 'soft' (coral) or null
      light: function (part, kind) {
        var layer = svg.querySelector('[data-hl="' + part + '"]');
        if (!layer) return;
        if (kind) {
          layer.querySelector('image').setAttribute('filter', 'url(#' + pre + '_t-' + kind + ')');
          layer.style.display = '';
          layer.classList.toggle('pulse', kind === 'glow');
        } else {
          layer.style.display = 'none';
        }
      },
      clear: function () {
        Array.prototype.forEach.call(svg.querySelectorAll('[data-hl]'), function (g) { g.style.display = 'none'; });
        if (labelEl) { labelEl.remove(); labelEl = null; }
      },
      // a pulsing ring around a part, so even small parts are easy to spot
      focus: function (c) {
        var S = PR.plates[c.animal].parts[c.part], xs = [], ys = [];
        S.hit.forEach(function (poly) { poly.forEach(function (q) { xs.push(q[0]); ys.push(q[1]); }); });
        var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
        var ring = el('div.focus-ring');
        // big parts are obvious from their glow alone
        if (x1 - x0 > dims[0] * 0.35 || y1 - y0 > dims[1] * 0.45) return ring;
        var padX = Math.max(30, (x1 - x0) * 0.12), padY = Math.max(30, (y1 - y0) * 0.12);
        ring.style.left = ((x0 - padX) / dims[0] * 100) + '%';
        ring.style.top = ((y0 - padY) / dims[1] * 100) + '%';
        ring.style.width = ((x1 - x0 + 2 * padX) / dims[0] * 100) + '%';
        ring.style.height = ((y1 - y0 + 2 * padY) / dims[1] * 100) + '%';
        card.appendChild(ring);
        return ring;
      },
      // position (in % of the card) of a card's anchor
      anchor: function (c) { return [c.anchor[0] / dims[0] * 100, c.anchor[1] / dims[1] * 100]; },
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
        card.classList.remove('act');
        void card.offsetWidth;
        card.classList.add('act');
        clearTimeout(actTimer);
        actTimer = setTimeout(function () { card.classList.remove('act'); }, 3200);
        return PR.audio.animal(animalId);
      }
    };
    return api;
  };

  // Close-up of one part, for quiz and memory cards.
  PR.zoomSVG = function (c) {
    return PR.svg(c.detail || c.animal, { viewBox: c.zoom, cls: 'zoom', hits: false });
  };
  PR.portraitSVG = function (animalId) {
    return PR.svg(animalId, { viewBox: PR.data.animal(animalId).portrait, cls: 'portrait', hits: false });
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
    var suriBox = el('div.suri-mini', PR.suriImg('cheer'));
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

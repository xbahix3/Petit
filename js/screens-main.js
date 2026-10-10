/* Le Petit Ranger — title, camp (home), discovery and credits screens. */
(function () {
  'use strict';
  var PR = (window.PR = window.PR || {});
  var el = PR.el;
  PR.screens = PR.screens || {};

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  PR.cap = cap;
  // « C’est la crinière du lion. » / « Ce sont les crocs du lion. »
  PR.isPlural = function (word) { return /^les /.test(word); };
  PR.cestPhrase = function (c) { return (PR.isPlural(c.word) ? 'Ce sont ' : 'C\'est ') + c.full + '.'; };

  /* ---------------- title ---------------- */
  // the painted herd standing on the panorama (positions in css: .h-<id>)
  var HERD = ['girafe', 'gazelle', 'elephant', 'loup', 'lion', 'perruche'];
  PR.screens.title = function (root) {
    PR.topbar({ hidden: true });
    PR.suri.hide();
    var bg = el('picture.title-bg');
    bg.innerHTML = '<source media="(orientation: portrait)" srcset="img/title/portrait.webp"><img src="img/title/landscape.webp" alt="">';
    var herd = el('div.herd', { 'aria-hidden': 'true' });
    HERD.forEach(function (id, i) {
      var img = el('img.herd-animal.h-' + id, { src: PR.plates[id].img, alt: '', draggable: 'false' });
      img.style.animationDelay = (0.25 + i * 0.12) + 's';
      herd.appendChild(img);
    });
    var start = el('button.btn.big.sun', {
      type: 'button', text: 'Commencer l\'aventure',
      onclick: function () { PR.audio.unlock(); PR.audio.sfx('pop'); PR.go('home'); }
    });
    root.appendChild(el('div.title-screen',
      bg,
      herd,
      el('div.title-content',
        el('div.logo',
          el('span.leaf.l', { html: PR.icons.leaf }), el('span.leaf.r', { html: PR.icons.leaf }),
          el('div.badge', el('span.small', { text: 'Le Petit' }), el('span.big', { text: 'Ranger' }))),
        el('div.tagline', { text: 'Découvre les animaux sauvages et les parties de leur corps !' }),
        start),
      el('div.title-suri', PR.suriImg('cheer')),
      el('div.title-credits', el('button.linkish', { type: 'button', text: 'Crédits', onclick: function () { PR.go('credits'); } }))
    ));
    setTimeout(function () { start.focus({ preventScroll: true }); }, 50);
  };

  /* ---------------- camp (home) ---------------- */
  var ACTIVITIES = [
    { id: 'discover', title: 'Découverte', text: 'Explore les animaux et leurs parties.', ar: 'الاستكشاف', icon: 'binoculars', bg: 'linear-gradient(135deg,#FFD98A,#F5A524)' },
    { id: 'point', title: 'Montre-moi', text: 'Touche la bonne partie de l\'animal.', ar: 'أرِني', icon: 'pointer', bg: 'linear-gradient(135deg,#9BE3BD,#2E9E6A)' },
    { id: 'spell', title: 'Écris le mot', text: 'Écris le nom de la partie.', ar: 'اكتب الكلمة', icon: 'pencil', bg: 'linear-gradient(135deg,#A6DDF7,#3FA9E0)' },
    { id: 'quiz', title: 'Quiz', text: 'Réponds aux devinettes.', ar: 'الأسئلة', icon: 'question', bg: 'linear-gradient(135deg,#D3C2F7,#8E6FD8)' },
    { id: 'memory', title: 'Mémoire', text: 'Retrouve les paires.', ar: 'لعبة الذاكرة', icon: 'cards', bg: 'linear-gradient(135deg,#FFBACA,#E5677E)' },
    { id: 'phrases', title: 'Les phrases', text: 'Complète les phrases et devine les animaux.', ar: 'الجمل', icon: 'bubble', bg: 'linear-gradient(135deg,#FFE29A,#F08F5E)' }
  ];
  PR.ACTIVITIES = ACTIVITIES;

  PR.screens.home = function (root) {
    PR.topbar({ title: 'Le camp du ranger', ar: 'مخيم الحارس' });
    PR.suri.say('Bonjour, petit ranger ! Que veux-tu faire aujourd\'hui ?', 'happy', { ar: 'مرحبًا أيها الحارس الصغير! ماذا تريد أن تفعل اليوم؟', fade: 5000 });
    var grid = el('div.activities');
    ACTIVITIES.forEach(function (act, i) {
      var b = el('button.activity', { type: 'button', onclick: function () { PR.audio.unlock(); PR.audio.sfx('tap'); PR.go(act.id); } },
        el('div.art-top', { html: PR.icons[act.icon], style: { background: act.bg } }),
        el('div.txt', el('h2', { text: act.title }), el('p', { text: act.text }), PR.arLine(act.ar)));
      b.style.animationDelay = (i * 0.07) + 's';
      grid.appendChild(b);
    });
    var levels = el('div.levels', { role: 'radiogroup', 'aria-label': PR.fr('Niveau') },
      el('span.levels-label', { text: 'Niveau :' }));
    PR.LEVELS.forEach(function (l) {
      var b = el('button.level-btn.lv-' + l[0], {
        type: 'button', role: 'radio', 'aria-checked': PR.level() === l[0] ? 'true' : 'false',
        onclick: function () {
          PR.settings.set('level', l[0]);
          PR.audio.sfx('tap');
          Array.prototype.forEach.call(levels.querySelectorAll('.level-btn'), function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); });
        }
      }, el('span', { text: l[1] }), PR.arLine(l[2], 'inline'));
      levels.appendChild(b);
    });
    root.appendChild(el('div.screen-head', el('h1', { text: 'Choisis une activité' }), PR.arLine('اختر نشاطًا')));
    root.appendChild(levels);
    root.appendChild(grid);
  };

  /* ---------------- discovery: pick an animal ---------------- */
  var seenParts = {}; // only for this visit (nothing is saved)

  PR.screens.discover = function (root) {
    PR.topbar({ title: 'Découverte', ar: 'الاستكشاف' });
    PR.suri.say('Quel animal veux-tu observer ?', 'happy', { ar: 'أيّ حيوان تريد أن تراقب؟' });
    root.appendChild(el('div.screen-head', el('h1', { text: 'Choisis un animal' }), el('p', { text: 'Prends tes jumelles, petit ranger !' })));
    var grid = el('div.animals');
    PR.data.animals.forEach(function (a, i) {
      var cards = PR.data.cardsOf(a.id);
      var seen = cards.filter(function (c) { return seenParts[c.id]; }).length;
      var b = el('button.animal-card', { type: 'button', onclick: function () { PR.audio.sfx('tap'); PR.go('animal', a.id); } },
        el('div.pic', { html: PR.portraitSVG(a.id) }),
        el('div.name', { text: cap(a.name) },
          PR.arLine(a.ar),
          seen === cards.length ? el('span.seen', { text: 'Tout vu !' }) : null));
      b.style.animationDelay = (i * 0.06) + 's';
      grid.appendChild(b);
    });
    root.appendChild(grid);
  };

  /* ---------------- discovery: one animal ---------------- */
  PR.screens.animal = function (root, id) {
    var a = PR.data.animal(id) || PR.data.animals[0];
    var cards = PR.data.cardsOf(a.id);
    PR.topbar({ title: cap(a.name), ar: a.ar });

    // strip to switch animal
    var strip = el('div.animal-strip');
    PR.data.animals.forEach(function (o) {
      strip.appendChild(el('button' + (o.id === a.id ? '.cur' : ''), {
        type: 'button', 'aria-label': PR.fr(cap(o.name)), html: PR.portraitSVG(o.id),
        onclick: function () { if (o.id !== a.id) { PR.audio.sfx('tap'); PR.go('animal', o.id); } }
      }));
    });

    var scene = PR.Scene(a.id);
    var info = el('div.card.info');
    var spots = {};

    function intro() {
      info.textContent = '';
      info.appendChild(el('div.hint', { text: 'Touche les points qui brillent pour découvrir les parties ' + a.of + '.' }));
      info.appendChild(PR.arLine(PR.ar.discover));
      var lb = listenBtn();
      if (lb) info.appendChild(lb);
      info.appendChild(el('div.fact', el('div', el('b', { text: 'Le savais-tu ? ' }), el('span', { text: a.fact }))));
    }
    function listenBtn() {
      if (!PR.audio.hasAnimal(a.id)) return null;
      return el('button.btn.sky.small', {
        type: 'button', html: PR.icons.speak + '<span>' + PR.fr('Écouter ' + a.name) + '</span>',
        onclick: function () {
          PR.audio.unlock();
          scene.act();
          PR.suri.say(a.cry, 'happy');
        }
      });
    }
    function show(c) {
      PR.audio.sfx('pop');
      scene.clear();
      scene.light(c.part, 'glow');
      var pos = scene.anchor(c);
      scene.label(c.word, pos[0], pos[1] - 4);
      Object.keys(spots).forEach(function (k) { spots[k].classList.toggle('active', k === c.id); });
      seenParts[c.id] = true;
      spots[c.id].classList.add('seen');
      spots[c.id].innerHTML = PR.icons.check;

      info.textContent = '';
      if (c.detail) info.appendChild(el('div.detail', { html: PR.zoomSVG(c) }));
      info.appendChild(PR.wordEl(c.word));
      info.appendChild(PR.arLine(c.ar, 'word-ar'));
      info.appendChild(el('div.phrase', { text: PR.cestPhrase(c) }));
      info.appendChild(el('div.info-actions', PR.sayButton(c.full), listenBtn()));
      PR.audio.say(c.full);

      var done = cards.every(function (x) { return seenParts[x.id]; });
      if (done) {
        PR.suri.say('Bravo ! Tu connais toutes les parties ' + a.of + ' !', 'cheer', { good: true });
        var idx = PR.data.animals.indexOf(a);
        var next = PR.data.animals[(idx + 1) % PR.data.animals.length];
        info.appendChild(el('button.btn.sun.small', {
          type: 'button', html: '<span>' + PR.fr('Animal suivant : ' + next.name) + '</span>' + PR.icons.next,
          onclick: function () { PR.go('animal', next.id); }
        }));
      } else {
        PR.suri.say(PR.cestPhrase(c), 'happy', { ar: c.arFull });
      }
    }

    cards.forEach(function (c, i) {
      var pos = scene.anchor(c);
      var b = el('button.hotspot' + (seenParts[c.id] ? '.seen' : ''), {
        type: 'button', 'aria-label': PR.fr(c.word), html: seenParts[c.id] ? PR.icons.check : PR.icons.plus,
        onclick: function (e) { e.stopPropagation(); PR.audio.unlock(); show(c); }
      });
      b.style.left = pos[0] + '%'; b.style.top = pos[1] + '%';
      b.style.animationDelay = (i * 0.3) + 's';
      spots[c.id] = b;
      scene.card.appendChild(b);
    });

    scene.onTap(function (t) {
      var part = t.part, c = cards.filter(function (x) { return x.part === part || x.part === t.alt; })[0];
      if (c) show(c);
      else scene.ripple(t.x, t.y);
    });

    intro();
    PR.suri.say('Voici ' + a.name + ' ! Touche un point qui brille.', 'happy', { ar: PR.ar.discover });
    root.appendChild(strip);
    root.appendChild(el('div.disc-layout', scene.el, info));
  };

  /* ---------------- credits ---------------- */
  PR.screens.credits = function (root) {
    PR.topbar({ title: 'Crédits' });
    PR.suri.say('Merci à toutes les personnes qui partagent leurs sons !', 'happy');
    var list = el('ul');
    Object.keys(PR.sounds || {}).forEach(function (k) {
      var s = PR.sounds[k];
      list.appendChild(el('li', el('b', { text: cap(PR.data.animal(k).name) + ' : ' }),
        el('a', { href: s.page, target: '_blank', rel: 'noopener', raw: s.title }),
        document.createTextNode(' — ' + s.author + ' — ' + s.license)));
    });
    root.appendChild(el('div.card.credits',
      el('h2', { text: 'Sons des animaux' }),
      el('p', { text: 'De vrais enregistrements, partagés librement sur Wikimedia Commons et xeno-canto :' }),
      list,
      el('h2', { text: 'Voix' }),
      el('p', { text: PR.voiceCredit || 'Voix française enregistrée pour le jeu.' }),
      el('h2', { text: 'Polices' }),
      el('p', { text: 'Fredoka, Andika et Noto Naskh Arabic — licence SIL Open Font License.' }),
      el('h2', { text: 'Dessins et jeu' }),
      el('p', { text: 'Peintures (animaux, Suri et paysage du titre) créées pour ce jeu avec le modèle d\'images de ChatGPT.' })
    ));
  };
})();

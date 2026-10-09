/* Le Petit Ranger — the four games: Montre-moi, Écris le mot, Quiz, Mémoire.
   Mistakes are never punished: soft sound, warm colour, Suri encourages,
   and the right answer is always shown. */
(function () {
  'use strict';
  var PR = (window.PR = window.PR || {});
  var el = PR.el;
  PR.screens = PR.screens || {};

  // Pick n cards, avoiding the same animal twice in a row.
  function deck(n, filter) {
    var pool = PR.shuffle(PR.data.cards.filter(filter || function () { return true; }));
    var out = [];
    while (out.length < n && pool.length) {
      var last = out[out.length - 1];
      var idx = 0;
      while (idx < pool.length - 1 && last && pool[idx].animal === last.animal) idx++;
      out.push(pool.splice(idx, 1)[0]);
    }
    return out;
  }
  // « la crinière » -> « cette crinière », « le bec » -> « ce bec », « les crocs » -> « ces crocs »
  function demo(word) {
    if (/^les /.test(word)) return 'ces ' + word.slice(4);
    if (/^la /.test(word)) return 'cette ' + word.slice(3);
    if (/^le /.test(word)) return (/^[aeiouyhéèêâîô]/.test(word.slice(3)) ? 'cet ' : 'ce ') + word.slice(3);
    return word;
  }
  PR.demo = demo;
  function nextBtn(label, fn) {
    return el('button.btn.sun', { type: 'button', html: '<span>' + PR.fr(label) + '</span>' + PR.icons.next, onclick: fn });
  }
  function center(node) {
    var r = node.getBoundingClientRect();
    return [r.left + r.width / 2, r.top + r.height / 2];
  }

  /* ================= Montre-moi ================= */
  PR.screens.point = function (root) {
    var TOTAL = 8;
    var list = deck(TOTAL), i = 0, firstTry = 0;
    PR.topbar({ title: 'Montre-moi', ar: 'أرِني', total: TOTAL });

    function ask() {
      var c = list[i], tries = 0, solved = false;
      PR.debug = { card: c };
      root.textContent = '';
      PR.progress(TOTAL, i);
      var scene = PR.Scene(c.animal);
      var promptBox = el('div.prompt', el('span', { text: 'Touche ' + c.full + '.' }), PR.sayButton(c.full));
      scene.card.appendChild(promptBox);
      root.appendChild(scene.el);
      var plural = PR.isPlural(c.word);
      var pron = plural ? 'les' : (/^le /.test(c.word) ? 'le' : 'la');
      PR.suri.say((plural ? 'Où sont ' : 'Où est ') + c.full + ' ? Touche-' + pron + ' sur l\'image.', 'think', { ar: PR.ar.point + ' — ' + c.arFull });
      setTimeout(function () { PR.audio.say(c.full); }, 350);

      scene.onTap(function (t) {
        if (solved) return;
        var hit = t.part === c.part || t.alt === c.part;
        if (hit) {
          solved = true;
          if (tries === 0) firstTry++;
          scene.clear();
          scene.light(c.part, 'good');
          scene.ripple(t.x, t.y, 'good');
          var pos = scene.anchor(c);
          scene.label(c.word, pos[0], pos[1] - 4, 'good');
          PR.audio.sfx(tries === 0 ? 'great' : 'good');
          PR.sparkle(t.cx, t.cy, 14);
          PR.suri.say(PR.line('praise') + ' ' + PR.cestPhrase(c), 'cheer', { good: true, ar: c.arFull });
          PR.progress(TOTAL, i + 1);
          setTimeout(function () { PR.audio.say(c.full); }, 450);
          setTimeout(function () {
            i++;
            if (i < TOTAL) ask(); else end();
          }, 2300);
          return;
        }
        scene.ripple(t.x, t.y, 'soft');
        if (t.part) {
          // a different part: name it, so the mistake still teaches something
          tries++;
          var other = PR.data.cardsOf(c.animal).filter(function (x) { return x.part === t.part; })[0];
          PR.audio.sfx('oops');
          scene.clear();
          scene.light(t.part, 'soft');
          if (other) scene.label(PR.isPlural(other.word) ? 'Ce sont ' + other.word : 'C\'est ' + other.word, t.x, t.y - 3, 'soft');
          setTimeout(function () { if (!solved) scene.light(t.part, null); }, 1200);
          if (tries >= 2) {
            PR.suri.say('Regarde bien : ' + c.word + ' brille' + (PR.isPlural(c.word) ? 'nt' : '') + ' !', 'encourage');
            setTimeout(function () { if (!solved) scene.light(c.part, 'glow'); }, 1250);
          } else {
            PR.suri.say(PR.line('encourage') + ' Cherche ' + c.word + '.', 'encourage');
          }
        } else {
          PR.suri.say('Cherche bien : ' + c.full + '.', 'think');
        }
      });
    }
    function end() {
      PR.progress(TOTAL, TOTAL);
      PR.finish({
        stars: PR.starsFor(firstTry, TOTAL),
        title: 'Bravo, petit ranger !',
        text: 'Tu as trouvé toutes les parties ! Du premier coup : ' + firstTry + ' sur ' + TOTAL + '.',
        again: function () { list = deck(TOTAL); i = 0; firstTry = 0; ask(); }
      });
    }
    ask();
  };

  /* ================= Écris le mot ================= */
  var MSG = {
    perfect: 'Parfait ! Tout est juste.',
    typo: 'Presque parfait ! Regarde bien l\'orthographe :',
    number: 'Bravo ! Attention au pluriel :',
    numberSing: 'Bravo ! Attention au singulier :',
    accents: 'Bravo ! Attention aux accents :',
    'article-missing': 'Bravo ! N\'oublie pas l\'article :',
    article: 'Bravo ! Attention à l\'article :',
    wrong: 'Ce n\'est pas grave ! On écrit :'
  };
  PR.screens.spell = function (root) {
    var TOTAL = 6;
    var queue, retried, i, okCount, asked;
    function reset() { queue = deck(TOTAL); retried = {}; i = 0; okCount = 0; asked = 0; }
    reset();
    PR.topbar({ title: 'Écris le mot', ar: 'اكتب الكلمة', total: TOTAL });

    function ask() {
      var c = queue[i], hintLevel = 0, done = false;
      PR.debug = { card: c };
      root.textContent = '';
      PR.progress(TOTAL, Math.min(i, TOTAL));
      var scene = PR.Scene(c.animal);
      scene.light(c.part, 'glow');
      var cols = el('div.game-cols', scene.el);
      root.appendChild(cols);

      var input = el('input.spell-input', {
        type: 'text', autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false',
        lang: 'fr', 'aria-label': PR.fr('Écris le nom de la partie'), placeholder: PR.fr('Écris ici…'), enterkeyhint: 'done'
      });
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
      var accents = el('div.accents');
      ['é', 'è', 'ê', 'à', 'â', 'ç', 'î', 'ô', 'û', '\''].forEach(function (ch) {
        accents.appendChild(el('button', {
          type: 'button', raw: ch === '\'' ? '’' : ch, 'aria-label': ch,
          onmousedown: function (e) { e.preventDefault(); },
          onclick: function () {
            var s = input.selectionStart == null ? input.value.length : input.selectionStart;
            var e2 = input.selectionEnd == null ? s : input.selectionEnd;
            input.value = input.value.slice(0, s) + ch + input.value.slice(e2);
            input.focus();
            input.setSelectionRange(s + 1, s + 1);
            PR.audio.sfx('tap');
          }
        }));
      });
      var hint = el('div.hint');
      var actions = el('div.spell-actions',
        el('button.btn.plain.small', { type: 'button', html: PR.icons.bulb + '<span>' + PR.fr('Indice') + '</span>', onclick: giveHint }),
        el('button.btn.sky.small', { type: 'button', html: PR.icons.speak + '<span>' + PR.fr('Écouter') + '</span>', onclick: function () { PR.audio.unlock(); PR.audio.say(c.word); } }),
        el('button.btn', { type: 'button', text: 'Valider', onclick: submit })
      );
      var panel = el('div.card.spell-panel',
        el('div.spell-q', { text: 'Comment s\'appelle cette partie ?' }),
        el('div.hint', { text: 'Écris le mot avec son article : le, la, l\' ou les.' }),
        PR.arLine(PR.ar.spell),
        input, accents, hint, actions);
      cols.appendChild(panel);
      PR.suri.say('Regarde la partie qui brille. Comment s\'appelle-t-elle ?', 'think', { ar: PR.ar.spell });
      if (window.matchMedia('(pointer: fine)').matches) setTimeout(function () { input.focus({ preventScroll: true }); }, 300);

      function giveHint() {
        PR.audio.sfx('sparkle');
        hintLevel++;
        var parts = PR.answer.split(c.word);
        var show = Math.min(parts.noun.length - 1, hintLevel === 1 ? 1 : Math.ceil(parts.noun.length / 2));
        var masked = parts.noun.split('').map(function (ch, k) { return k < show ? ch : '_'; }).join(' ');
        hint.textContent = PR.fr('Indice : ' + (parts.article === 'l\'' ? 'l\'' : parts.article + ' ') + masked);
        PR.suri.say(hintLevel === 1 ? 'Voici la première lettre !' : 'Encore un petit coup de pouce !', 'encourage');
      }

      function submit() {
        if (done) return;
        PR.audio.unlock();
        var typed = input.value;
        var r = PR.answer.check(typed, c.word);
        if (r.empty) {
          PR.suri.say('Écris le mot dans la case blanche.', 'think');
          input.focus();
          return;
        }
        done = true;
        asked++;
        input.disabled = true;
        actions.remove(); accents.remove(); hint.remove();

        var note = r.ok ? (r.perfect ? 'perfect' : ['typo', 'number', 'accents', 'article-missing', 'article'].filter(function (n) { return r.notes.indexOf(n) >= 0; })[0]) : 'wrong';
        if (note === 'number' && !PR.isPlural(c.word)) note = 'numberSing';
        if (r.ok) okCount++;

        var spelled = el('div.spelled');
        var sp = PR.answer.split(c.word);
        if (sp.article) spelled.appendChild(el('span.l-art', { text: sp.article === 'l\'' ? 'l\'' : sp.article + ' ' }));
        r.marks.forEach(function (m) {
          spelled.appendChild(el('span.' + (r.perfect || m.ok ? 'l-ok' : 'l-fix'), { raw: m.ch }));
        });
        var box = el('div.answer.' + (r.ok ? 'good' : 'soft'),
          el('div.msg', { text: MSG[note] }),
          spelled,
          r.perfect ? null : el('div.typed', { text: 'Tu as écrit : « ' + typed.trim() + ' »' }),
          PR.arLine(c.ar));
        panel.appendChild(box);
        panel.appendChild(nextBtn('Continuer', next));
        panel.lastChild.focus({ preventScroll: true });

        scene.light(c.part, r.ok ? 'good' : 'soft');
        var pos = scene.anchor(c);
        scene.label(c.word, pos[0], pos[1] - 4, r.ok ? 'good' : 'soft');
        if (r.ok) {
          PR.audio.sfx(r.perfect ? 'great' : 'good');
          PR.sparkle.apply(null, center(box).concat([r.perfect ? 16 : 10]));
          PR.suri.say(r.perfect ? PR.line('praise') : 'Bravo ! Regarde bien la bonne orthographe.', 'cheer', { good: true });
        } else {
          PR.audio.sfx('oops');
          PR.suri.say('Ce n\'est pas grave ! Lis bien le mot. Tu le retrouveras plus tard.', 'encourage');
          if (!retried[c.id]) { retried[c.id] = true; queue.push(c); }
        }
        setTimeout(function () { PR.audio.say(c.word); }, 500);
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      function next() {
        i++;
        if (i < queue.length) ask(); else end();
      }
    }
    function end() {
      PR.progress(TOTAL, TOTAL);
      PR.finish({
        stars: PR.starsFor(okCount, asked),
        title: 'Bravo, petit écrivain !',
        text: 'Tu as écrit ' + okCount + ' mots sur ' + asked + '. Continue comme ça !',
        again: function () { reset(); ask(); }
      });
    }
    ask();
  };

  /* ================= Quiz ================= */
  PR.screens.quiz = function (root) {
    var TOTAL = 8;
    var qs, i, firstTry;
    function build() {
      var withSound = PR.data.animals.filter(function (a) { return PR.audio.hasAnimal(a.id); });
      var types = ['whose', 'name', 'whose', 'name', 'whose', 'name', 'sound', 'sound'];
      if (withSound.length < 3) types = types.map(function (t) { return t === 'sound' ? 'whose' : t; });
      types = PR.shuffle(types);
      var cards = deck(TOTAL);
      var sounds = PR.shuffle(withSound);
      qs = types.map(function (t, k) { return { type: t, card: cards[k], animal: t === 'sound' ? sounds.pop() : null }; });
      i = 0; firstTry = 0;
    }
    build();
    PR.topbar({ title: 'Quiz', ar: 'الأسئلة', total: TOTAL });

    function animalChoices(correctId, excludeIds) {
      var others = PR.shuffle(PR.data.animals.filter(function (a) { return a.id !== correctId && excludeIds.indexOf(a.id) < 0; })).slice(0, 2);
      return PR.shuffle([PR.data.animal(correctId)].concat(others));
    }

    function ask() {
      var q = qs[i], tries = 0, solved = false;
      PR.debug = { q: q };
      root.textContent = '';
      PR.progress(TOTAL, i);
      var box = el('div.card.quiz-card');
      var body = el('div.quiz-body');
      var choices = el('div.choices');
      var answerSay;

      function pick(btn, ok, sayText) {
        if (solved) return;
        PR.audio.unlock();
        if (ok) {
          solved = true;
          if (tries === 0) firstTry++;
          btn.classList.add('good');
          PR.audio.sfx(tries === 0 ? 'great' : 'good');
          PR.sparkle.apply(null, center(btn).concat([14]));
          PR.suri.say(PR.line('praise'), 'cheer', { good: true });
          PR.progress(TOTAL, i + 1);
          setTimeout(function () { PR.audio.say(sayText); }, 400);
          box.appendChild(nextBtn(i + 1 < TOTAL ? 'Question suivante' : 'Terminer', function () { i++; if (i < TOTAL) ask(); else end(); }));
          box.lastChild.focus({ preventScroll: true });
        } else {
          tries++;
          btn.classList.add('nope');
          PR.audio.sfx('oops');
          PR.suri.say(PR.line('encourage'), 'encourage');
        }
      }

      if (q.type === 'whose') {
        var c = q.card;
        var sameWord = PR.data.cards.filter(function (x) { return x.word === c.word && x.animal !== c.animal; }).map(function (x) { return x.animal; });
        box.appendChild(el('div.quiz-q', { text: 'À qui ' + (PR.isPlural(c.word) ? 'sont ' : 'est ') + demo(c.word) + ' ?' }));
        box.appendChild(PR.arLine(PR.ar.quizWhose));
        body.appendChild(el('div.loupe', { html: PR.zoomSVG(c) }));
        animalChoices(c.animal, sameWord).forEach(function (a) {
          var b = el('button.choice', { type: 'button' }, el('div.pic', { html: PR.portraitSVG(a.id) }), el('span', { text: PR.cap(a.name) }), PR.arLine(a.ar));
          b.addEventListener('click', function () { pick(b, a.id === c.animal, c.full); });
          choices.appendChild(b);
        });
        PR.suri.say('Regarde dans la loupe. À qui est cette partie ?', 'think', { ar: PR.ar.quizWhose });
      } else if (q.type === 'name') {
        var c2 = q.card;
        var scene = PR.Scene(c2.animal);
        scene.light(c2.part, 'glow');
        box.appendChild(el('div.quiz-q', { text: 'Comment s\'appelle cette partie ?' }));
        box.appendChild(PR.arLine(PR.ar.quizName));
        body.appendChild(scene.el);
        var sameAnimal = PR.data.cardsOf(c2.animal).filter(function (x) { return x.word !== c2.word; });
        var rest = PR.data.cards.filter(function (x) { return x.word !== c2.word && x.animal !== c2.animal; });
        var wrong = [];
        PR.shuffle(sameAnimal).concat(PR.shuffle(rest)).forEach(function (x) {
          if (wrong.length < 2 && wrong.indexOf(x.word) < 0) wrong.push(x.word);
        });
        PR.shuffle([c2.word].concat(wrong)).forEach(function (w) {
          var b = el('button.choice.word-choice', { type: 'button', text: w });
          b.addEventListener('click', function () { pick(b, w === c2.word, c2.word); });
          choices.appendChild(b);
        });
        PR.suri.say('Quelle partie brille ? Choisis le bon mot.', 'think', { ar: PR.ar.quizName });
      } else {
        var an = q.animal;
        var orb = el('button.sound-orb', { type: 'button', 'aria-label': PR.fr('Écouter le bruit'), html: PR.icons.speak });
        orb.style.color = '#fff';
        var playSound = function () {
          PR.audio.unlock();
          orb.classList.add('playing');
          PR.audio.animal(an.id).then(function () { orb.classList.remove('playing'); });
        };
        orb.addEventListener('click', playSound);
        box.appendChild(el('div.quiz-q', { text: 'Qui fait ce bruit ?' }));
        box.appendChild(PR.arLine(PR.ar.quizSound));
        body.appendChild(orb);
        var withSound = PR.data.animals.filter(function (a) { return PR.audio.hasAnimal(a.id) && a.id !== an.id; }).map(function (a) { return a.id; });
        var excl = PR.data.animals.filter(function (a) { return withSound.indexOf(a.id) < 0 && a.id !== an.id; }).map(function (a) { return a.id; });
        animalChoices(an.id, excl).forEach(function (a) {
          var b = el('button.choice', { type: 'button' }, el('div.pic', { html: PR.portraitSVG(a.id) }), el('span', { text: PR.cap(a.name) }), PR.arLine(a.ar));
          b.addEventListener('click', function () { pick(b, a.id === an.id, an.name); });
          choices.appendChild(b);
        });
        PR.suri.say('Écoute bien ! Qui fait ce bruit ?', 'think', { ar: PR.ar.quizSound });
        setTimeout(playSound, 500);
      }
      body.appendChild(choices);
      box.appendChild(body);
      root.appendChild(box);
    }
    function end() {
      PR.progress(TOTAL, TOTAL);
      PR.finish({
        stars: PR.starsFor(firstTry, TOTAL),
        title: 'Quiz terminé !',
        text: 'Bonnes réponses du premier coup : ' + firstTry + ' sur ' + TOTAL + '. Tu progresses très bien !',
        again: function () { build(); ask(); }
      });
    }
    ask();
  };

  /* ================= Mémoire ================= */
  PR.screens.memory = function (root) {
    var PAIRS = 6;
    PR.topbar({ title: 'Mémoire', ar: 'لعبة الذاكرة' });

    function start() {
      root.textContent = '';
      // six cards with six different words (no two « les oreilles »)
      var chosen = [], words = {};
      PR.shuffle(PR.data.cards).forEach(function (c) {
        if (chosen.length < PAIRS && !words[c.word]) { words[c.word] = true; chosen.push(c); }
      });
      var tiles = [];
      chosen.forEach(function (c) { tiles.push({ c: c, kind: 'pic' }); tiles.push({ c: c, kind: 'word' }); });
      tiles = PR.shuffle(tiles);
      var grid = el('div.mem-grid');
      PR.debug = { tiles: tiles };
      var open = [], busy = false, moves = 0, found = 0;
      var info = el('p.mem-info', { text: 'Retourne deux cartes : une image et son mot.' });

      tiles.forEach(function (t, k) {
        var front = el('div.face.front');
        if (t.kind === 'pic') {
          front.appendChild(el('div.pic', { html: PR.zoomSVG(t.c) }));
          t.who = el('div.who');
          front.appendChild(t.who);
        } else {
          front.appendChild(el('div.w', { text: t.c.word }));
          front.appendChild(PR.arLine(t.c.ar));
        }
        var b = el('button.mem-card', { type: 'button', 'aria-label': PR.fr('Carte ' + (k + 1)) },
          el('div.face.back', { html: PR.icons.paw }), front);
        b.style.animationDelay = (k * 0.04) + 's';
        t.btn = b;
        b.addEventListener('click', function () { flip(t); });
        grid.appendChild(b);
      });

      function flip(t) {
        PR.audio.unlock();
        if (busy || t.btn.classList.contains('open') || t.btn.classList.contains('matched')) return;
        PR.audio.sfx('flip');
        t.btn.classList.add('open');
        t.btn.setAttribute('aria-label', PR.fr(t.kind === 'word' ? t.c.word : 'Image : ' + t.c.word));
        open.push(t);
        if (open.length < 2) return;
        moves++;
        var a = open[0], b = open[1];
        open = [];
        if (a.c.id === b.c.id && a.kind !== b.kind) {
          found++;
          setTimeout(function () {
            a.btn.classList.add('matched'); b.btn.classList.add('matched');
            a.btn.classList.remove('open'); b.btn.classList.remove('open');
            [a, b].forEach(function (x) { if (x.who) x.who.textContent = PR.fr(PR.cap(PR.data.animal(x.c.animal).name)); });
            PR.audio.sfx('match');
            PR.sparkle.apply(null, center(b.btn).concat([12]));
            PR.suri.say(PR.line('praise') + ' ' + PR.cestPhrase(a.c), 'cheer', { good: true, ar: a.c.arFull });
            setTimeout(function () { PR.audio.say(a.c.full); }, 350);
            if (found === PAIRS) setTimeout(end, 1600);
          }, 350);
        } else {
          busy = true;
          PR.suri.say(a.kind === b.kind ? 'Il faut une image et un mot. Essaie encore !' : 'Ce n\'est pas la paire. Souviens-toi bien !', 'encourage');
          setTimeout(function () {
            a.btn.classList.remove('open'); b.btn.classList.remove('open');
            PR.audio.sfx('flip');
            busy = false;
          }, 1300);
        }
      }
      function end() {
        PR.finish({
          stars: moves <= 9 ? 3 : moves <= 14 ? 2 : 1,
          title: 'Quelle mémoire !',
          text: 'Tu as trouvé les ' + PAIRS + ' paires en ' + moves + ' coups.',
          again: start
        });
      }
      root.appendChild(el('div.screen-head', el('h1', { text: 'Retrouve les paires' }), PR.arLine(PR.ar.memory)));
      root.appendChild(grid);
      root.appendChild(info);
      PR.suri.say('Trouve l\'image et le mot qui vont ensemble !', 'happy', { ar: PR.ar.memory });
    }
    start();
  };
})();

/* Le Petit Ranger — « Les phrases »: short sentences with « avoir ».
   Four kinds of questions:
   - article: « Le lion a ___ crinière. » → un / une / des
   - vf:      « Le loup a des ailes. » → vrai ou faux ?
   - who:     « Qui a une trompe ? » → choose the animal
   - riddle:  « J'ai une trompe et des défenses. Qui suis-je ? » */
(function () {
  'use strict';
  var PR = (window.PR = window.PR || {});
  var el = PR.el, D;
  PR.screens = PR.screens || {};

  function center(node) { var r = node.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
  function sayIfRecorded(text) { if (PR.audio.hasVoice(text)) PR.audio.say(text); }
  // grammatical gender of a part (from « la crinière », « le bec », « les crocs »)
  function nounOf(c) { return PR.answer.split(c.word).noun; }
  function isFem(c) { return /^la /.test(c.word); }

  // Every sentence the activity can say (also used to make the voice clips).
  PR.phrasesTexts = function () {
    D = PR.data;
    var out = [];
    D.cards.forEach(function (c) { out.push(D.say.has(c.animal, c)); });
    D.falseParts.forEach(function (p) {
      var c = D.cards.filter(function (x) { return x.part === p; })[0];
      D.animals.forEach(function (a) { if (!D.animalHas(a.id, p)) out.push(D.say.has(a.id, c)); });
    });
    D.whoParts.forEach(function (p) { out.push(D.say.who(D.cards.filter(function (x) { return x.part === p; })[0])); });
    D.animals.forEach(function (a) { out.push(D.riddles[a.id]); });
    return out.filter(function (t, k) { return out.indexOf(t) === k; });
  };

  function buildQuestions(total) {
    D = PR.data;
    var kinds = PR.byLevel({
      facile: ['article', 'vf'],
      moyen: ['article', 'vf', 'who', 'riddle'],
      difficile: ['article', 'vf', 'who', 'riddle', 'article']
    });
    var cards = PR.shuffle(D.cards), riddles = PR.shuffle(D.animals.map(function (a) { return a.id; }));
    var whoCards = PR.shuffle(D.cards.filter(function (c) { return D.whoParts.indexOf(c.part) >= 0; }));
    var qs = [];
    for (var k = 0; k < total; k++) {
      var kind = kinds[k % kinds.length], c = cards[k % cards.length];
      if (kind === 'vf') {
        if (Math.random() < 0.5) {
          qs.push({ kind: 'vf', truth: true, animal: c.animal, card: c });
        } else {
          var p = PR.pick(D.falseParts), owner = D.cards.filter(function (x) { return x.part === p; })[0];
          var subjects = D.animals.filter(function (a) { return !D.animalHas(a.id, p); });
          qs.push({ kind: 'vf', truth: false, animal: PR.pick(subjects).id, card: owner });
        }
      } else if (kind === 'who') {
        qs.push({ kind: 'who', card: whoCards[k % whoCards.length] });
      } else if (kind === 'riddle') {
        qs.push({ kind: 'riddle', animal: riddles[k % riddles.length] });
      } else {
        qs.push({ kind: 'article', card: c });
      }
    }
    return PR.shuffle(qs);
  }

  PR.screens.phrases = function (root) {
    D = PR.data;
    var TOTAL = PR.byLevel({ facile: 6, moyen: 8, difficile: 10 });
    var N_CHOICES = PR.byLevel({ facile: 3, moyen: 3, difficile: 4 });
    var qs, i, firstTry;
    function reset() { qs = buildQuestions(TOTAL); i = 0; firstTry = 0; }
    reset();
    PR.topbar({ title: 'Les phrases', ar: 'الجمل', total: TOTAL, level: true });

    function animalButtons(correctId, allowed, onPick) {
      var others = PR.shuffle(D.animals.filter(function (a) { return a.id !== correctId && allowed(a.id); })).slice(0, N_CHOICES - 1);
      var box = el('div.choices');
      PR.shuffle([D.animal(correctId)].concat(others)).forEach(function (a) {
        var b = el('button.choice', { type: 'button' }, el('div.pic', { html: PR.portraitSVG(a.id) }), el('span', { text: PR.cap(a.name) }), PR.arLine(a.ar));
        b.addEventListener('click', function () { onPick(b, a.id === correctId); });
        box.appendChild(b);
      });
      return box;
    }

    function ask() {
      var q = qs[i], tries = 0, solved = false;
      PR.debug = { q: q };
      root.textContent = '';
      PR.progress(TOTAL, i);
      var box = el('div.card.quiz-card.phrase-card');
      var body = el('div.quiz-body.k-' + q.kind);
      var feedback = el('div.phrase-feedback');

      function next() { i++; if (i < TOTAL) ask(); else end(); }
      function win(btn, sentence, extra) {
        solved = true;
        if (tries === 0) firstTry++;
        if (btn) btn.classList.add('good');
        PR.audio.sfx(tries === 0 ? 'great' : 'good');
        if (btn) PR.sparkle.apply(null, center(btn).concat([14]));
        feedback.className = 'phrase-feedback good';
        feedback.textContent = '';
        feedback.appendChild(el('div', { text: sentence }));
        if (extra) feedback.appendChild(extra);
        PR.suri.say(PR.line('praise'), 'cheer', { good: true });
        PR.progress(TOTAL, i + 1);
        setTimeout(function () { sayIfRecorded(sentence); }, 350);
        box.appendChild(PR.nextBtn(i + 1 < TOTAL ? 'Phrase suivante' : 'Terminer', next));
        box.lastChild.focus({ preventScroll: true });
      }
      function miss(btn, why) {
        tries++;
        if (btn) btn.classList.add('nope');
        PR.audio.sfx('oops');
        PR.suri.say(why || PR.line('encourage'), 'encourage');
      }

      if (q.kind === 'article') {
        var c = q.card, scene = PR.Scene(c.animal);
        scene.light(c.part, 'glow');
        scene.focus(c);
        var blank = el('span.blank', { raw: '___' });
        var parts = D.say.blank(c).split('___');
        var line = el('div.phrase-line', el('span', { text: parts[0] }), blank, el('span', { text: parts[1] }));
        box.appendChild(el('div.quiz-q', { text: 'Complète la phrase.' }));
        box.appendChild(PR.arLine(PR.ar.article));
        body.appendChild(scene.el);
        var side = el('div.phrase-side', line);
        var opts = el('div.choices.article-choices');
        ['un', 'une', 'des'].forEach(function (art) {
          var b = el('button.choice.word-choice', { type: 'button', raw: art });
          b.addEventListener('click', function () {
            if (solved) return;
            PR.audio.unlock();
            if (art === c.article) {
              blank.textContent = art; blank.classList.add('filled');
              scene.clear(); scene.light(c.part, 'good');
              win(b, D.say.has(c.animal, c));
            } else {
              // explain the rule, kindly
              var n = nounOf(c), why;
              if (c.article === 'des') why = 'Il y en a plusieurs : on dit « des ».';
              else if (art === 'des') why = isFem(c) ? 'Il y en a une seule : on dit « une ».' : 'Il y en a un seul : on dit « un ».';
              else why = '« ' + n + ' » est ' + (isFem(c) ? 'féminin : on dit « une ».' : 'masculin : on dit « un ».');
              miss(b, why);
            }
          });
          opts.appendChild(b);
        });
        side.appendChild(opts);
        body.appendChild(side);
        PR.suri.say('Choisis le bon petit mot : un, une ou des ?', 'think', { ar: PR.ar.article });
      } else if (q.kind === 'vf') {
        var c2 = q.card, sentence = D.say.has(q.animal, c2);
        var scene2 = PR.Scene(q.animal);
        box.appendChild(el('div.quiz-q', { text: 'Vrai ou faux ?' }));
        box.appendChild(PR.arLine(PR.ar.trueFalse));
        body.appendChild(scene2.el);
        var side2 = el('div.phrase-side',
          el('div.phrase-line', { text: sentence }, PR.sayButton(sentence)));
        var tf = el('div.choices.tf-choices');
        [['Vrai', true], ['Faux', false]].forEach(function (o) {
          var b = el('button.choice.word-choice.tf-' + (o[1] ? 'true' : 'false'), { type: 'button', text: o[0] });
          b.addEventListener('click', function () {
            if (solved) return;
            PR.audio.unlock();
            var owner = D.animal(c2.animal);
            var explain = q.truth ? sentence : D.say.hasNot(q.animal, c2) + ' C\'est ' + owner.name + ' qui a ' + c2.indef + '.';
            if (q.truth) { scene2.light(c2.part, o[1] ? 'good' : 'soft'); }
            if (o[1] === q.truth) {
              win(b, (q.truth ? 'Oui ! ' : 'Non ! ') + explain);
            } else {
              // only two answers: show the right one straight away
              tries++;
              b.classList.add('nope');
              PR.audio.sfx('oops');
              solved = true;
              feedback.className = 'phrase-feedback soft';
              feedback.textContent = PR.fr((q.truth ? 'C\'est vrai ! ' : 'C\'est faux ! ') + explain);
              PR.suri.say('Ce n\'est pas grave ! Lis bien l\'explication.', 'encourage');
              PR.progress(TOTAL, i + 1);
              if (q.truth) setTimeout(function () { sayIfRecorded(sentence); }, 350);
              box.appendChild(PR.nextBtn(i + 1 < TOTAL ? 'Phrase suivante' : 'Terminer', next));
            }
          });
          tf.appendChild(b);
        });
        side2.appendChild(tf);
        body.appendChild(side2);
        PR.suri.say('Lis la phrase. Est-ce vrai ou faux ?', 'think', { ar: PR.ar.trueFalse });
        setTimeout(function () { sayIfRecorded(sentence); }, 400);
      } else if (q.kind === 'who') {
        var c3 = q.card, question = D.say.who(c3);
        box.appendChild(el('div.quiz-q', { text: question }, PR.sayButton(question)));
        box.appendChild(PR.arLine(PR.ar.who));
        body.appendChild(animalButtons(c3.animal, function (id) { return !D.animalHas(id, c3.part); }, function (b, ok) {
          if (solved) return;
          PR.audio.unlock();
          if (ok) win(b, D.say.has(c3.animal, c3));
          else miss(b);
        }));
        PR.suri.say('Quel animal a cette partie ?', 'think', { ar: PR.ar.who });
        setTimeout(function () { sayIfRecorded(question); }, 400);
      } else {
        var riddle = D.riddles[q.animal], who = D.animal(q.animal);
        box.appendChild(el('div.quiz-q', { text: 'Qui suis-je ?' }));
        box.appendChild(PR.arLine(PR.ar.riddle));
        body.appendChild(el('div.riddle', el('span', { text: riddle }), PR.sayButton(riddle)));
        body.appendChild(animalButtons(q.animal, function () { return true; }, function (b, ok) {
          if (solved) return;
          PR.audio.unlock();
          if (ok) win(b, 'Je suis ' + who.name + ' !');
          else miss(b, 'Relis bien les indices !');
        }));
        PR.suri.say('Lis les indices et devine l\'animal !', 'think', { ar: PR.ar.riddle });
        setTimeout(function () { sayIfRecorded(riddle); }, 400);
      }
      body.appendChild(feedback);
      box.appendChild(body);
      root.appendChild(box);
    }

    function end() {
      PR.progress(TOTAL, TOTAL);
      PR.finish({
        stars: PR.starsFor(firstTry, TOTAL),
        title: 'Bravo, petit ranger !',
        text: 'Bonnes réponses du premier coup : ' + firstTry + ' sur ' + TOTAL + '.',
        again: function () { reset(); ask(); }
      });
    }
    ask();
  };
})();

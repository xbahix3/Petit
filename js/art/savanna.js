/* Savanna at sunset — background of the title screen. */
(function () {
  'use strict';
  var PR = (window.PR = window.PR || {});
  PR.art = PR.art || {};

  PR.art.savanna = {
    viewBox: '0 0 800 600',

    defs: function (k) {
      return [
        k.linU('sky', 0, 0, 0, 460, [[0, '#F4A261'], [0.45, '#F8C982'], [1, '#FDEBC4']]),
        k.radU('sun', 250, 235, 330, [[0, '#FFF7DC'], [0.25, '#FFE9A8', 0.95], [0.6, '#FFD27A', 0.35], [1, '#FFD27A', 0]]),
        k.linU('hill1', 0, 380, 0, 460, [[0, '#EDB97A'], [1, '#E3A964']]),
        k.linU('hill2', 0, 410, 0, 470, [[0, '#DFA059'], [1, '#D6944C']]),
        k.linU('ground', 0, 440, 0, 600, [[0, '#E2B057'], [0.5, '#D9A04A'], [1, '#C7883A']])
      ].join('');
    },

    scene: function (k) {
      var acacia = function (x, y, s, c) {
        return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="' + c + '">' +
          k.path('M-3 0 C-2 -20 -6 -34 -16 -46 L-12 -48 C-4 -38 0 -30 1 -24 C4 -34 10 -42 20 -48 L23 -45 C12 -36 5 -24 4 0 Z') +
          k.shape([[-58, -48], [-40, -62], [-6, -68], [30, -66], [60, -54], [44, -45], [10, -48], [-30, -44]]) +
          '</g>';
      };
      return [
        '<rect width="800" height="600" fill="' + k.f('sky') + '"/>',
        '<circle class="a-glow" cx="250" cy="235" r="330" fill="' + k.f('sun') + '"/>',
        '<circle cx="250" cy="235" r="120" fill="#FFF3CF" opacity="0.55"/>',
        // birds
        '<g class="a-birds" fill="none" stroke="#9A5B33" stroke-width="2.4" stroke-linecap="round" opacity="0.55">',
        k.path('M560 120 q9 -8 16 0 q7 -8 16 0'),
        k.path('M610 95 q7 -6 12 0 q5 -6 12 0'),
        k.path('M520 150 q6 -5 10 0 q5 -5 10 0'),
        '</g>',
        // far hills and trees
        k.path('M0 420 C90 392 170 388 260 400 C360 414 430 380 520 378 C620 376 700 396 800 386 L800 470 L0 470 Z', 'fill="' + k.f('hill1') + '"'),
        acacia(640, 384, 0.9, '#CF9257'),
        acacia(96, 404, 0.62, '#D59A5D'),
        acacia(720, 390, 0.45, '#D59A5D'),
        k.path('M0 446 C120 430 230 436 330 442 C450 450 560 428 680 432 C740 434 780 440 800 438 L800 480 L0 480 Z', 'fill="' + k.f('hill2') + '"'),
        '<rect y="455" width="800" height="145" fill="' + k.f('ground') + '"/>',
        k.path('M0 456 C200 446 600 446 800 456 L800 470 C600 462 200 462 0 470 Z', 'fill="#E8BC68" opacity="0.6"'),
        k.grass({ x0: 0, x1: 800, y: 462, h: 26, count: 120, seed: 21, colors: ['#D49B47', '#C98E3C', '#E2B462', '#BF8434'], width: 4, dy: 10 }),
        k.grass({ x0: 0, x1: 800, y: 560, h: 30, count: 50, seed: 22, colors: ['#C78A38', '#B97C2F', '#D9A24C'], width: 5, dy: 40 })
      ].join('');
    },

    animal: function () { return ''; }
  };
})();

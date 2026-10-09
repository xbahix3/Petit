/* L'éléphant — sunny savanna with a waterhole.
   Parts: trompe, defenses, oreilles */
(function () {
  'use strict';
  var PR = (window.PR = window.PR || {});
  PR.art = PR.art || {};

  PR.art.elephant = {
    viewBox: '0 0 800 600',

    defs: function (k) {
      return [
        k.linU('sky', 0, 0, 0, 430, [[0, '#6EC1EE'], [0.6, '#A9DDF6'], [1, '#E3F6FD']]),
        k.radU('sun', 680, 90, 120, [[0, '#FFFBE0'], [0.35, '#FFF1A8', 0.9], [1, '#FFF1A8', 0]]),
        k.linU('mount', 0, 250, 0, 430, [[0, '#9DBBD3'], [1, '#B9D3E3']]),
        k.linU('hill', 0, 380, 0, 470, [[0, '#B9C877'], [1, '#A7B862']]),
        k.linU('ground', 0, 450, 0, 600, [[0, '#CFC676'], [0.5, '#C2B964'], [1, '#AFA552']]),
        k.linU('water', 0, 490, 0, 560, [[0, '#7FD0EA'], [1, '#3E9CC4']]),
        k.linU('canopy', 0, 330, 0, 420, [[0, '#8DB04E'], [1, '#5F8233']]),
        k.linU('skin', 0, 160, 0, 450, [[0, '#BBC3CC'], [0.55, '#A4ADB8'], [1, '#8F98A4']]),
        k.linU('skinFar', 0, 360, 0, 540, [[0, '#8E97A3'], [1, '#808995']]),
        k.linU('leg', 0, 380, 0, 545, [[0, '#A7B0BB'], [1, '#B3BBC5']]),
        k.radU('head', 240, 190, 170, [[0, '#CBD2DA'], [0.6, '#AEB7C1'], [1, '#97A0AC']]),
        k.radU('ear', 0.6, 0.45, 0.7, [[0, '#C2B0B4'], [0.6, '#A9A2AD'], [1, '#949CA8']]),
        k.linU('trunk', 0, 250, 0, 470, [[0, '#AAB3BE'], [1, '#9CA5B1']]),
        k.linU('tusk', 0, 310, 0, 420, [[0, '#F2E7CF'], [0.4, '#FFFBF0'], [1, '#EFE2C4']])
      ].join('');
    },

    scene: function (k) {
      var small = function (x, y, sc) {
        return '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')" fill="#8FA765" opacity="0.8">' +
          k.path('M-3 0 L-2 -30 L2 -30 L3 0 Z') + k.shape([[-40, -30], [-24, -42], [0, -46], [26, -42], [40, -30], [0, -26]]) + '</g>';
      };
      var tree = small(520, 412, 0.7) + small(600, 410, 0.5) + small(36, 424, 0.6) +
        '<g transform="translate(772 456) scale(0.85)">' +
        k.path('M-8 0 C-6 -40 -14 -70 -36 -96 L-28 -100 C-12 -82 -2 -64 2 -50 C8 -70 20 -88 40 -102 L46 -96 C26 -80 12 -56 10 0 Z', 'fill="#6E5236"') +
        k.shape([[-120, -100], [-90, -124], [-40, -136], [20, -138], [80, -130], [124, -108], [96, -94], [40, -98], [-20, -94], [-80, -92]], 'fill="' + k.f('canopy') + '"') +
        k.shape([[-100, -108], [-60, -128], [0, -134], [60, -128], [104, -110], [60, -116], [0, -120], [-60, -116]], 'fill="#A3C463" opacity="0.6"') +
        '</g>';
      return [
        '<rect width="800" height="600" fill="' + k.f('sky') + '"/>',
        '<circle class="a-glow" cx="680" cy="90" r="120" fill="' + k.f('sun') + '"/>',
        '<circle cx="680" cy="90" r="34" fill="#FFF8D2"/>',
        k.cloud(140, 90, 0.9), k.cloud(470, 70, 0.7), k.cloud(330, 140, 0.45),
        k.path('M0 430 C120 404 240 410 340 420 C460 432 560 404 680 408 C740 410 780 418 800 416 L800 480 L0 480 Z', 'fill="' + k.f('hill') + '"'),
        '<rect y="456" width="800" height="144" fill="' + k.f('ground') + '"/>',
        k.grass({ x0: 0, x1: 800, y: 462, h: 22, count: 110, seed: 51, colors: ['#B5B25C', '#A9A751', '#C9C673', '#9E9C48'], width: 4, dy: 10 }),
        tree,
        // waterhole
        '<ellipse cx="120" cy="528" rx="150" ry="34" fill="' + k.f('water') + '"/>',
        '<ellipse cx="120" cy="528" rx="150" ry="34" fill="none" stroke="#9C9150" stroke-width="5" opacity="0.6"/>',
        k.path('M40 520 Q80 514 120 518', 'fill="none" stroke="#E8FAFF" stroke-width="4" stroke-linecap="round" opacity="0.8"'),
        k.path('M130 538 Q160 534 190 538', 'fill="none" stroke="#E8FAFF" stroke-width="3" stroke-linecap="round" opacity="0.6"'),
        k.grass({ x0: 0, x1: 800, y: 575, h: 30, count: 40, seed: 52, colors: ['#9E9C48', '#B5B25C', '#8D8B3E'], width: 5, dy: 30 })
      ].join('');
    },

    animal: function (k) {
      var g = [];
      g.push('<ellipse cx="500" cy="545" rx="230" ry="15" fill="#5E5A2C" opacity="0.32" filter="' + k.f('blur6') + '"/>');

      // tail
      g.push('<g class="a-tail" style="transform-origin:694px 270px">');
      g.push(k.line([[694, 268], [706, 300], [712, 340]], 'fill="none" stroke="#8F98A4" stroke-width="6" stroke-linecap="round"'));
      g.push('<g stroke="#4E5560" stroke-width="2.4" stroke-linecap="round" fill="none">' + k.path('M712 338 l-5 18') + k.path('M712 338 l0 20') + k.path('M712 338 l5 17') + k.path('M712 338 l-9 14') + '</g>');
      g.push('</g>');

      // far legs
      function pillar(x0, x1, top, fill) {
        var h = 540 - top;
        return k.shape([[x0, top], [x1, top], [x1 + 3, top + h * 0.35], [x1 + 7, top + h * 0.58], [x1 + 2, top + h * 0.8], [x1 + 8, 532], [x1 + 4, 541], [x0 - 4, 541], [x0 - 8, 532], [x0 - 2, top + h * 0.8], [x0 - 6, top + h * 0.58], [x0 - 2, top + h * 0.35]], 'fill="' + fill + '"');
      }
      g.push(pillar(420, 478, 380, k.f('skinFar')));
      g.push(pillar(540, 598, 380, k.f('skinFar')));

      // body
      g.push('<g class="a-breathe" style="transform-origin:500px 440px">');
      g.push(k.shape([[330, 210], [400, 176], [480, 164], [560, 170], [630, 194], [680, 238], [700, 300], [694, 360], [668, 408], [600, 434], [500, 440], [400, 434], [340, 408], [312, 340], [312, 270]], 'fill="' + k.f('skin') + '"'));
      g.push(k.shape([[600, 220], [672, 250], [696, 320], [680, 390], [630, 426], [650, 340]], 'fill="#7C8593" opacity="0.3"'));
      g.push(k.line([[400, 182], [480, 170], [560, 176], [626, 200]], 'fill="none" stroke="#DDE3EA" stroke-width="7" stroke-linecap="round" opacity="0.6"'));
      // skin wrinkles
      g.push('<g fill="none" stroke="#7F8896" stroke-width="2.4" stroke-linecap="round" opacity="0.45">' +
        k.path('M600 250 Q622 300 610 350') + k.path('M618 262 Q636 300 628 340') +
        k.path('M470 400 Q500 410 530 404') + k.path('M440 210 Q460 230 456 260') + '</g>');
      g.push('</g>');

      // near legs with toenails
      function nails(cx) {
        return [-16, 0, 16].map(function (dx) {
          return '<ellipse cx="' + (cx + dx) + '" cy="532" rx="7" ry="5" fill="#EDE6D6"/>';
        }).join('');
      }
      g.push(pillar(332, 404, 360, k.f('leg')));
      g.push(k.line([[340, 470], [368, 476], [396, 470]], 'fill="none" stroke="#7F8896" stroke-width="2.4" stroke-linecap="round" opacity="0.5"'));
      g.push(k.line([[342, 482], [368, 488], [394, 482]], 'fill="none" stroke="#7F8896" stroke-width="2.4" stroke-linecap="round" opacity="0.4"'));
      g.push(nails(368));
      g.push(k.shape([[596, 300], [650, 288], [686, 330], [690, 400], [681, 452], [686, 520], [684, 541], [606, 541], [602, 522], [608, 462], [598, 404], [588, 344]], 'fill="' + k.f('leg') + '"'));
      g.push(k.line([[596, 312], [588, 350], [596, 404]], 'fill="none" stroke="#7F8896" stroke-width="3" stroke-linecap="round" opacity="0.35"'));
      g.push(k.line([[614, 470], [642, 476], [670, 470]], 'fill="none" stroke="#7F8896" stroke-width="2.4" stroke-linecap="round" opacity="0.5"'));
      g.push(nails(642));

      // head group
      g.push('<g class="a-nod" style="transform-origin:255px 330px">');

      // ---- les oreilles
      var earL = [[200, 168], [160, 136], [108, 134], [64, 166], [46, 228], [54, 300], [84, 354], [122, 394], [152, 414], [168, 392], [178, 350], [194, 310], [200, 260]];
      var earLin = [[192, 182], [158, 156], [114, 156], [80, 184], [68, 236], [76, 296], [102, 344], [134, 378], [154, 390], [162, 366], [172, 330], [186, 296], [192, 252]];
      g.push('<g data-part="oreilles">');
      g.push('<g class="a-earL" style="transform-origin:200px 220px">');
      g.push(k.shape(earL, 'fill="#9AA3AF"'));
      g.push(k.shape(earLin, 'fill="' + k.f('ear') + '"'));
      g.push(k.line([[176, 200], [130, 220], [100, 270]], 'fill="none" stroke="#8D8597" stroke-width="2.5" stroke-linecap="round" opacity="0.5"'));
      g.push(k.line([[180, 260], [140, 290], [120, 340]], 'fill="none" stroke="#8D8597" stroke-width="2.5" stroke-linecap="round" opacity="0.4"'));
      g.push(k.line([[108, 140], [72, 168], [52, 226]], 'fill="none" stroke="#D9DFE6" stroke-width="5" stroke-linecap="round" opacity="0.6"'));
      g.push('</g>');
      g.push('<g class="a-earR" style="transform-origin:310px 220px">');
      g.push(k.shape(k.mirror(earL, 255), 'fill="#9AA3AF"'));
      g.push(k.shape(k.mirror(earLin, 255), 'fill="' + k.f('ear') + '"'));
      g.push(k.line(k.mirror([[176, 200], [130, 220], [100, 270]], 255), 'fill="none" stroke="#8D8597" stroke-width="2.5" stroke-linecap="round" opacity="0.5"'));
      g.push(k.line(k.mirror([[180, 260], [140, 290], [120, 340]], 255), 'fill="none" stroke="#8D8597" stroke-width="2.5" stroke-linecap="round" opacity="0.4"'));
      g.push(k.line(k.mirror([[108, 140], [72, 168], [52, 226]], 255), 'fill="none" stroke="#D9DFE6" stroke-width="5" stroke-linecap="round" opacity="0.6"'));
      g.push('</g>');
      g.push('</g>');

      // head dome
      g.push(k.shape([[255, 138], [302, 146], [332, 180], [340, 226], [332, 270], [312, 304], [288, 322], [255, 330], [222, 322], [198, 304], [178, 270], [170, 226], [178, 180], [208, 146]], 'fill="' + k.f('head') + '"'));
      g.push(k.path('M210 160 Q255 140 300 160', 'fill="none" stroke="#E2E7EC" stroke-width="6" stroke-linecap="round" opacity="0.7"'));

      // ---- la trompe
      var trunk = [[255, 252], [256, 300], [254, 350], [246, 398], [232, 436], [210, 458], [188, 456], [180, 438], [188, 424]];
      g.push('<g data-part="trompe" class="a-trunk" style="transform-origin:255px 280px">');
      g.push(k.path(k.tube(trunk, [66, 58, 48, 40, 33, 28, 25, 23, 22]), 'fill="' + k.f('trunk') + '"'));
      g.push(k.path(k.tube(trunk.slice(0, 6), [20, 16, 12, 10, 8, 6]).replace(/^/, ''), 'fill="#C3CAD3" opacity="0.5" transform="translate(-12 0)"'));
      // wrinkle rings
      var rings = '';
      for (var i = 0; i < 9; i++) {
        var y = 290 + i * 17, half = 26 - i * 2.3, cx = 255 - Math.max(0, (y - 340)) * 0.2;
        rings += k.path('M' + (cx - half) + ' ' + y + ' Q' + cx + ' ' + (y + 6) + ' ' + (cx + half) + ' ' + y);
      }
      g.push('<g fill="none" stroke="#7E8794" stroke-width="2.2" stroke-linecap="round" opacity="0.55">' + rings + '</g>');
      g.push('<ellipse cx="189" cy="428" rx="8" ry="6" fill="#6E7682" transform="rotate(-30 189 428)"/>');
      g.push('<rect class="hit" x="170" y="250" width="110" height="225" rx="40" fill="transparent"/>');
      g.push('</g>');

      // ---- les défenses
      var tuskL = [[228, 314], [216, 346], [208, 374], [210, 398], [222, 414]];
      g.push('<g data-part="defenses">');
      g.push(k.path(k.tube(tuskL, [16, 14, 12, 9, 5], { sharp: true }), 'fill="' + k.f('tusk') + '" stroke="#CDBE9C" stroke-width="1.2"'));
      g.push(k.path(k.tube(k.mirror(tuskL, 255), [16, 14, 12, 9, 5], { sharp: true }), 'fill="' + k.f('tusk') + '" stroke="#CDBE9C" stroke-width="1.2"'));
      g.push('<rect class="hit" x="188" y="304" width="44" height="124" rx="18" fill="transparent"/>');
      g.push('<rect class="hit" x="278" y="304" width="44" height="124" rx="18" fill="transparent"/>');
      g.push('</g>');
      // lip sheaths over the tusk roots
      g.push('<ellipse cx="226" cy="314" rx="17" ry="12" fill="#A1AAB5"/>');
      g.push('<ellipse cx="284" cy="314" rx="17" ry="12" fill="#A1AAB5"/>');

      // eyes with lashes
      function eye(cx, s) {
        var out = '<ellipse cx="' + cx + '" cy="236" rx="13" ry="10" fill="#8D96A2" opacity="0.6"/>';
        out += '<ellipse cx="' + cx + '" cy="236" rx="8" ry="8.5" fill="#2E2219"/>';
        out += '<circle cx="' + (cx + 2.5 * s) + '" cy="232.5" r="2.8" fill="#fff"/>';
        out += '<circle cx="' + (cx - 2 * s) + '" cy="239" r="1.3" fill="#fff" opacity="0.7"/>';
        out += '<g class="a-blink" style="transform-origin:' + cx + 'px 226px;transform:scaleY(0)"><ellipse cx="' + cx + '" cy="236" rx="10" ry="10" fill="#A6AFBA"/></g>';
        out += k.path('M' + (cx - 11) + ' 230 Q' + cx + ' 222 ' + (cx + 11) + ' 230', 'fill="none" stroke="#4A4F58" stroke-width="2.6" stroke-linecap="round"');
        out += '<g stroke="#4A4F58" stroke-width="2" stroke-linecap="round" fill="none">' +
          k.path('M' + (cx + 10 * s) + ' 230 q' + (5 * s) + ' -1 ' + (8 * s) + ' -5') + k.path('M' + (cx + 7 * s) + ' 226.5 q' + (4 * s) + ' -2 ' + (5 * s) + ' -7') + '</g>';
        return out;
      }
      g.push(eye(222, -1));
      g.push(eye(288, 1));
      // cheek blush
      g.push('<ellipse cx="206" cy="272" rx="14" ry="8" fill="#D7A9B0" opacity="0.45"/>');
      g.push('<ellipse cx="304" cy="272" rx="14" ry="8" fill="#D7A9B0" opacity="0.45"/>');
      g.push('</g>');
      return g.join('');
    }
  };
})();

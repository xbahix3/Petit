/* Le loup — howling at the full moon on a rock, pine forest at night.
   Parts: museau, oreilles, fourrure */
(function () {
  'use strict';
  var PR = (window.PR = window.PR || {});
  PR.art = PR.art || {};

  function pine(k, x, y, h, fill) {
    var w = h * 0.42, pts = [];
    var tiers = 4;
    pts.push([x, y - h]);
    for (var i = 1; i <= tiers; i++) {
      var ty = y - h + (h * 0.9 * i) / tiers;
      var tw = (w * i) / tiers;
      pts.push([x + tw, ty]);
      if (i < tiers) pts.push([x + tw * 0.55, ty - h * 0.02]);
    }
    var right = pts.slice(1);
    var left = right.map(function (p) { return [2 * x - p[0], p[1]]; }).reverse();
    var d = 'M' + x + ' ' + (y - h) + right.map(function (p) { return ' L' + k.n(p[0]) + ' ' + k.n(p[1]); }).join('') +
      ' L' + (x + 5) + ' ' + (y - h * 0.1) + ' L' + (x + 5) + ' ' + y + ' L' + (x - 5) + ' ' + y + ' L' + (x - 5) + ' ' + (y - h * 0.1) +
      left.map(function (p) { return ' L' + k.n(p[0]) + ' ' + k.n(p[1]); }).join('') + ' Z';
    return k.path(d, 'fill="' + fill + '"');
  }

  PR.art.loup = {
    viewBox: '0 0 800 600',

    defs: function (k) {
      return [
        k.linU('sky', 0, 0, 0, 500, [[0, '#14213D'], [0.55, '#2C4470'], [1, '#56719E']]),
        k.radU('moonGlow', 170, 130, 230, [[0, '#FFF6D8', 0.9], [0.3, '#D9E4FF', 0.35], [1, '#9FB6E0', 0]]),
        k.radU('moon', 160, 118, 80, [[0, '#FFFDF1'], [0.7, '#FFF3CF'], [1, '#F2DFA8']]),
        k.linU('rock', 0, 470, 0, 600, [[0, '#56688A'], [1, '#2B3850']]),
        k.linU('fur', 300, 120, 560, 520, [[0, '#6C7684'], [0.5, '#8F99A6'], [1, '#717B89']]),
        k.linU('furBack', 0, 200, 0, 520, [[0, '#4C5563'], [1, '#626C7A']]),
        k.linU('chest', 0, 200, 0, 470, [[0, '#F1ECE1'], [1, '#CFC8BA']]),
        k.linU('muzzle', 0, 96, 0, 160, [[0, '#BCC3CC'], [1, '#EFEBE2']]),
        k.radU('iris', 0, 0, 1, [[0, '#FFE58A'], [0.7, '#F2B230'], [1, '#B8740E']]),
        k.linU('tail', 420, 440, 640, 520, [[0, '#E9E4D8'], [0.35, '#A2ABB6'], [1, '#5E6876']])
      ].join('');
    },

    scene: function (k) {
      var r = k.rng(99), stars = '';
      for (var i = 0; i < 60; i++) {
        var x = r() * 800, y = r() * 380, s = 0.6 + r() * 1.8;
        if (Math.hypot(x - 170, y - 130) < 120) continue;
        stars += '<circle cx="' + k.n(x) + '" cy="' + k.n(y) + '" r="' + k.n(s) + '" fill="#FFFFFF" opacity="' + k.n(0.4 + r() * 0.6) + '"' +
          (i % 5 === 0 ? ' class="a-twinkle" style="animation-delay:' + k.n(r() * 3) + 's"' : '') + '/>';
      }
      var trees = '';
      [[30, 480, 150], [90, 486, 110], [700, 478, 170], [760, 486, 120], [630, 490, 100], [210, 490, 90], [560, 492, 80]].forEach(function (t) {
        trees += pine(k, t[0], t[1], t[2], '#1E3350');
      });
      var near = '';
      [[0, 520, 200], [790, 520, 210], [56, 530, 140]].forEach(function (t) {
        near += pine(k, t[0], t[1], t[2], '#132339');
      });
      return [
        '<rect width="800" height="600" fill="' + k.f('sky') + '"/>',
        stars,
        '<circle class="a-glow" cx="170" cy="130" r="230" fill="' + k.f('moonGlow') + '"/>',
        '<circle cx="170" cy="130" r="72" fill="' + k.f('moon') + '"/>',
        '<circle cx="146" cy="112" r="12" fill="#EADBB0" opacity="0.6"/><circle cx="190" cy="150" r="17" fill="#EADBB0" opacity="0.5"/><circle cx="186" cy="102" r="7" fill="#EADBB0" opacity="0.6"/>',
        k.path('M0 470 C120 440 260 452 400 446 C540 440 660 430 800 444 L800 600 L0 600 Z', 'fill="#2A3F63"'),
        trees,
        k.path('M0 500 C160 486 300 494 420 490 C560 486 700 480 800 492 L800 600 L0 600 Z', 'fill="#20324F"'),
        // rock the wolf sits on
        k.shape([[220, 610], [236, 540], [290, 500], [380, 482], [500, 480], [620, 472], [720, 492], [790, 540], [810, 610]], 'fill="' + k.f('rock') + '"'),
        k.line([[262, 520], [300, 500], [380, 486], [500, 484], [620, 476], [700, 490]], 'fill="none" stroke="#9FB4D4" stroke-width="4" stroke-linecap="round" opacity="0.5"'),
        k.path('M330 540 l40 -10 l30 18 M560 520 l50 6 l20 -14', 'fill="none" stroke="#23304A" stroke-width="3" stroke-linecap="round" opacity="0.6"'),
        near
      ].join('');
    },

    animal: function (k) {
      var g = [];
      g.push('<ellipse cx="510" cy="508" rx="160" ry="12" fill="#0E1626" opacity="0.5" filter="' + k.f('blur6') + '"/>');

      // ---- la fourrure (neck, body, chest, legs, tail)
      g.push('<g data-part="fourrure">');
      // far front leg
      g.push(k.shape([[420, 330], [458, 336], [460, 420], [456, 480], [464, 500], [462, 510], [414, 510], [416, 496], [424, 478], [422, 420]], 'fill="' + k.f('furBack') + '"'));
      g.push('<g class="a-breathe" style="transform-origin:520px 500px">');
      // neck + body silhouette (sitting)
      g.push(k.shape([[372, 196], [420, 186], [456, 196], [480, 240], [524, 286], [574, 336], [612, 386], [624, 440], [608, 488], [562, 510], [500, 512], [452, 500], [430, 468], [418, 420], [400, 350], [380, 290], [364, 240]], 'fill="' + k.f('fur') + '"'));
      // darker saddle on the back
      g.push(k.shape([[440, 196], [470, 220], [520, 280], [574, 330], [606, 380], [590, 380], [540, 330], [490, 286], [452, 240]], 'fill="#4E5866" opacity="0.45"'));
      // haunch
      g.push(k.path('M480 500 C470 440 500 392 552 384 C600 380 626 420 620 462', 'fill="none" stroke="#5A6472" stroke-width="5" stroke-linecap="round" opacity="0.5"'));
      g.push(k.shape([[506, 398], [552, 390], [598, 404], [610, 432], [586, 418], [550, 410]], 'fill="#C3CBD4" opacity="0.4"'));
      g.push(k.fur({ cx: 540, cy: 420, rx: 70, ry: 70, count: 18, len: 14, angle: 70, seed: 4, color: '#C9D1DA', width: 2, opacity: 0.22 }));
      // moonlight rim along the back
      g.push(k.line([[424, 188], [462, 202], [484, 244], [526, 290], [576, 340], [612, 392]], 'fill="none" stroke="#D6E4FF" stroke-width="4" stroke-linecap="round" opacity="0.65"'));
      // cream chest with a fluffy front edge
      g.push(k.path(k.tufts({ cx: 442, cy: 276, r1: 62, r2: 78, n: 8, seed: 21, start: 2.2, end: 4.05, curl: 0.3, round: 0.8, sy: 1.25, jitter: 0.15 }) + ' Q456 276 408 338 Z', 'fill="' + k.f('chest') + '"'));
      g.push(k.fur({ cx: 400, cy: 280, rx: 22, ry: 50, count: 14, len: 12, angle: 105, seed: 9, color: '#B5AE9F', width: 1.8, opacity: 0.5 }));
      g.push('</g>');
      // hind paw
      g.push(k.shape([[470, 490], [530, 488], [548, 500], [546, 514], [468, 514], [462, 502]], 'fill="#9AA3AF"'));
      // near front leg (grey with a cream front)
      g.push(k.shape([[392, 316], [438, 326], [442, 420], [436, 480], [444, 500], [442, 514], [382, 514], [384, 500], [396, 478], [398, 420]], 'fill="' + k.f('fur') + '"'));
      g.push(k.shape([[392, 330], [408, 334], [410, 420], [406, 480], [400, 500], [386, 508], [394, 478], [396, 420]], 'fill="#E6E0D3"'));
      g.push('<g stroke="#7E8794" stroke-width="2" stroke-linecap="round">' + k.path('M400 506 l0 8') + k.path('M414 506 l0 8') + k.path('M428 506 l0 8') + '</g>');
      // tail curled in front of the paws
      g.push('<g class="a-tail2" style="transform-origin:600px 480px">');
      g.push(k.path(k.tube([[612, 470], [600, 500], [560, 516], [500, 520], [448, 516], [416, 504]], [44, 50, 52, 48, 40, 26]), 'fill="' + k.f('tail') + '"'));
      g.push(k.line([[596, 492], [560, 506], [500, 510], [450, 506]], 'fill="none" stroke="#4E5866" stroke-width="3" stroke-linecap="round" opacity="0.3"'));
      g.push(k.line([[590, 512], [550, 524], [490, 528]], 'fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.25"'));
      g.push('</g>');
      g.push('<path class="hit" d="M372 196 L470 196 L640 380 L640 530 L370 530 Z" fill="transparent"/>');
      g.push('</g>');

      // ---- head (looking up at the moon)
      g.push('<g class="a-howl" style="transform-origin:420px 230px">');
      // ---- les oreilles
      g.push('<g data-part="oreilles" class="a-ear" style="transform-origin:410px 140px">');
      g.push(k.shape([[404, 146], [432, 88], [452, 152]], 'fill="#4B5462"', 0.4));
      g.push(k.shape([[376, 138], [392, 74], [422, 138]], 'fill="#6D7785"', 0.4));
      g.push(k.shape([[386, 132], [394, 94], [408, 134]], 'fill="#D8B9B5"', 0.4));
      g.push(k.line([[382, 134], [392, 80]], 'fill="none" stroke="#D6E4FF" stroke-width="3" stroke-linecap="round" opacity="0.6"'));
      g.push('<circle class="hit" cx="410" cy="114" r="36" fill="transparent"/>');
      g.push('</g>');
      // skull
      g.push(k.shape([[456, 186], [448, 150], [418, 126], [376, 122], [338, 132], [314, 150], [318, 176], [344, 198], [384, 214], [426, 212]], 'fill="' + k.f('fur') + '"'));
      g.push(k.path(k.tufts({ cx: 396, cy: 186, r1: 26, r2: 40, n: 5, seed: 5, start: 0.5, end: 2.2, curl: 0.3, round: 0.8 }) + 'L396 186Z', 'fill="#E6E0D3"'));
      g.push(k.line([[330, 134], [370, 122], [416, 124]], 'fill="none" stroke="#D6E4FF" stroke-width="4" stroke-linecap="round" opacity="0.55"'));
      // ---- le museau
      g.push('<g data-part="museau">');
      g.push(k.shape([[264, 122], [292, 138], [320, 158], [344, 176], [348, 154], [314, 136], [282, 122]], 'fill="#E7E1D4"', 0.8));
      g.push(k.shape([[254, 112], [284, 128], [312, 146], [300, 128], [270, 114]], 'fill="#2B1F23"', 0.7));
      g.push(k.shape([[342, 128], [306, 112], [272, 96], [248, 86], [234, 92], [240, 106], [268, 116], [304, 130], [332, 150]], 'fill="' + k.f('muzzle') + '"', 0.8));
      g.push('<ellipse cx="241" cy="91" rx="12" ry="9" fill="#22252B" transform="rotate(-25 241 91)"/>');
      g.push('<ellipse cx="237" cy="88" rx="4.5" ry="2.6" fill="#7D8592" transform="rotate(-25 237 88)"/>');
      g.push(k.line([[262, 100], [300, 116], [330, 132]], 'fill="none" stroke="#8F98A4" stroke-width="2" stroke-linecap="round" opacity="0.6"'));
      g.push('<circle class="hit" cx="288" cy="124" r="40" fill="transparent"/>');
      g.push('</g>');
      // eye
      g.push(k.shape([[338, 148], [350, 140], [364, 142], [356, 152], [344, 154]], 'fill="#FFF7E2"', 0.7));
      g.push('<circle cx="353" cy="147" r="5.4" fill="' + k.f('iris') + '"/><circle cx="353" cy="147" r="2.6" fill="#1E140A"/><circle cx="354.5" cy="145.5" r="1.3" fill="#fff"/>');
      g.push('<g class="a-blink" style="transform-origin:351px 140px;transform:scaleY(0)">' + k.shape([[336, 148], [350, 138], [366, 141], [358, 154], [342, 156]], 'fill="#79838F"', 0.7) + '</g>');
      g.push(k.line([[336, 150], [350, 139], [366, 141]], 'fill="none" stroke="#1E232B" stroke-width="2.4" stroke-linecap="round"'));
      g.push(k.line([[342, 136], [356, 130], [370, 134]], 'fill="none" stroke="#E9E3D6" stroke-width="3" stroke-linecap="round" opacity="0.8"'));
      g.push('</g>');
      return g.join('');
    }
  };
})();

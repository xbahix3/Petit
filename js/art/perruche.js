/* La perruche — a budgie perched on a branch in a green garden.
   Parts: bec, ailes, plumes */
(function () {
  'use strict';
  var PR = (window.PR = window.PR || {});
  PR.art = PR.art || {};

  function leaf(k, x, y, len, ang, fill, vein) {
    var pts = [[0, 0], [len * 0.3, -len * 0.18], [len * 0.7, -len * 0.16], [len, 0], [len * 0.7, len * 0.16], [len * 0.3, len * 0.18]];
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + ang + ')">' + k.shape(pts, 'fill="' + fill + '"', 0.9) +
      k.path('M4 0 L' + (len - 6) + ' 0', 'stroke="' + (vein || '#ffffff') + '" stroke-width="2" opacity="0.35"') + '</g>';
  }

  PR.art.perruche = {
    viewBox: '0 0 800 600',

    defs: function (k) {
      return [
        k.linU('sky', 0, 0, 0, 600, [[0, '#BDE7F4'], [0.6, '#DDF3E6'], [1, '#C5E6B4']]),
        k.linU('bark', 0, 400, 0, 500, [[0, '#8A5E3C'], [1, '#5C3B22']]),
        k.linU('green', 0, 160, 0, 460, [[0, '#9AD958'], [0.5, '#6DBB3A'], [1, '#4C9A2A']]),
        k.radU('face', 300, 170, 90, [[0, '#FFF2A0'], [0.7, '#F8DD48'], [1, '#EBC52C']]),
        k.linU('tail', 440, 400, 600, 600, [[0, '#2E7AC2'], [1, '#1D4E8F']]),
        k.linU('wing', 380, 200, 600, 400, [[0, '#E9E070'], [0.45, '#A9CF55'], [1, '#5E9C34']]),
        k.linU('beak', 0, 196, 0, 250, [[0, '#F3E7C2'], [1, '#CDB57E']]),
        k.radU('bokeh', 0.5, 0.5, 0.5, [[0, '#FFFFFF', 0.7], [1, '#FFFFFF', 0]])
      ].join('');
    },

    scene: function (k) {
      var r = k.rng(31), bokeh = '';
      for (var i = 0; i < 16; i++) {
        var x = r() * 800, y = r() * 420, rad = 14 + r() * 40;
        bokeh += '<circle cx="' + k.n(x) + '" cy="' + k.n(y) + '" r="' + k.n(rad) + '" fill="' + k.f('bokeh') + '" opacity="' + k.n(0.25 + r() * 0.4) + '"/>';
      }
      var leaves = '';
      [[-20, 80, 150, 20, '#4F9A3A'], [-10, 150, 130, 40, '#3E8530'], [20, 40, 120, -10, '#6CB24A'],
        [820, 120, 160, 160, '#4F9A3A'], [820, 200, 140, 190, '#3E8530'], [800, 40, 130, 150, '#6CB24A'],
        [-20, 560, 170, -30, '#3E8530'], [820, 580, 170, 210, '#3E8530']].forEach(function (l) {
        leaves += leaf(k, l[0], l[1], l[2], l[3], l[4]);
      });
      var flowers = '';
      [[120, 300], [680, 330], [90, 230]].forEach(function (p, idx) {
        var petals = '';
        for (var j = 0; j < 5; j++) {
          petals += '<ellipse cx="0" cy="-12" rx="9" ry="14" fill="' + (idx === 1 ? '#FF9FB8' : '#FFB2C4') + '" transform="rotate(' + j * 72 + ')"/>';
        }
        flowers += '<g transform="translate(' + p[0] + ' ' + p[1] + ')" opacity="0.85">' + petals + '<circle r="6" fill="#FFD24A"/></g>';
      });
      return [
        '<rect width="800" height="600" fill="' + k.f('sky') + '"/>',
        '<g filter="' + k.f('blur6') + '">' +
          k.shape([[0, 380], [120, 330], [260, 360], [400, 320], [560, 350], [700, 310], [800, 340], [800, 600], [0, 600]], 'fill="#A9D68E" opacity="0.7"') +
          k.shape([[0, 460], [160, 420], [320, 450], [500, 410], [660, 440], [800, 420], [800, 600], [0, 600]], 'fill="#8CC673" opacity="0.7"') + '</g>',
        bokeh,
        flowers,
        leaves
      ].join('');
    },

    animal: function (k) {
      var g = [];
      // branch
      g.push(k.path('M-20 480 C120 470 260 456 400 452 C520 448 640 430 820 410 L820 446 C640 466 520 482 400 486 C260 490 120 506 -20 516 Z', 'fill="' + k.f('bark') + '"'));
      g.push(k.path('M-20 482 C120 472 260 458 400 454 C520 450 640 432 820 412', 'fill="none" stroke="#B48663" stroke-width="4" opacity="0.6"'));
      g.push('<g fill="none" stroke="#4A2E19" stroke-width="2" stroke-linecap="round" opacity="0.45">' +
        k.path('M80 492 q20 4 40 0') + k.path('M560 452 q24 2 44 -6') + k.path('M260 476 q16 4 30 -2') + '</g>');
      g.push(k.path('M640 432 C670 400 700 380 740 370 L742 376 C706 388 680 406 656 434 Z', 'fill="#6E4A2E"'));
      g.push(leaf(k, 736, 372, 70, -30, '#5EA845') + leaf(k, 700, 392, 60, 20, '#4F9A3A'));

      // ---- les plumes: body, head and tail feathers
      g.push('<g data-part="plumes">');
      // tail (long blue feathers)
      g.push('<g class="a-tail" style="transform-origin:450px 420px">');
      g.push(k.path(k.tube([[440, 408], [478, 470], [516, 540], [548, 600]], [30, 26, 20, 12], { sharp: true }), 'fill="' + k.f('tail') + '"'));
      g.push(k.path(k.tube([[458, 404], [500, 462], [546, 520], [584, 572]], [24, 20, 15, 9], { sharp: true }), 'fill="#2563A8"'));
      g.push(k.line([[446, 420], [480, 478], [514, 544]], 'fill="none" stroke="#6FB3E8" stroke-width="3" stroke-linecap="round" opacity="0.6"'));
      g.push('</g>');
      // body
      g.push('<g class="a-breathe" style="transform-origin:400px 440px">');
      g.push(k.shape([[318, 128], [368, 132], [398, 168], [432, 236], [466, 316], [474, 384], [452, 432], [404, 448], [362, 434], [336, 396], [322, 334], [306, 280], [280, 236], [272, 196], [286, 150]], 'fill="' + k.f('green') + '"'));
      // breast feather texture
      var scal = '';
      var rr = k.rng(17);
      for (var y = 300; y < 430; y += 16) {
        for (var x = 334; x < 450; x += 18) {
          var ox = x + ((y / 16) % 2 ? 9 : 0) + (rr() - 0.5) * 4;
          if (ox > 330 + (y - 280) * 0.5 && ox < 456) scal += k.path('M' + k.n(ox - 8) + ' ' + y + ' Q' + k.n(ox) + ' ' + (y + 8) + ' ' + k.n(ox + 8) + ' ' + y);
        }
      }
      g.push('<g fill="none" stroke="#3E8A22" stroke-width="2" stroke-linecap="round" opacity="0.35">' + scal + '</g>');
      g.push(k.line([[324, 300], [334, 360], [356, 410]], 'fill="none" stroke="#C3F08A" stroke-width="5" stroke-linecap="round" opacity="0.5"'));
      g.push('</g>');
      // yellow face and crown
      g.push(k.shape([[318, 126], [362, 130], [388, 160], [392, 200], [374, 236], [340, 262], [304, 264], [282, 238], [272, 198], [284, 152]], 'fill="' + k.f('face') + '"'));
      // black wavy bars on the back of the head
      var bars = '';
      for (var b = 0; b < 6; b++) {
        var by = 140 + b * 14;
        bars += k.path('M' + (346 + b * 2) + ' ' + by + ' q8 -6 16 0 q8 6 16 0', '');
      }
      g.push('<g fill="none" stroke="#2A2A1E" stroke-width="3.2" stroke-linecap="round" opacity="0.85">' + bars + '</g>');
      // violet cheek patch + throat spots
      g.push('<ellipse cx="318" cy="244" rx="11" ry="8" fill="#6C63D9"/>');
      g.push('<circle cx="296" cy="258" r="4.5" fill="#1F1E28"/><circle cx="312" cy="262" r="4.5" fill="#1F1E28"/><circle cx="328" cy="260" r="4" fill="#1F1E28"/>');
      g.push('<path class="hit" d="M318 128 L400 170 L476 384 L404 448 L330 400 L300 270 L270 200 Z" fill="transparent"/>');
      g.push('<rect class="hit" x="430" y="410" width="120" height="180" rx="30" fill="transparent" transform="rotate(-28 490 500)"/>');
      g.push('</g>');

      // feet gripping the branch
      g.push('<g fill="#C7A4A0">' +
        k.path(k.tube([[384, 438], [380, 456], [372, 468]], [9, 8, 6])) +
        k.path(k.tube([[412, 440], [412, 458], [404, 470]], [9, 8, 6])) + '</g>');

      // ---- les ailes (slightly open, with the budgie's scalloped pattern)
      g.push('<g data-part="ailes">');
      g.push('<g class="a-wing" style="transform-origin:398px 214px">');
      // far wing peeking out
      g.push(k.shape([[404, 200], [470, 168], [540, 172], [600, 200], [560, 214], [480, 222]], 'fill="#4C8A2C"'));
      // near wing
      var wing = [[392, 214], [440, 196], [500, 202], [556, 230], [604, 278], [610, 300], [570, 300], [520, 330], [480, 380], [452, 400], [430, 360], [406, 290]];
      g.push(k.shape(wing, 'fill="' + k.f('wing') + '"'));
      // covert scallops (black edges on yellow-green)
      var sc = '', rows = [[230, 412, 470], [256, 420, 500], [282, 428, 520], [308, 436, 520], [334, 446, 500]];
      rows.forEach(function (row, i) {
        for (var x = row[1] + (i % 2) * 10; x < row[2]; x += 22) {
          sc += k.path('M' + (x - 11) + ' ' + (row[0] - 6) + ' Q' + x + ' ' + (row[0] + 10) + ' ' + (x + 11) + ' ' + (row[0] - 6));
        }
      });
      g.push('<g fill="none" stroke="#25301A" stroke-width="3" stroke-linecap="round" opacity="0.8">' + sc + '</g>');
      // long flight feathers
      var prim = '';
      [[520, 236, 600, 286], [500, 262, 596, 300], [484, 292, 572, 304], [468, 320, 530, 336], [456, 350, 494, 376]].forEach(function (f) {
        prim += k.path('M' + f[0] + ' ' + f[1] + ' Q' + ((f[0] + f[2]) / 2 + 6) + ' ' + ((f[1] + f[3]) / 2 - 8) + ' ' + f[2] + ' ' + f[3]);
      });
      g.push('<g fill="none" stroke="#2E5A1C" stroke-width="2.6" stroke-linecap="round" opacity="0.7">' + prim + '</g>');
      g.push(k.line([[396, 214], [440, 198], [500, 204], [556, 232]], 'fill="none" stroke="#FFF7B8" stroke-width="4" stroke-linecap="round" opacity="0.6"'));
      g.push('</g>');
      g.push('</g>');

      // head details (on top of everything)
      g.push('<g class="a-nod" style="transform-origin:330px 250px">');
      // eye
      g.push('<circle cx="320" cy="180" r="13" fill="#FFF8D8"/>');
      g.push('<circle cx="319" cy="180" r="10" fill="#1E1A16"/><circle cx="315.5" cy="176" r="3.6" fill="#fff"/><circle cx="322" cy="184" r="1.5" fill="#fff" opacity="0.7"/>');
      g.push('<g class="a-blink" style="transform-origin:320px 167px;transform:scaleY(0)"><circle cx="320" cy="180" r="14" fill="#F3D63E"/></g>');
      // ---- le bec (with the blue cere above it)
      g.push('<g data-part="bec">');
      g.push('<ellipse cx="282" cy="200" rx="12" ry="9" fill="#4D86D6"/>');
      g.push('<circle cx="280" cy="199" r="2" fill="#2B5598"/>');
      g.push(k.shape([[272, 204], [292, 206], [298, 222], [288, 244], [272, 252], [266, 240], [264, 220]], 'fill="' + k.f('beak') + '"', 0.8));
      g.push(k.path('M266 232 Q276 236 288 230', 'fill="none" stroke="#A88F5C" stroke-width="2" stroke-linecap="round"'));
      g.push('<circle class="hit" cx="280" cy="222" r="34" fill="transparent"/>');
      g.push('</g>');
      g.push('</g>');
      return g.join('');
    }
  };
})();

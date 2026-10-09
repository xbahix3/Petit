/* La girafe — eating acacia leaves with her long tongue.
   Parts: cou, taches, langue */
(function () {
  'use strict';
  var PR = (window.PR = window.PR || {});
  PR.art = PR.art || {};

  var G = null;
  function geo(k) {
    if (G) return G;
    var neckLine = [[404, 322], [378, 264], [342, 208], [304, 162], [272, 130]];
    var neckW = [130, 98, 76, 62, 54];
    var body = [[352, 300], [402, 272], [470, 280], [556, 298], [622, 316], [648, 350], [640, 390], [596, 406], [520, 404], [450, 414], [400, 412], [362, 380], [344, 336]];
    var legNF = [[378, 380], [434, 384], [428, 440], [420, 470], [422, 486], [416, 540], [418, 548], [394, 548], [396, 540], [394, 486], [390, 470], [380, 430]];
    var legNH = [[586, 330], [646, 336], [652, 400], [632, 440], [630, 470], [634, 486], [632, 540], [634, 548], [610, 548], [612, 540], [610, 486], [604, 466], [596, 430], [580, 392]];
    // bristly mane ridge along the back of the neck
    var maneOut = [], maneIn = [], steps = 22;
    for (var i = 1; i <= steps; i++) {
      var t = (i / steps) * (neckLine.length - 1), s0 = Math.min(neckLine.length - 2, Math.floor(t)), f = t - s0;
      var a = neckLine[s0], b = neckLine[s0 + 1];
      var x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f;
      var w = (neckW[s0] + (neckW[s0 + 1] - neckW[s0]) * f) / 2;
      var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy);
      var nx = -dy / L, ny = dx / L;
      var out = w + (i % 2 ? 13 : 6);
      maneOut.push([x + nx * out, y + ny * out]);
      maneIn.push([x + nx * (w - 6), y + ny * (w - 6)]);
    }
    G = {
      neckLine: neckLine, neckW: neckW,
      neck: k.tube(neckLine, neckW),
      body: k.smooth(body),
      legNF: k.smooth(legNF), legNH: k.smooth(legNH),
      legFF: k.smooth(k.move(legNF, 40, -6)), legFH: k.smooth(k.move(legNH, -44, 0)),
      mane: k.smooth(maneOut.concat(maneIn.reverse()), true, 0.5)
    };
    return G;
  }

  function spots(k, box, step, seed, gap, keep) {
    var seeds = k.seedsGrid(box, step, 0.7, seed).filter(keep || function () { return true; });
    var cells = k.voronoi(seeds, [box[0] - step, box[1] - step, box[2] + step, box[3] + step]);
    return cells.map(function (c) {
      return c.length > 2 ? k.path(k.smooth(k.inset(c, gap), true, 0.45)) : '';
    }).join('');
  }

  PR.art.girafe = {
    viewBox: '0 0 800 600',

    defs: function (k) {
      var g = geo(k);
      return [
        k.linU('sky', 0, 0, 0, 440, [[0, '#86CFF2'], [0.65, '#C9EBF8'], [1, '#FFF1D2']]),
        k.linU('hill', 0, 400, 0, 480, [[0, '#D9C987'], [1, '#C9B672']]),
        k.linU('ground', 0, 470, 0, 600, [[0, '#DCC57C'], [1, '#C2A85E']]),
        k.linU('coat', 0, 100, 0, 560, [[0, '#FBE9BE'], [0.6, '#F3D79C'], [1, '#E8C385']]),
        k.linU('coatFar', 0, 380, 0, 560, [[0, '#DDBB7E'], [1, '#D1AD70']]),
        k.linU('spot', 0, 120, 0, 520, [[0, '#CF7E33'], [1, '#A65A1F']]),
        k.linU('tongue', 120, 100, 170, 150, [[0, '#4D3E86'], [1, '#7A62AE']]),
        k.linU('bark', 0, 0, 0, 120, [[0, '#7A5432'], [1, '#5E3F22']]),
        k.linU('leaf', 0, 30, 0, 130, [[0, '#9CC75B'], [1, '#5E9033']]),
        '<clipPath id="ID_cBody"><path d="' + g.body + '"/></clipPath>',
        '<clipPath id="ID_cLegs"><path d="' + g.legNF + '"/><path d="' + g.legNH + '"/></clipPath>',
        '<clipPath id="ID_cNeck"><path d="' + g.neck + '"/></clipPath>'
      ].join('');
    },

    scene: function (k) {
      return [
        '<rect width="800" height="600" fill="' + k.f('sky') + '"/>',
        k.cloud(560, 110, 0.85), k.cloud(720, 200, 0.5), k.cloud(420, 210, 0.4),
        k.path('M0 440 C140 410 260 418 380 428 C500 438 620 404 800 414 L800 490 L0 490 Z', 'fill="' + k.f('hill') + '"'),
        '<rect y="474" width="800" height="126" fill="' + k.f('ground') + '"/>',
        k.grass({ x0: 0, x1: 800, y: 480, h: 22, count: 110, seed: 61, colors: ['#C9B064', '#BBA157', '#D8C27A', '#AE9550'], width: 4, dy: 10 }),
        // acacia tree trunk on the left with a branch reaching the giraffe
        k.path('M-20 600 C10 470 20 330 14 200 C10 130 0 90 -20 40 L-20 600 Z', 'fill="' + k.f('bark') + '"'),
        k.path('M-10 70 C40 52 90 58 140 76 C150 80 156 84 158 90 C120 80 70 76 -6 92 Z', 'fill="' + k.f('bark') + '"'),
        k.path('M90 66 C104 50 116 40 130 34 L132 38 C120 46 108 56 98 70 Z', 'fill="#6A4A2B"'),
        // leaf clusters
        [[30, 52, 1], [70, 46, 0.9], [118, 34, 0.8], [150, 78, 0.85], [104, 84, 0.7], [-6, 120, 1.1]].map(function (c) {
          return '<g transform="translate(' + c[0] + ' ' + c[1] + ') scale(' + c[2] + ')">' +
            k.shape([[-34, 6], [-24, -16], [0, -24], [26, -16], [36, 6], [10, 16], [-14, 16]], 'fill="' + k.f('leaf') + '"') +
            k.shape([[-24, -4], [-10, -16], [10, -16], [24, -4], [4, 0]], 'fill="#B6DA74" opacity="0.7"') + '</g>';
        }).join(''),
        k.grass({ x0: 0, x1: 800, y: 585, h: 28, count: 36, seed: 62, colors: ['#AE9550', '#C9B064', '#9D8546'], width: 5, dy: 20 })
      ].join('');
    },

    animal: function (k) {
      var g = geo(k), out = [];
      out.push('<ellipse cx="510" cy="552" rx="170" ry="12" fill="#6E5A2C" opacity="0.32" filter="' + k.f('blur6') + '"/>');

      // far legs + hooves
      out.push(k.path(g.legFF, 'fill="' + k.f('coatFar') + '"'));
      out.push(k.path(g.legFH, 'fill="' + k.f('coatFar') + '"'));
      out.push('<rect x="434" y="538" width="26" height="14" rx="4" fill="#4E3826"/>');
      out.push('<rect x="566" y="540" width="26" height="14" rx="4" fill="#4E3826"/>');

      // tail
      out.push('<g class="a-tail" style="transform-origin:646px 338px">');
      out.push(k.line([[644, 336], [660, 380], [672, 432]], 'fill="none" stroke="#E8C385" stroke-width="7" stroke-linecap="round"'));
      out.push(k.shape([[664, 428], [680, 426], [686, 452], [674, 470], [664, 452]], 'fill="#3E2A1A"'));
      out.push('</g>');

      // body + near legs
      out.push('<g class="a-breathe" style="transform-origin:500px 420px">');
      out.push(k.path(g.body, 'fill="' + k.f('coat') + '"'));
      out.push('</g>');
      out.push(k.path(g.legNF, 'fill="' + k.f('coat') + '"'));
      out.push(k.path(g.legNH, 'fill="' + k.f('coat') + '"'));
      // knees
      out.push('<ellipse cx="407" cy="478" rx="15" ry="11" fill="#E3BC7C"/>');
      out.push('<ellipse cx="620" cy="476" rx="15" ry="11" fill="#E3BC7C"/>');
      // hooves
      out.push('<rect x="391" y="540" width="30" height="16" rx="5" fill="#4E3826"/>');
      out.push('<rect x="607" y="540" width="30" height="16" rx="5" fill="#4E3826"/>');

      // ---- les taches (body and legs)
      out.push('<g data-part="taches">');
      out.push('<g clip-path="url(#ID_cLegs)" fill="' + k.f('spot') + '">' + spots(k, [370, 380, 660, 460], 24, 72, 3.5, function (p) { return p[1] < 452; }) + '</g>');
      out.push('<g clip-path="url(#ID_cBody)" fill="' + k.f('spot') + '">' + spots(k, [340, 266, 656, 420], 44, 71, 5) + '</g>');
      out.push('<path class="hit" d="' + g.body + '" fill="transparent"/>');
      out.push('</g>');
      // shading over the spots: belly, haunch, chest
      out.push('<g clip-path="url(#ID_cBody)">' +
        k.shape([[380, 390], [470, 396], [600, 392], [600, 420], [380, 420]], 'fill="#7A4A1E" opacity="0.18"') +
        k.shape([[600, 318], [650, 340], [648, 390], [604, 406], [618, 360]], 'fill="#7A4A1E" opacity="0.16"') + '</g>');
      out.push(k.line([[402, 280], [470, 286], [556, 302], [618, 320]], 'fill="none" stroke="#FFF3D4" stroke-width="5" stroke-linecap="round" opacity="0.45"'));

      // ---- le cou (with its own spots, which also count as « taches »)
      out.push('<g class="a-sway" style="transform-origin:404px 330px">');
      out.push('<g data-part="cou">');
      out.push(k.path(g.mane, 'fill="#9A5A2A"'));
      out.push(k.path(g.neck, 'fill="' + k.f('coat') + '"'));
      out.push('<g data-alt="taches" clip-path="url(#ID_cNeck)" fill="' + k.f('spot') + '">' + spots(k, [240, 110, 480, 380], 32, 73, 4) + '</g>');

      out.push('</g>');

      // head
      out.push('<g class="a-nod" style="transform-origin:280px 130px">');
      // ossicones
      out.push(k.path(k.tube([[252, 86], [246, 60]], [13, 10]), 'fill="#E2B977"'));
      out.push(k.path(k.tube([[270, 90], [270, 64]], [13, 10]), 'fill="#E2B977"'));
      out.push('<circle cx="246" cy="58" r="8" fill="#4A3020"/><circle cx="270" cy="62" r="8" fill="#4A3020"/>');
      // ear
      out.push(k.shape([[280, 94], [302, 78], [328, 74], [312, 94], [288, 104]], 'fill="#EFD09A"'));
      out.push(k.shape([[288, 94], [304, 84], [318, 82], [308, 92], [292, 99]], 'fill="#E6A99A" opacity="0.8"'));
      // head shape
      out.push(k.shape([[294, 114], [280, 88], [248, 78], [212, 88], [184, 106], [162, 122], [154, 138], [164, 152], [196, 152], [230, 146], [264, 140], [290, 132]], 'fill="' + k.f('coat') + '"'));
      out.push(k.shape([[184, 112], [164, 124], [156, 138], [164, 150], [190, 150], [196, 132]], 'fill="#E2B57A" opacity="0.7"'));
      out.push('<g fill="' + k.f('spot') + '" opacity="0.9">' + k.shape([[250, 92], [262, 90], [266, 102], [254, 106]]) + k.shape([[272, 108], [282, 104], [286, 116], [274, 120]]) + '</g>');
      // nostril + mouth
      out.push('<ellipse cx="172" cy="128" rx="5" ry="3" fill="#6B4A2E" transform="rotate(-20 172 128)"/>');
      out.push(k.path('M162 148 Q178 152 196 148', 'fill="none" stroke="#7A5434" stroke-width="2.2" stroke-linecap="round"'));
      // eye
      out.push('<ellipse cx="232" cy="106" rx="11" ry="10" fill="#2E2016"/>');
      out.push('<circle cx="229" cy="102" r="3.4" fill="#fff"/><circle cx="235" cy="110" r="1.4" fill="#fff" opacity="0.7"/>');
      out.push('<g class="a-blink" style="transform-origin:232px 96px;transform:scaleY(0)"><ellipse cx="232" cy="106" rx="12.5" ry="11.5" fill="#F3D69C"/></g>');
      out.push('<g fill="none" stroke="#2E2016" stroke-width="2.2" stroke-linecap="round">' + k.path('M220 101 Q232 92 244 100') + k.path('M222 99 l-5 -6') + k.path('M227 96 l-3 -7') + k.path('M233 95 l0 -7') + '</g>');
      out.push('</g>'); // head

      // ---- la langue (wrapping a leaf)
      out.push('<g data-part="langue">');
      out.push('<g class="a-tongue" style="transform-origin:166px 146px">');
      out.push(k.path(k.tube([[170, 146], [150, 146], [134, 138], [124, 126], [121, 113], [127, 102]], [13, 12, 11, 10, 9, 8]), 'fill="' + k.f('tongue') + '"'));
      out.push(k.line([[150, 141], [136, 134], [128, 124]], 'fill="none" stroke="#A796D6" stroke-width="3" stroke-linecap="round" opacity="0.7"'));
      out.push('</g>');
      out.push('<circle class="hit" cx="140" cy="126" r="34" fill="transparent"/>');
      out.push('</g>');
      out.push('</g>'); // sway
      // leaf held by the tongue
      out.push(k.shape([[112, 98], [122, 88], [136, 92], [128, 102], [116, 106]], 'fill="#79AE40"'));
      return out.join('');
    }
  };
})();

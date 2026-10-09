/* Le lion — golden savanna at sunset.
   Parts: criniere, crocs, griffes, queue */
(function () {
  'use strict';
  var PR = (window.PR = window.PR || {});
  PR.art = PR.art || {};

  PR.art.lion = {
    viewBox: '0 0 800 600',

    defs: function (k) {
      return [
        k.linU('sky', 0, 0, 0, 460, [[0, '#F4A261'], [0.45, '#F8C982'], [1, '#FDEBC4']]),
        k.radU('sun', 250, 235, 330, [[0, '#FFF7DC'], [0.25, '#FFE9A8', 0.95], [0.6, '#FFD27A', 0.35], [1, '#FFD27A', 0]]),
        k.linU('hill1', 0, 380, 0, 460, [[0, '#EDB97A'], [1, '#E3A964']]),
        k.linU('hill2', 0, 410, 0, 470, [[0, '#DFA059'], [1, '#D6944C']]),
        k.linU('ground', 0, 440, 0, 600, [[0, '#E2B057'], [0.5, '#D9A04A'], [1, '#C7883A']]),
        k.linU('body', 0, 250, 0, 440, [[0, '#EDB35C'], [0.55, '#E4A24B'], [1, '#F3D093']]),
        k.linU('bodyFar', 0, 300, 0, 540, [[0, '#D39A4C'], [1, '#C88D40']]),
        k.linU('leg', 0, 330, 0, 540, [[0, '#E6A44D'], [0.7, '#EDBA6A'], [1, '#F2CD8C']]),
        k.radU('mane1', 240, 262, 185, [[0, '#7A3010'], [0.6, '#A2481A'], [1, '#BF6326']]),
        k.radU('mane2', 240, 262, 150, [[0, '#B5561C'], [0.65, '#CF7029'], [1, '#E08A36']]),
        k.radU('mane3', 238, 250, 125, [[0, '#D27A2E'], [0.7, '#E9A044'], [1, '#F6BE62']]),
        k.radU('face', 222, 205, 150, [[0, '#F8D287'], [0.55, '#ECB15A'], [1, '#D38A3C']]),
        k.linU('muzzle', 0, 282, 0, 322, [[0, '#FFF3D8'], [1, '#F2DCAE']]),
        k.linU('chin', 0, 340, 0, 384, [[0, '#F6E2B8'], [1, '#E8C994']]),
        k.linU('mouth', 0, 305, 0, 360, [[0, '#2E0A0D'], [1, '#6E1E24']]),
        k.linU('fang', 0, 300, 0, 345, [[0, '#FFFFFF'], [1, '#EBDDBF']]),
        k.linU('nose', 0, 256, 0, 290, [[0, '#9A5844'], [0.4, '#6E3122'], [1, '#4E2016']]),
        k.radU('iris', 0, 0, 1, [[0, '#FFE07A'], [0.6, '#F0A622'], [1, '#B86A0E']]),
        k.linU('tail', 650, 300, 760, 210, [[0, '#E3A04A'], [1, '#D89443']]),
        k.radU('tuft', 744, 198, 34, [[0, '#4A1C08'], [0.7, '#7A3412'], [1, '#9E4A1C']]),
        k.linU('claw', 0, 520, 0, 548, [[0, '#FFFDF6'], [1, '#E3D5B6']]),
        '<clipPath id="ID_rimClip"><rect x="0" y="0" width="800" height="215"/></clipPath>'
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

    animal: function (k) {
      var g = [];
      // ground shadow
      g.push('<ellipse cx="480" cy="542" rx="240" ry="16" fill="#7A4A1A" opacity="0.35" filter="' + k.f('blur6') + '"/>');

      // ---- la queue (behind the body)
      g.push('<g data-part="queue" class="a-tail" style="transform-origin:658px 310px">');
      g.push(k.line([[650, 312], [690, 338], [724, 336], [746, 306], [752, 270], [748, 240]], 'fill="none" stroke="' + k.f('tail') + '" stroke-width="15" stroke-linecap="round"'));
      g.push(k.line([[656, 320], [692, 344], [726, 342]], 'fill="none" stroke="#C98636" stroke-width="5" stroke-linecap="round" opacity="0.45"'));
      g.push(k.shape([[740, 252], [731, 230], [733, 206], [741, 186], [747, 200], [756, 182], [762, 204], [761, 230], [753, 252]], 'fill="' + k.f('tuft') + '"', 0.9));
      g.push(k.line([[744, 236], [742, 212], [746, 196]], 'fill="none" stroke="#B5592A" stroke-width="2" stroke-linecap="round" opacity="0.6"'));
      g.push('<circle class="hit" cx="738" cy="252" r="46" fill="transparent"/>');
      g.push('<circle class="hit" cx="702" cy="334" r="30" fill="transparent"/>');
      g.push('</g>');

      // ---- far legs (shaded, behind the body)
      g.push(k.shape([[540, 370], [586, 366], [596, 420], [588, 470], [590, 512], [600, 536], [552, 538], [548, 512], [556, 470], [548, 420]], 'fill="' + k.f('bodyFar') + '"'));
      g.push(k.shape([[372, 360], [420, 362], [424, 420], [416, 470], [418, 512], [428, 536], [382, 538], [380, 512], [386, 470], [376, 420]], 'fill="' + k.f('bodyFar') + '"'));

      // ---- body
      g.push('<g class="a-breathe" style="transform-origin:500px 420px">');
      g.push(k.shape([[330, 272], [400, 256], [480, 264], [560, 256], [628, 266], [666, 300], [670, 346], [650, 388], [600, 410], [520, 416], [440, 412], [384, 402], [338, 372], [318, 322]], 'fill="' + k.f('body') + '"'));
      g.push(k.shape([[604, 298], [650, 292], [670, 340], [660, 384], [620, 406], [566, 414], [606, 372]], 'fill="#C47F2E" opacity="0.26"'));
      g.push(k.shape([[404, 388], [480, 400], [560, 398], [520, 416], [440, 412]], 'fill="#C47F2E" opacity="0.18"'));
      // sunset rim light along the back
      g.push(k.line([[372, 262], [470, 266], [560, 258], [626, 270], [656, 292]], 'fill="none" stroke="#FFE7B0" stroke-width="6" stroke-linecap="round" opacity="0.55"'));
      g.push('</g>');

      // ---- near hind leg
      g.push(k.shape([[566, 300], [622, 292], [666, 322], [672, 380], [660, 430], [652, 470], [650, 506], [662, 530], [604, 534], [600, 516], [614, 500], [612, 470], [598, 428], [560, 376]], 'fill="' + k.f('leg') + '"'));
      g.push(k.line([[590, 326], [634, 316], [660, 346]], 'fill="none" stroke="#C47F2E" stroke-width="4" stroke-linecap="round" opacity="0.35"'));
      g.push(k.line([[598, 430], [616, 470], [614, 500]], 'fill="none" stroke="#FFE2A6" stroke-width="3" stroke-linecap="round" opacity="0.4"'));
      // ---- near front leg
      g.push(k.shape([[332, 340], [392, 352], [398, 420], [388, 470], [386, 506], [384, 530], [314, 533], [308, 516], [328, 500], [338, 468], [330, 420]], 'fill="' + k.f('leg') + '"'));
      g.push(k.line([[392, 400], [386, 440], [376, 476]], 'fill="none" stroke="#C47F2E" stroke-width="3.5" stroke-linecap="round" opacity="0.35"'));

      // paws: rounded top, four toes facing the viewer
      function paw(cx, cy, w) {
        var h = w * 0.36, x0 = cx - w / 2, tw = w / 4;
        var d = 'M' + x0 + ' ' + (cy + h * 0.5) +
          ' C' + (x0 - 2) + ' ' + (cy - h * 0.4) + ' ' + (cx - w * 0.3) + ' ' + (cy - h * 0.9) + ' ' + cx + ' ' + (cy - h * 0.9) +
          ' C' + (cx + w * 0.3) + ' ' + (cy - h * 0.9) + ' ' + (x0 + w + 2) + ' ' + (cy - h * 0.4) + ' ' + (x0 + w) + ' ' + (cy + h * 0.5);
        for (var i = 3; i >= 0; i--) {
          d += ' Q' + (x0 + tw * i + tw / 2) + ' ' + (cy + h * 1.15) + ' ' + (x0 + tw * i) + ' ' + (cy + h * 0.5);
        }
        var out = k.path(d + 'Z', 'fill="#F3D095"');
        for (var j = 1; j < 4; j++) {
          out += k.path('M' + (x0 + tw * j) + ' ' + (cy + h * 0.5) + ' L' + (x0 + tw * j) + ' ' + (cy + h * 0.05), 'stroke="#C08240" stroke-width="2.2" stroke-linecap="round" opacity="0.7"');
        }
        return out;
      }
      g.push(paw(349, 524, 72));
      g.push(paw(632, 524, 64));

      // ---- les griffes (claws curving out of each toe)
      g.push('<g data-part="griffes">');
      function claws(cx, cy, w) {
        var out = '', h = w * 0.36, x0 = cx - w / 2, tw = w / 4;
        for (var i = 0; i < 4; i++) {
          var x = x0 + tw * i + tw / 2, y = cy + h * 0.78;
          var lean = (i - 1.5) * 2.2;
          out += k.path('M' + (x - 4.5) + ' ' + (y - 3) +
            ' C' + (x - 5) + ' ' + (y + 6) + ' ' + (x - 3 + lean) + ' ' + (y + 12) + ' ' + (x - 7 + lean * 1.6) + ' ' + (y + 17) +
            ' C' + (x + 2 + lean) + ' ' + (y + 14) + ' ' + (x + 5) + ' ' + (y + 6) + ' ' + (x + 4.5) + ' ' + (y - 3) + ' Z',
            'fill="' + k.f('claw') + '" stroke="#A8916A" stroke-width="1.1"');
        }
        return out;
      }
      g.push(claws(349, 524, 72));
      g.push(claws(632, 524, 64));
      g.push('<rect class="hit" x="298" y="500" width="104" height="60" rx="22" fill="transparent"/>');
      g.push('<rect class="hit" x="586" y="500" width="94" height="60" rx="22" fill="transparent"/>');
      g.push('</g>');

      // ---- head (gentle nod)
      g.push('<g class="a-nod" style="transform-origin:300px 330px">');

      // ---- la crinière
      var maneA = k.tufts({ cx: 242, cy: 266, r1: 150, r2: 182, n: 26, seed: 11, curl: 0.45, jitter: 0.12, round: 0.9 });
      g.push('<g data-part="criniere">');
      g.push(k.path(maneA, 'fill="' + k.f('mane1') + '"'));
      g.push('<path d="' + maneA + '" fill="none" stroke="#FFE1A6" stroke-width="5" opacity="0.65" clip-path="url(#ID_rimClip)"/>');
      // locks: flame-shaped strands in rings, alternating direction
      var locks = function (r0, r1, n, seed, curlDir, fill, w) {
        var rr = k.rng(seed), out = '';
        for (var i = 0; i < n; i++) {
          var a = (i / n) * Math.PI * 2 + rr() * 0.12;
          var lr = r1 * (0.9 + rr() * 0.16);
          var bx = 240 + Math.cos(a) * r0, by = 262 + Math.sin(a) * r0;
          var tx = 240 + Math.cos(a + curlDir * 0.2) * lr, ty = 262 + Math.sin(a + curlDir * 0.2) * lr;
          var nx = -Math.sin(a), ny = Math.cos(a);
          var mx = (bx + tx) / 2 + nx * curlDir * 10, my = (by + ty) / 2 + ny * curlDir * 10;
          out += k.path('M' + k.n(bx - nx * w) + ' ' + k.n(by - ny * w) +
            ' Q' + k.n(mx - nx * w * 0.9) + ' ' + k.n(my - ny * w * 0.9) + ' ' + k.n(tx) + ' ' + k.n(ty) +
            ' Q' + k.n(mx + nx * w * 0.9) + ' ' + k.n(my + ny * w * 0.9) + ' ' + k.n(bx + nx * w) + ' ' + k.n(by + ny * w) + ' Z', 'fill="' + fill + '"');
        }
        return out;
      };
      g.push(locks(110, 176, 24, 41, 1, '#A8501E', 13));
      g.push(locks(96, 158, 22, 42, -1, '#C8692A', 13));
      g.push(k.path(k.tufts({ cx: 240, cy: 260, r1: 112, r2: 142, n: 20, seed: 5, curl: -0.4, jitter: 0.14, round: 0.9 }), 'fill="' + k.f('mane2') + '"'));
      g.push(locks(90, 140, 20, 43, 1, '#E79A42', 11));
      g.push(k.path(k.tufts({ cx: 238, cy: 256, r1: 96, r2: 120, n: 16, seed: 9, curl: 0.4, jitter: 0.16, round: 0.9 }), 'fill="' + k.f('mane3') + '"'));
      g.push(k.fur({ cx: 238, cy: 258, rx: 112, ry: 112, count: 46, len: 16, radial: true, twist: -0.3, seed: 17, color: '#FFDDA0', width: 2, opacity: 0.45 }));
      g.push('<circle class="hit" cx="240" cy="258" r="166" fill="transparent"/>');
      g.push('</g>');

      // ears
      [[176, 178, -1], [300, 178, 1]].forEach(function (e) {
        g.push('<ellipse cx="' + e[0] + '" cy="' + e[1] + '" rx="26" ry="24" fill="#DC9A48"/>');
        g.push('<ellipse cx="' + (e[0] - e[2] * 1) + '" cy="' + (e[1] + 3) + '" rx="15" ry="14" fill="#8C4A22"/>');
        g.push('<ellipse cx="' + (e[0] - e[2] * 1) + '" cy="' + (e[1] + 7) + '" rx="9" ry="7" fill="#F2C987" opacity="0.7"/>');
      });

      // face
      g.push(k.shape([[238, 150], [280, 156], [308, 182], [320, 222], [324, 264], [314, 304], [292, 334], [268, 352], [238, 360], [208, 352], [184, 334], [162, 304], [152, 264], [156, 222], [168, 182], [196, 156]], 'fill="' + k.f('face') + '"'));
      // cheek fluff
      g.push(k.path(k.tufts({ cx: 238, cy: 280, r1: 70, r2: 92, n: 7, seed: 31, start: 2.15, end: 3.35, curl: 0.4, sx: 1.05, jitter: 0.2 }), 'fill="#F3C779" opacity="0.9"'));
      g.push(k.path(k.tufts({ cx: 238, cy: 280, r1: 70, r2: 92, n: 7, seed: 32, start: -0.2, end: 1.0, curl: -0.4, sx: 1.05, jitter: 0.2 }), 'fill="#F3C779" opacity="0.9"'));
      // nose bridge light
      g.push(k.shape([[226, 176], [250, 176], [254, 230], [248, 262], [228, 262], [222, 230]], 'fill="#FBDDA0" opacity="0.6"'));
      // eye shadows
      g.push('<ellipse cx="205" cy="234" rx="24" ry="15" fill="#C98439" opacity="0.3"/>');
      g.push('<ellipse cx="271" cy="234" rx="24" ry="15" fill="#C98439" opacity="0.3"/>');

      // chin + mouth
      g.push(k.shape([[198, 336], [238, 340], [278, 336], [272, 366], [238, 386], [204, 366]], 'fill="' + k.f('chin') + '"'));
      g.push(k.shape([[194, 306], [216, 318], [238, 313], [260, 318], [282, 306], [276, 332], [258, 352], [238, 358], [218, 352], [200, 332]], 'fill="' + k.f('mouth') + '"', 0.8));
      g.push('<ellipse cx="238" cy="346" rx="20" ry="9" fill="#E26F7B"/>');
      g.push('<ellipse cx="232" cy="343" rx="7" ry="3" fill="#F49AA3" opacity="0.8"/>');

      // ---- les crocs
      g.push('<g data-part="crocs">');
      function fang(x, y, dir, len) {
        // dir 1 = points down, -1 = points up
        return k.path('M' + (x - 8) + ' ' + y + ' Q' + (x - 6) + ' ' + (y + dir * len * 0.7) + ' ' + (x + 1) + ' ' + (y + dir * len) +
          ' Q' + (x + 5) + ' ' + (y + dir * len * 0.55) + ' ' + (x + 8) + ' ' + y + ' Z', 'fill="' + k.f('fang') + '" stroke="#C8B48C" stroke-width="1"');
      }
      g.push(fang(214, 310, 1, 32));
      g.push(fang(262, 310, 1, 32));
      g.push(fang(220, 354, -1, 20));
      g.push(fang(256, 354, -1, 20));
      g.push('<ellipse class="hit" cx="238" cy="334" rx="52" ry="36" fill="transparent"/>');
      g.push('</g>');

      // muzzle (upper lip lobes)
      g.push('<ellipse cx="216" cy="300" rx="27" ry="20" fill="' + k.f('muzzle') + '"/>');
      g.push('<ellipse cx="260" cy="300" rx="27" ry="20" fill="' + k.f('muzzle') + '"/>');
      [[204, 296], [212, 304], [200, 306], [272, 296], [264, 304], [276, 306]].forEach(function (d) {
        g.push('<circle cx="' + d[0] + '" cy="' + d[1] + '" r="1.8" fill="#A0683A"/>');
      });
      g.push('<g stroke="#FFF8E8" stroke-width="1.4" stroke-linecap="round" opacity="0.8" fill="none">' +
        k.path('M196 300 Q170 292 146 296') + k.path('M196 306 Q172 306 150 314') +
        k.path('M280 300 Q306 292 330 296') + k.path('M280 306 Q304 306 326 314') + '</g>');

      // nose
      g.push(k.shape([[216, 264], [238, 258], [260, 264], [256, 276], [244, 288], [238, 291], [232, 288], [220, 276]], 'fill="' + k.f('nose') + '"', 0.7));
      g.push('<ellipse cx="232" cy="265" rx="9" ry="3.5" fill="#C58A72" opacity="0.7"/>');
      g.push(k.path('M238 290 L238 300', 'stroke="#4E2016" stroke-width="2.5" stroke-linecap="round"'));

      // eyes
      function eye(cx, flip) {
        var s = flip ? -1 : 1;
        var pts = [[cx - 17 * s, 236], [cx - 9 * s, 225], [cx + 5 * s, 223], [cx + 16 * s, 230], [cx + 8 * s, 241], [cx - 6 * s, 243]];
        var out = k.shape(pts, 'fill="#FFF6E2"', 0.8);
        out += '<circle cx="' + (cx + 1 * s) + '" cy="233" r="9" fill="' + k.f('iris') + '"/>';
        out += '<circle cx="' + (cx + 1 * s) + '" cy="233" r="4.6" fill="#24140A"/>';
        out += '<circle cx="' + (cx + 3 * s) + '" cy="229.5" r="2.6" fill="#fff"/>';
        out += k.shape(pts, 'fill="none" stroke="#3A1E0C" stroke-width="2.6"', 0.8);
        // blinking lid
        out += '<g class="a-blink" style="transform-origin:' + cx + 'px 222px;transform:scaleY(0)">' +
          k.shape([[cx - 19 * s, 236], [cx - 10 * s, 222], [cx + 6 * s, 220], [cx + 18 * s, 229], [cx + 10 * s, 244], [cx - 8 * s, 246]], 'fill="#E9AE58"', 0.8) + '</g>';
        // brow
        out += k.line([[cx - 18 * s, 218], [cx - 4 * s, 211], [cx + 14 * s, 214]], 'fill="none" stroke="#9A5524" stroke-width="4" stroke-linecap="round" opacity="0.8"');
        return out;
      }
      g.push(eye(206, false));
      g.push(eye(270, true));
      g.push('</g>'); // end head

      return g.join('');
    }
  };
})();

/* Le lion — an adult male, side view, yawning on the golden savanna at sunset.
   Parts: criniere, crocs, griffes, queue */
(function () {
  'use strict';
  var PR = (window.PR = window.PR || {});
  PR.art = PR.art || {};

  // ---- shapes (facing left, ground at y = 545) ----
  var TORSO = [[300, 296], [350, 288], [420, 293], [500, 298], [570, 293], [620, 302], [648, 330], [655, 370], [640, 410], [600, 424], [540, 432], [470, 446], [400, 450], [340, 440], [300, 420], [280, 380], [282, 330]];
  var HIND_NEAR = [[566, 316], [628, 318], [656, 352], [660, 404], [650, 446], [640, 474], [644, 504], [648, 530], [656, 545], [596, 547], [594, 533], [608, 520], [613, 494], [606, 470], [584, 450], [562, 424], [552, 384], [554, 344]];
  var HIND_FAR = [[514, 330], [566, 336], [580, 392], [574, 432], [560, 462], [564, 494], [568, 528], [576, 545], [522, 546], [522, 532], [536, 518], [538, 492], [528, 462], [510, 424], [504, 380]];
  var FRONT_FAR = [[318, 396], [362, 400], [364, 452], [356, 494], [360, 530], [366, 545], [312, 546], [310, 532], [322, 518], [326, 480], [322, 440]];
  var MANE = [[170, 190], [188, 160], [226, 140], [276, 142], [322, 166], [356, 210], [382, 260], [394, 312], [390, 364], [372, 408], [340, 438], [298, 446], [266, 428], [246, 392], [232, 352], [220, 316], [214, 286], [206, 252], [190, 214]];
  var HEAD = [[184, 190], [152, 182], [120, 188], [98, 197], [82, 205], [76, 220], [82, 236], [100, 246], [130, 255], [160, 265], [196, 283], [216, 270], [224, 244], [216, 212], [200, 196]];
  var JAW = [[198, 284], [178, 302], [152, 318], [126, 333], [106, 341], [96, 331], [104, 318], [130, 306], [156, 294], [184, 282]];
  var MOUTH = [[88, 238], [116, 250], [152, 262], [192, 281], [180, 287], [154, 298], [128, 310], [104, 319], [92, 290]];

  PR.art.lion = {
    viewBox: '0 0 800 600',

    defs: function (k) {
      return [
        k.linU('sky', 0, 0, 0, 460, [[0, '#F4A261'], [0.45, '#F8C982'], [1, '#FDEBC4']]),
        k.radU('sun', 250, 235, 330, [[0, '#FFF7DC'], [0.25, '#FFE9A8', 0.95], [0.6, '#FFD27A', 0.35], [1, '#FFD27A', 0]]),
        k.linU('hill1', 0, 380, 0, 460, [[0, '#EDB97A'], [1, '#E3A964']]),
        k.linU('hill2', 0, 410, 0, 470, [[0, '#DFA059'], [1, '#D6944C']]),
        k.linU('ground', 0, 440, 0, 600, [[0, '#E2B057'], [0.5, '#D9A04A'], [1, '#C7883A']]),
        // coat
        k.linU('coat', 0, 285, 0, 455, [[0, '#D69C55'], [0.45, '#CB914D'], [0.8, '#D9AC70'], [1, '#E7C793']]),
        k.linU('coatFar', 0, 330, 0, 548, [[0, '#B5814A'], [1, '#A47142']]),
        k.linU('leg', 0, 320, 0, 548, [[0, '#CD934F'], [0.6, '#D5A464'], [1, '#E0BC86']]),
        k.linU('legShade', 620, 0, 660, 0, [[0, '#000', 0], [1, '#5A3416', 0.35]]),
        k.radU('mane', 220, 240, 200, [[0, '#B47634'], [0.45, '#87501F'], [1, '#55301A']]),
        k.linU('face', 0, 180, 0, 285, [[0, '#D9A35C'], [0.6, '#CC944E'], [1, '#BD8545']]),
        k.linU('jaw', 0, 280, 0, 342, [[0, '#C38A4A'], [0.55, '#D9B07A'], [1, '#EBD4A6']]),
        k.linU('mouth', 0, 236, 0, 316, [[0, '#4A1418'], [1, '#7A2A30']]),
        k.linU('tooth', 0, 0, 0, 1, [[0, '#FFFDF5'], [1, '#E7D9BB']]),
        k.linU('claw', 0, 0, 0, 1, [[0, '#F7F0DE'], [1, '#C9B48E']]),
        k.linU('tail', 0, 330, 0, 520, [[0, '#C99254'], [1, '#B17C42']]),
        k.rad('dark', 0.5, 0.5, 0.5, [[0, '#5A3214', 0.5], [0.6, '#5A3214', 0.22], [1, '#5A3214', 0]]),
        k.rad('light', 0.5, 0.5, 0.5, [[0, '#FFE6B4', 0.6], [0.6, '#FFE6B4', 0.25], [1, '#FFE6B4', 0]]),
        k.clip('cTorso', k.smooth(TORSO)),
        k.clip('cHind', k.smooth(HIND_NEAR)),
        k.clip('cMane', k.smooth(MANE)),
        k.clip('cHead', k.smooth(HEAD)),
        '<clipPath id="ID_rimClip"><rect x="0" y="0" width="800" height="236"/></clipPath>'
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
      var down = function () { return Math.PI / 2; };
      g.push('<ellipse cx="470" cy="547" rx="230" ry="13" fill="#6E4318" opacity="0.38" filter="' + k.f('blur6') + '"/>');

      // ---- la queue (behind the body)
      g.push('<g data-part="queue" class="a-tail" style="transform-origin:640px 332px">');
      g.push(k.path(k.tube([[636, 330], [666, 368], [682, 418], [690, 466], [700, 500]], [17, 14, 12, 10, 9]), 'fill="' + k.f('tail') + '"'));
      g.push(k.line([[640, 336], [668, 372], [684, 420], [692, 466]], 'fill="none" stroke="#E6C38E" stroke-width="3" stroke-linecap="round" opacity="0.5"'));
      // the black tuft at the end
      g.push(k.shape([[694, 494], [710, 494], [722, 514], [720, 538], [708, 552], [696, 542], [690, 518]], 'fill="#3B2414"'));
      g.push(k.strands({ poly: [[692, 498], [714, 498], [720, 540], [700, 548]], count: 22, len: 18, width: 2.2, curl: 3, seed: 61, angle: function () { return Math.PI / 2 + 0.15; }, colors: ['#2A170B', '#5A3820'], opacity: 0.9 }));
      g.push('<circle class="hit" cx="700" cy="500" r="42" fill="transparent"/>');
      g.push('<circle class="hit" cx="672" cy="400" r="30" fill="transparent"/>');
      g.push('</g>');

      // ---- far legs (in shadow)
      g.push(k.shape(HIND_FAR, 'fill="' + k.f('coatFar') + '"'));
      g.push(k.shape(FRONT_FAR, 'fill="' + k.f('coatFar') + '"'));
      g.push('<ellipse cx="549" cy="540" rx="27" ry="8" fill="#8A5C30"/><ellipse cx="338" cy="540" rx="28" ry="8" fill="#8A5C30"/>');
      g.push('<ellipse cx="556" cy="420" rx="22" ry="70" fill="' + k.f('dark') + '" opacity="0.6"/><ellipse cx="350" cy="470" rx="14" ry="60" fill="' + k.f('dark') + '" opacity="0.5"/>');

      // ---- body
      g.push(k.shape(TORSO, 'fill="' + k.f('coat') + '"'));
      g.push('<g clip-path="url(#ID_cTorso)">');
      var soft = function (cx, cy, rx, ry, kind, op) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + k.f(kind) + '"' + (op ? ' opacity="' + op + '"' : '') + '/>'; };
      g.push(soft(450, 462, 190, 46, 'dark'));
      g.push(soft(388, 370, 70, 100, 'dark', 0.8));
      g.push(soft(548, 386, 42, 80, 'dark', 0.8));
      g.push(soft(470, 312, 160, 26, 'light'));
      g.push(soft(446, 362, 76, 44, 'light', 0.6));
      g.push(soft(500, 405, 60, 22, 'dark', 0.5));
      g.push(k.hairs({ poly: TORSO, count: 90, len: 10, color: '#8C5A2A', width: 1.1, opacity: 0.18, seed: 5, angle: function (x, y) { return Math.PI * 0.62 + (y - 360) * 0.002; } }));
      g.push(k.hairs({ poly: TORSO, count: 60, len: 10, color: '#F3D7A3', width: 1.1, opacity: 0.25, seed: 6, angle: function () { return Math.PI * 0.6; } }));
      g.push('</g>');
      g.push(k.line([[352, 290], [430, 294], [500, 299], [572, 294], [622, 303], [648, 328]], 'fill="none" stroke="#FFE1A6" stroke-width="4" stroke-linecap="round" opacity="0.55"'));

      // ---- near hind leg
      g.push(k.shape(HIND_NEAR, 'fill="' + k.f('leg') + '"'));
      g.push('<g clip-path="url(#ID_cHind)">');
      g.push(soft(652, 420, 30, 110, 'dark'));
      g.push(soft(596, 360, 44, 52, 'light', 0.8));
      g.push(soft(574, 446, 24, 34, 'dark', 0.6));
      g.push(soft(640, 500, 16, 50, 'dark', 0.7));
      g.push(k.hairs({ poly: HIND_NEAR, count: 40, len: 9, color: '#8C5A2A', width: 1.1, opacity: 0.18, seed: 8, angle: function (x, y) { return y < 450 ? Math.PI * 0.55 : Math.PI / 2; } }));
      g.push('</g>');
      g.push(k.shape([[594, 528], [652, 528], [660, 547], [590, 548]], 'fill="#D2A066"'));
      g.push(k.shape([[600, 530], [646, 530], [652, 538], [598, 538]], 'fill="#E2BC86" opacity="0.7"'));
      g.push('<g stroke="#A0703C" stroke-width="2" stroke-linecap="round" opacity="0.7">' + k.path('M612 536 l0 10') + k.path('M626 536 l0 10') + k.path('M640 536 l0 10') + '</g>');

      // ---- near front leg, lifted (paw forward, claws out)
      var arm = [[334, 372], [350, 438], [304, 474], [268, 494]];
      g.push(k.path(k.tube(arm, [92, 74, 58, 52]), 'fill="' + k.f('leg') + '"'));
      g.push(k.line([[350, 400], [350, 440], [318, 470]], 'fill="none" stroke="#8A5626" stroke-width="5" stroke-linecap="round" opacity="0.35"'));
      g.push(k.line([[318, 446], [290, 468], [266, 480]], 'fill="none" stroke="#F2D29E" stroke-width="4" stroke-linecap="round" opacity="0.45"'));
      // paw, seen from the front-side, toes spread
      var PAW = [[282, 474], [274, 506], [256, 528], [230, 534], [208, 524], [202, 502], [212, 482], [238, 470], [262, 466]];
      g.push(k.shape(PAW, 'fill="#D6A86C"'));
      g.push(k.shape([[270, 480], [262, 500], [246, 514], [228, 520], [218, 508], [226, 488], [246, 478]], 'fill="#E6C48E" opacity="0.7"'));
      g.push(k.shape([[262, 486], [256, 506], [240, 518], [226, 516], [236, 500], [248, 488]], 'fill="#C99A62" opacity="0.6"'));
      g.push('<g fill="none" stroke="#9A6A36" stroke-width="2" stroke-linecap="round" opacity="0.7">' + k.path('M246 528 q-4 -12 2 -24') + k.path('M226 532 q-6 -12 -2 -26') + k.path('M210 518 q-2 -12 6 -22') + '</g>');

      // ---- les griffes
      g.push('<g data-part="griffes">');
      var claw = function (x, y, ang, len) {
        // a curved hook: sharp tip curving down
        var a = ang * Math.PI / 180, dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx;
        var tip = [x + dx * len + nx * len * 0.45, y + dy * len + ny * len * 0.45];
        return k.path('M' + k.n(x + nx * 4.5) + ' ' + k.n(y + ny * 4.5) +
          ' Q' + k.n(x + dx * len * 0.7 + nx * 5) + ' ' + k.n(y + dy * len * 0.7 + ny * 5) + ' ' + k.n(tip[0]) + ' ' + k.n(tip[1]) +
          ' Q' + k.n(x + dx * len * 0.55 - nx * 1) + ' ' + k.n(y + dy * len * 0.55 - ny * 1) + ' ' + k.n(x - nx * 4.5) + ' ' + k.n(y - ny * 4.5) + ' Z',
          'fill="' + k.f('claw') + '" stroke="#8C7350" stroke-width="1"');
      };
      g.push(claw(254, 528, 118, 20));
      g.push(claw(234, 534, 132, 21));
      g.push(claw(214, 524, 148, 20));
      g.push(claw(203, 505, 166, 18));
      g.push('<ellipse class="hit" cx="236" cy="512" rx="48" ry="36" fill="transparent"/>');
      g.push('</g>');

      // ---- la crinière (head, neck, shoulders, chest)
      g.push('<g data-part="criniere">');
      // hair grows back from the face and falls down with gravity
      var maneDir = function (x, y) {
        var t = Math.max(0, Math.min(1, (y - 150) / 270));
        var back = 0.18 + 1.42 * t;                    // top: flows backward, chest: falls down
        if (x < 215 && y < 230) back = 0.35;           // forehead fringe
        return back;
      };
      var MANE_OUT = [[164, 192], [180, 154], [222, 130], [282, 132], [334, 160], [370, 208], [398, 262], [410, 318], [404, 374], [384, 422], [346, 456], [296, 462], [262, 440], [300, 420], [352, 380], [362, 300], [330, 220], [270, 168], [210, 170]];
      var maneColor = function (d, rnd) {
        var dark = ['#4A2914', '#55301A', '#5F361C'], mid = ['#7C4A22', '#8C5627', '#9C632D'], gold = ['#B97B38', '#C98C43', '#D9A257'];
        var set = d < 85 ? gold : d < 150 ? mid : dark;
        if (rnd > 0.86) set = d < 150 ? gold : mid;             // a few lighter locks catch the sun
        return set[Math.floor(rnd * 997) % 3];
      };
      g.push(k.shape(MANE, 'fill="' + k.f('mane') + '"'));
      g.push(k.mane({ poly: MANE, origin: [178, 236], step: 15, len: 58, width: 9, curl: 9, seed: 71, angle: maneDir, color: maneColor }));
      // crown: shorter locks combed back over the top of the head
      g.push(k.mane({ poly: [[176, 188], [196, 154], [236, 136], [282, 140], [300, 168], [250, 172], [212, 186]], origin: [150, 200], step: 11, len: 44, width: 8, curl: 6, seed: 77,
        angle: function (x) { return 0.05 + (x - 180) * 0.002; }, color: function (d, rnd) { return ['#8C5627', '#9C632D', '#B97B38', '#7C4A22'][Math.floor(rnd * 4)]; } }));
      g.push('<g clip-path="url(#ID_cMane)">');
      g.push(k.hairs({ poly: MANE, count: 220, len: 30, color: '#F0C27A', width: 1.1, opacity: 0.3, seed: 75, angle: maneDir }));
      g.push(k.hairs({ poly: MANE, count: 160, len: 30, color: '#2E1709', width: 1.1, opacity: 0.25, seed: 76, angle: maneDir }));
      g.push('</g>');
      g.push('<path class="hit" d="' + k.smooth(MANE_OUT) + '" fill="transparent"/>');
      g.push('</g>');

      // ---- head (yawning)
      g.push('<g class="a-nod" style="transform-origin:230px 300px">');
      // ear (black-backed, rounded)
      g.push(k.shape([[190, 192], [194, 168], [210, 158], [224, 168], [222, 190]], 'fill="#B07A3C"'));
      g.push(k.shape([[196, 188], [200, 172], [212, 166], [218, 178], [214, 190]], 'fill="#5A3416"'));
      // lower jaw, then the open mouth, then the upper head on top
      g.push(k.shape(JAW, 'fill="' + k.f('jaw') + '"'));
      g.push(k.shape(MOUTH, 'fill="' + k.f('mouth') + '"', 0.8));
      g.push(k.shape([[106, 316], [130, 305], [158, 294], [182, 286], [174, 296], [148, 308], [122, 318]], 'fill="#D46A72"'));
      g.push(k.line([[114, 313], [144, 302], [170, 292]], 'fill="none" stroke="#F29AA2" stroke-width="2.5" stroke-linecap="round" opacity="0.8"'));
      g.push(k.line([[96, 300], [92, 272], [94, 248]], 'fill="none" stroke="#2A0C0F" stroke-width="5" stroke-linecap="round" opacity="0.5"'));

      // ---- les crocs (upper and lower canines + small incisors)
      g.push('<g data-part="crocs">');
      var fang = function (x, y, dir, len, lean) {
        return k.path('M' + (x - 6) + ' ' + y + ' Q' + (x - 5 + lean * 0.3) + ' ' + (y + dir * len * 0.65) + ' ' + (x + lean) + ' ' + (y + dir * len) +
          ' Q' + (x + 5 + lean * 0.4) + ' ' + (y + dir * len * 0.5) + ' ' + (x + 6) + ' ' + y + ' Z', 'fill="' + k.f('tooth') + '" stroke="#B9A57E" stroke-width="1"');
      };
      g.push(fang(104, 242, 1, 31, 3));
      g.push(fang(120, 316, -1, 25, -2));
      g.push('<g fill="#F6EEDC" stroke="#C9B48E" stroke-width="0.8">' + k.path('M90 238 l4 9 l4 -7 Z') + k.path('M97 318 l3 -7 l4 6 Z') + k.path('M140 257 l4 8 l4 -5 Z') + k.path('M148 302 l4 -7 l5 5 Z') + k.path('M160 266 l4 7 l4 -5 Z') + '</g>');
      g.push('<ellipse class="hit" cx="122" cy="282" rx="46" ry="48" fill="transparent"/>');
      g.push('</g>');

      g.push(k.shape(HEAD, 'fill="' + k.f('face') + '"'));
      g.push('<g clip-path="url(#ID_cHead)">');
      // cheek and brow shading, muzzle light
      g.push(k.shape([[160, 230], [206, 232], [222, 262], [196, 284], [150, 262]], 'fill="#8A5626" opacity="0.25"'));
      g.push(k.shape([[80, 222], [108, 216], [140, 228], [152, 250], [116, 250], [86, 238]], 'fill="#F0D7A8" opacity="0.85"'));
      g.push(k.shape([[104, 194], [150, 184], [182, 190], [150, 198], [116, 204]], 'fill="#F2CF92" opacity="0.5"'));
      g.push(k.shape([[118, 214], [150, 210], [176, 220], [150, 226]], 'fill="#9A6430" opacity="0.22"'));
      g.push(k.hairs({ poly: HEAD, count: 60, len: 9, color: '#8C5A2A', width: 1.1, opacity: 0.35, seed: 9, angle: function () { return -0.1; } }));
      g.push('</g>');
      // black lip line and whisker dots
      g.push(k.line([[86, 238], [114, 250], [150, 262], [190, 280]], 'fill="none" stroke="#2E1A12" stroke-width="2.6" stroke-linecap="round"'));
      g.push('<g fill="#5A3A22">' + [[96, 228], [106, 231], [116, 235], [100, 236], [110, 240], [122, 241]].map(function (d) { return '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="1.6"/>'; }).join('') + '</g>');
      g.push('<g fill="none" stroke="#FFF8E8" stroke-width="1.2" stroke-linecap="round" opacity="0.75">' + k.path('M102 230 Q72 220 46 222') + k.path('M106 235 Q76 236 50 246') + k.path('M112 240 Q86 248 64 264') + '</g>');
      // nose (rhinarium)
      g.push(k.shape([[78, 204], [92, 200], [102, 207], [98, 220], [84, 225], [76, 216]], 'fill="#5E3A30"', 0.7));
      g.push(k.shape([[80, 204], [92, 201], [99, 206], [88, 209]], 'fill="#A87262" opacity="0.8"', 0.7));
      // eye squeezed shut in the yawn
      g.push(k.line([[128, 212], [140, 216], [154, 214]], 'fill="none" stroke="#2A170B" stroke-width="3" stroke-linecap="round"'));
      g.push(k.line([[126, 207], [141, 204], [156, 207]], 'fill="none" stroke="#E8C68C" stroke-width="2.5" stroke-linecap="round" opacity="0.8"'));
      g.push(k.line([[130, 219], [141, 222], [152, 220]], 'fill="none" stroke="#F0D7A8" stroke-width="2" stroke-linecap="round" opacity="0.7"'));
      // brow
      g.push(k.line([[122, 200], [142, 195], [162, 199]], 'fill="none" stroke="#9A6430" stroke-width="3" stroke-linecap="round" opacity="0.6"'));
      g.push('</g>');
      return g.join('');
    }
  };
})();

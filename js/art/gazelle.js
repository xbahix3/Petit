/* La gazelle — a dorcas gazelle in the dunes of the Algerian Sahara.
   Parts: cornes, sabots, pattes */
(function () {
  'use strict';
  var PR = (window.PR = window.PR || {});
  PR.art = PR.art || {};

  function palm(k, x, y, s, fill) {
    var out = '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="' + fill + '">';
    out += k.path('M-4 0 C-2 -40 4 -80 10 -110 L16 -108 C10 -80 6 -40 6 0 Z');
    [[-60, -100], [-50, -130], [70, -100], [60, -134], [0, -150]].forEach(function (t) {
      out += k.path('M12 -110 Q' + ((t[0] + 12) / 2) + ' ' + (t[1] - 30) + ' ' + t[0] + ' ' + t[1] + ' Q' + ((t[0] + 12) / 2) + ' ' + (t[1] - 12) + ' 12 -106 Z');
    });
    return out + '</g>';
  }

  PR.art.gazelle = {
    viewBox: '0 0 800 600',

    defs: function (k) {
      return [
        k.linU('sky', 0, 0, 0, 420, [[0, '#5DB3EA'], [0.6, '#A6D8F2'], [1, '#FCEBCB']]),
        k.radU('sun', 640, 110, 140, [[0, '#FFFBE6'], [0.3, '#FFF0B8', 0.9], [1, '#FFE9A0', 0]]),
        k.linU('duneFar', 0, 340, 0, 440, [[0, '#F7D9A2'], [1, '#EFC487']]),
        k.linU('duneMid', 0, 380, 0, 480, [[0, '#F5CD8A'], [1, '#E9B26A']]),
        k.linU('sand', 0, 460, 0, 600, [[0, '#F3C985'], [0.6, '#EBB56C'], [1, '#DDA25A']]),
        k.linU('coat', 0, 160, 0, 390, [[0, '#E9BC7E'], [0.6, '#DDA766'], [1, '#D19858']]),
        k.linU('coatFar', 0, 340, 0, 540, [[0, '#C9925A'], [1, '#BC8650']]),
        k.linU('leg', 0, 340, 0, 540, [[0, '#DCA565'], [0.7, '#E0AE72'], [1, '#E8BE88']]),
        k.linU('horn', 0, 60, 0, 170, [[0, '#4A3B2E'], [1, '#2E2219']]),
        k.linU('hoof', 0, 526, 0, 548, [[0, '#4A3829'], [1, '#231912']])
      ].join('');
    },

    scene: function (k) {
      var shrub = function (x, y, s) {
        return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
          k.shape([[-30, 0], [-34, -14], [-20, -30], [0, -36], [22, -30], [34, -14], [30, 0]], 'fill="#9AA567"') +
          k.shape([[-20, -10], [-12, -26], [6, -30], [20, -20], [8, -14]], 'fill="#B9C27F" opacity="0.8"') + '</g>';
      };
      return [
        '<rect width="800" height="600" fill="' + k.f('sky') + '"/>',
        '<circle cx="640" cy="110" r="140" fill="' + k.f('sun') + '"/>',
        '<circle cx="640" cy="110" r="38" fill="#FFF8DA"/>',
        k.cloud(200, 90, 0.6), k.cloud(420, 60, 0.45),
        // far dunes with lit and shaded sides
        k.path('M0 400 C80 360 150 340 220 350 C280 360 320 392 380 396 C460 400 520 350 600 340 C680 332 740 366 800 372 L800 460 L0 460 Z', 'fill="' + k.f('duneFar') + '"'),
        k.path('M220 350 C250 362 270 384 300 396 C260 398 230 398 180 400 C200 380 210 362 220 350 Z', 'fill="#E7B677" opacity="0.6"'),
        k.path('M600 340 C640 352 660 376 700 388 C650 392 610 394 560 392 C580 370 590 352 600 340 Z', 'fill="#E7B677" opacity="0.6"'),
        palm(k, 700, 372, 0.55, '#7E9A5A'), palm(k, 730, 378, 0.42, '#8CA766'), palm(k, 668, 380, 0.38, '#8CA766'),
        k.path('M0 450 C120 420 220 414 320 430 C420 446 520 470 620 440 C700 416 760 420 800 430 L800 500 L0 500 Z', 'fill="' + k.f('duneMid') + '"'),
        k.path('M320 430 C380 440 410 458 460 466 C400 470 360 470 300 470 C306 456 312 442 320 430 Z', 'fill="#DFA45E" opacity="0.45"'),
        '<rect y="480" width="800" height="120" fill="' + k.f('sand') + '"/>',
        k.path('M0 482 C200 470 600 470 800 482', 'fill="none" stroke="#F8DBA6" stroke-width="4" opacity="0.6"'),
        // sand ripples
        '<g fill="none" stroke="#D99D55" stroke-width="2.4" stroke-linecap="round" opacity="0.45">' +
          k.path('M40 560 q30 -8 60 0 q30 8 60 0') + k.path('M600 575 q30 -8 60 0 q30 8 60 0') +
          k.path('M200 590 q25 -6 50 0 q25 6 50 0') + k.path('M680 520 q20 -6 40 0') + '</g>',
        shrub(110, 520, 1), shrub(720, 540, 1.2), shrub(60, 470, 0.6),
        '<ellipse cx="250" cy="572" rx="10" ry="5" fill="#C98E4B"/><ellipse cx="270" cy="578" rx="6" ry="3" fill="#C98E4B"/>'
      ].join('');
    },

    animal: function (k) {
      var g = [];
      g.push('<ellipse cx="480" cy="547" rx="160" ry="11" fill="#9A6A2E" opacity="0.35" filter="' + k.f('blur6') + '"/>');

      var legNF = [[372, 346], [398, 348], [396, 400], [390, 440], [392, 470], [390, 528], [376, 528], [374, 470], [372, 440], [368, 396]];
      var legNH = [[560, 312], [622, 318], [628, 356], [614, 396], [604, 430], [610, 470], [606, 528], [592, 528], [590, 470], [584, 436], [566, 400], [550, 356]];
      var legFF = k.move(legNF, 30, -4), legFH = k.move(legNH, -34, -2);

      // ---- les pattes (all four legs)
      g.push('<g data-part="pattes">');
      g.push(k.shape(legFF, 'fill="' + k.f('coatFar') + '"'));
      g.push(k.shape(legFH, 'fill="' + k.f('coatFar') + '"'));
      g.push('<g class="hit">' +
        '<rect x="356" y="350" width="80" height="176" rx="20" fill="transparent"/>' +
        '<rect x="514" y="330" width="116" height="196" rx="24" fill="transparent"/></g>');
      g.push('</g>');

      // ---- les sabots (far pair)
      var hoof = function (cx, fill) {
        return k.path('M' + (cx - 10) + ' 526 L' + (cx + 9) + ' 526 L' + (cx + 13) + ' 546 L' + (cx - 13) + ' 546 Z', 'fill="' + fill + '"') +
          k.path('M' + cx + ' 532 L' + cx + ' 546', 'stroke="#6E5644" stroke-width="1.6"');
      };
      g.push('<g data-part="sabots">');
      g.push(hoof(413, '#2E2219'));
      g.push(hoof(565, '#2E2219'));
      g.push('</g>');

      // tail
      g.push('<g class="a-tail" style="transform-origin:626px 300px">');
      g.push(k.shape([[620, 296], [636, 300], [644, 330], [636, 344], [628, 330]], 'fill="#3B2C20"'));
      g.push('</g>');

      // body
      g.push('<g class="a-breathe" style="transform-origin:480px 380px">');
      g.push(k.shape([[340, 292], [380, 268], [460, 262], [540, 266], [600, 280], [630, 310], [626, 350], [600, 372], [540, 380], [460, 382], [390, 376], [350, 352], [334, 320]], 'fill="' + k.f('coat') + '"'));
      // white belly + rump
      g.push(k.shape([[384, 352], [460, 362], [560, 360], [612, 350], [602, 372], [540, 380], [460, 382], [392, 376]], 'fill="#FBF4E6"'));
      g.push(k.shape([[612, 300], [630, 312], [628, 350], [612, 356], [618, 326]], 'fill="#FBF4E6"'));
      // dark flank stripe
      g.push(k.line([[372, 344], [460, 356], [560, 354], [612, 346]], 'fill="none" stroke="#8E5A2C" stroke-width="9" stroke-linecap="round" opacity="0.85"'));
      g.push(k.line([[380, 272], [460, 266], [540, 270], [598, 284]], 'fill="none" stroke="#FFE1B0" stroke-width="6" stroke-linecap="round" opacity="0.55"'));
      g.push('</g>');

      // ---- near legs (part of « les pattes »)
      g.push('<g data-part="pattes">');
      g.push(k.shape(legNH, 'fill="' + k.f('leg') + '"'));
      g.push(k.shape(legNF, 'fill="' + k.f('leg') + '"'));
      g.push(k.line([[560, 330], [600, 324], [620, 350]], 'fill="none" stroke="#B9824A" stroke-width="3" stroke-linecap="round" opacity="0.45"'));
      g.push('<ellipse cx="383" cy="442" rx="9" ry="7" fill="#D9A469"/><ellipse cx="597" cy="470" rx="9" ry="7" fill="#D9A469"/>');
      g.push('</g>');

      // ---- les sabots (near pair)
      g.push('<g data-part="sabots">');
      g.push(hoof(383, k.f('hoof')));
      g.push(hoof(599, k.f('hoof')));
      g.push('<g class="hit"><rect x="352" y="512" width="90" height="46" rx="16" fill="transparent"/><rect x="532" y="512" width="96" height="46" rx="16" fill="transparent"/></g>');
      g.push('</g>');

      // neck + head
      g.push('<g class="a-nod" style="transform-origin:370px 300px">');
      g.push(k.path(k.tube([[372, 312], [350, 262], [318, 214], [300, 196]], [84, 60, 44, 42]), 'fill="' + k.f('coat') + '"'));
      g.push(k.path(k.tube([[352, 316], [334, 266], [306, 222]], [26, 18, 12]), 'fill="#FBF4E6" opacity="0.9"'));

      // ---- les cornes (lyre-shaped, ringed)
      var hornA = [[290, 170], [292, 142], [302, 114], [314, 92], [316, 74], [310, 62]];
      var hornB = [[300, 172], [304, 144], [316, 118], [330, 98], [334, 80], [328, 68]];
      var rings = function (line) {
        var out = '';
        for (var i = 0; i < line.length - 2; i++) {
          var a = line[i], b = line[i + 1];
          for (var t = 0.2; t < 1; t += 0.4) {
            var x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
            out += k.path('M' + k.n(x - 5) + ' ' + k.n(y + 1) + ' Q' + k.n(x) + ' ' + k.n(y + 4) + ' ' + k.n(x + 5) + ' ' + k.n(y - 1));
          }
        }
        return '<g fill="none" stroke="#6E5A46" stroke-width="1.8" stroke-linecap="round">' + out + '</g>';
      };
      g.push('<g data-part="cornes">');
      g.push(k.path(k.tube(hornB, [12, 11, 10, 8, 6, 4], { sharp: true }), 'fill="#2A1F17"'));
      g.push(rings(hornB));
      g.push(k.path(k.tube(hornA, [13, 12, 11, 9, 7, 4], { sharp: true }), 'fill="' + k.f('horn') + '"'));
      g.push(rings(hornA));
      g.push('<rect class="hit" x="276" y="48" width="74" height="126" rx="24" fill="transparent"/>');
      g.push('</g>');

      // ears
      g.push('<g class="a-ear" style="transform-origin:304px 178px">');
      g.push(k.shape([[296, 178], [318, 150], [346, 134], [334, 160], [308, 184]], 'fill="#DDA766"'));
      g.push(k.shape([[304, 176], [320, 156], [338, 144], [328, 162], [310, 180]], 'fill="#F6E3C8"'));
      g.push('</g>');
      // head
      g.push(k.shape([[312, 194], [302, 172], [278, 164], [252, 170], [230, 184], [216, 198], [220, 210], [240, 214], [270, 210], [298, 210]], 'fill="' + k.f('coat') + '"'));
      // face stripes: white over dark, typical of the dorcas gazelle
      g.push(k.line([[284, 182], [262, 186], [240, 194], [224, 200]], 'fill="none" stroke="#6E4524" stroke-width="7" stroke-linecap="round" opacity="0.75"'));
      g.push(k.line([[286, 176], [262, 178], [238, 186], [222, 194]], 'fill="none" stroke="#FFF6E6" stroke-width="5" stroke-linecap="round"'));
      g.push(k.shape([[232, 204], [246, 210], [270, 210], [252, 214], [230, 212]], 'fill="#FBF4E6"'));
      g.push('<ellipse cx="220" cy="199" rx="6" ry="5" fill="#2E2219"/>');
      // eye
      g.push('<ellipse cx="272" cy="186" rx="9" ry="8.5" fill="#FFF6E6"/>');
      g.push('<ellipse cx="271" cy="186" rx="7" ry="7" fill="#2A1C12"/><circle cx="269" cy="183" r="2.4" fill="#fff"/>');
      g.push('<g class="a-blink" style="transform-origin:271px 177px;transform:scaleY(0)"><ellipse cx="271" cy="186" rx="10" ry="9.5" fill="#DDA766"/></g>');
      g.push(k.path('M262 180 Q272 174 282 180', 'fill="none" stroke="#2A1C12" stroke-width="2.2" stroke-linecap="round"'));
      g.push('</g>');
      return g.join('');
    }
  };
})();

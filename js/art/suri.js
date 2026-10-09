/* Suri — the little meerkat ranger who guides and encourages.
   Moods (set data-mood on the <svg>): happy, cheer, encourage, think. */
(function () {
  'use strict';
  var PR = (window.PR = window.PR || {});
  PR.art = PR.art || {};

  PR.art.suri = {
    viewBox: '0 0 300 400',

    defs: function (k) {
      return [
        k.linU('fur', 0, 60, 0, 390, [[0, '#E2BC86'], [1, '#C99A5E']]),
        k.radU('head', 140, 100, 110, [[0, '#ECCD9C'], [0.7, '#DDB47C'], [1, '#C99C62']]),
        k.linU('belly', 0, 200, 0, 380, [[0, '#F7E6C6'], [1, '#EBD2A6']]),
        k.linU('hat', 0, 20, 0, 90, [[0, '#E2C27E'], [1, '#B98F45']]),
        k.linU('scarf', 0, 180, 0, 230, [[0, '#3DBE86'], [1, '#22895C']]),
        k.radU('eye', 0.4, 0.35, 0.7, [[0, '#4A3426'], [1, '#140C08']])
      ].join('');
    },

    animal: function (k) {
      var g = [];
      g.push('<g class="suri-bob" style="transform-origin:150px 390px">');
      g.push('<ellipse cx="150" cy="390" rx="70" ry="8" fill="#000" opacity="0.15"/>');
      // tail
      g.push('<g class="a-tail" style="transform-origin:180px 360px">');
      g.push(k.path(k.tube([[176, 366], [214, 360], [244, 336], [256, 300]], [18, 14, 10, 7]), 'fill="' + k.f('fur') + '"'));
      g.push(k.path(k.tube([[250, 318], [256, 300]], [9, 7]), 'fill="#4A3426"'));
      g.push('</g>');
      // feet
      g.push('<ellipse cx="124" cy="384" rx="22" ry="9" fill="#C3935A"/><ellipse cx="176" cy="384" rx="22" ry="9" fill="#C3935A"/>');
      // body
      g.push(k.shape([[150, 168], [190, 188], [206, 250], [208, 320], [194, 370], [150, 388], [106, 370], [92, 320], [94, 250], [110, 188]], 'fill="' + k.f('fur') + '"'));
      g.push(k.shape([[150, 206], [178, 222], [186, 290], [180, 350], [150, 370], [120, 350], [114, 290], [122, 222]], 'fill="' + k.f('belly') + '"'));
      // scarf
      g.push(k.shape([[108, 180], [150, 194], [192, 180], [186, 200], [160, 212], [150, 236], [140, 212], [114, 200]], 'fill="' + k.f('scarf') + '"', 0.7));
      g.push('<circle cx="150" cy="202" r="6" fill="#1E7A51"/>');
      // binocular strap + binoculars
      g.push(k.path('M118 196 Q150 250 182 196', 'fill="none" stroke="#6B4A2E" stroke-width="3"'));
      g.push('<g transform="translate(150 252)">' +
        '<rect x="-24" y="-14" width="20" height="30" rx="7" fill="#2F3A40"/><rect x="4" y="-14" width="20" height="30" rx="7" fill="#2F3A40"/>' +
        '<rect x="-6" y="-8" width="12" height="10" rx="3" fill="#43525A"/>' +
        '<circle cx="-14" cy="12" r="7" fill="#7FB8D6"/><circle cx="14" cy="12" r="7" fill="#7FB8D6"/>' +
        '<circle cx="-16" cy="10" r="2.4" fill="#fff" opacity="0.8"/><circle cx="12" cy="10" r="2.4" fill="#fff" opacity="0.8"/></g>');

      // arms — one pair per pose
      var arm = function (pts) {
        var last = pts[pts.length - 1];
        return k.path(k.tube(pts, [20, 17, 15]), 'fill="' + k.f('fur') + '"') +
          '<circle cx="' + last[0] + '" cy="' + last[1] + '" r="10" fill="#C3935A"/>';
      };
      g.push('<g class="mood m-happy">' + arm([[116, 204], [104, 244], [128, 270]]) + arm(k.mirror([[116, 204], [104, 244], [128, 270]], 150)) + '</g>');
      g.push('<g class="mood m-cheer"><g class="suri-wave-l" style="transform-origin:116px 204px">' + arm([[116, 202], [88, 170], [74, 128]]) + '</g>' +
        '<g class="suri-wave-r" style="transform-origin:184px 204px">' + arm(k.mirror([[116, 202], [88, 170], [74, 128]], 150)) + '</g></g>');
      g.push('<g class="mood m-encourage">' + arm([[116, 204], [104, 244], [128, 270]]) +
        '<g class="suri-wave" style="transform-origin:184px 204px">' + arm([[184, 202], [214, 176], [224, 138]]) +
        // thumbs up
        k.path('M218 128 q2 -14 10 -12 q4 2 0 14 Z', 'fill="#C3935A"') + '</g></g>');
      g.push('<g class="mood m-think">' + arm([[116, 204], [104, 244], [128, 270]]) + arm([[184, 204], [196, 222], [166, 190]]) + '</g>');

      // head
      g.push('<g class="suri-head" style="transform-origin:150px 180px">');
      g.push('<ellipse cx="86" cy="112" rx="14" ry="12" fill="#5A3E2B"/><ellipse cx="214" cy="112" rx="14" ry="12" fill="#5A3E2B"/>');
      g.push(k.shape([[150, 60], [192, 70], [214, 104], [210, 138], [188, 162], [166, 180], [150, 184], [134, 180], [112, 162], [90, 138], [86, 104], [108, 70]], 'fill="' + k.f('head') + '"'));
      g.push(k.shape([[150, 120], [176, 132], [180, 156], [164, 176], [150, 182], [136, 176], [120, 156], [124, 132]], 'fill="#F5E2BF"'));
      // dark eye patches (typical meerkat)
      g.push(k.shape([[106, 104], [132, 98], [146, 114], [140, 140], [122, 148], [104, 132]], 'fill="#5A3E2B"'));
      g.push(k.shape(k.mirror([[106, 104], [132, 98], [146, 114], [140, 140], [122, 148], [104, 132]], 150), 'fill="#5A3E2B"'));
      // eyes
      var eye = function (cx) {
        return '<circle cx="' + cx + '" cy="121" r="14" fill="' + k.f('eye') + '"/>' +
          '<circle cx="' + (cx - 4) + '" cy="115" r="5" fill="#fff"/><circle cx="' + (cx + 5) + '" cy="127" r="2.4" fill="#fff" opacity="0.8"/>' +
          '<g class="a-blink" style="transform-origin:' + cx + 'px 106px;transform:scaleY(0)"><circle cx="' + cx + '" cy="121" r="15.5" fill="#5A3E2B"/></g>';
      };
      g.push(eye(125));
      g.push(eye(175));
      // blush
      g.push('<ellipse cx="104" cy="152" rx="10" ry="6" fill="#F29A8E" opacity="0.55"/><ellipse cx="196" cy="152" rx="10" ry="6" fill="#F29A8E" opacity="0.55"/>');
      // nose
      g.push(k.shape([[142, 158], [158, 158], [150, 168]], 'fill="#2E1E16"', 0.6));
      // mouths
      g.push('<g class="mood m-happy m-encourage">' + k.path('M140 172 Q150 180 160 172', 'fill="none" stroke="#2E1E16" stroke-width="2.6" stroke-linecap="round"') + '</g>');
      g.push('<g class="mood m-cheer">' + k.path('M138 170 Q150 192 162 170 Z', 'fill="#7A2E2A"') + '<ellipse cx="150" cy="180" rx="6" ry="3.5" fill="#F08A96"/></g>');
      g.push('<g class="mood m-think"><ellipse cx="156" cy="174" rx="4" ry="3.5" fill="#2E1E16"/></g>');
      // hat
      g.push('<g class="suri-hat" style="transform-origin:150px 74px">');
      g.push('<ellipse cx="150" cy="76" rx="82" ry="17" fill="#B48A40"/>');
      g.push('<ellipse cx="150" cy="73" rx="80" ry="15" fill="' + k.f('hat') + '"/>');
      g.push(k.shape([[100, 74], [106, 44], [126, 26], [150, 22], [174, 26], [194, 44], [200, 74]], 'fill="' + k.f('hat') + '"', 0.8));
      g.push(k.path('M101 64 Q150 74 199 64 L200 74 Q150 84 100 74 Z', 'fill="#6B4A2E"'));
      g.push(k.path('M150 26 L150 62', 'stroke="#B48A40" stroke-width="3" stroke-linecap="round" opacity="0.7"'));
      // little paw badge
      g.push('<g transform="translate(176 62)" fill="#F5D46A"><circle r="6"/><circle cx="-6" cy="-7" r="2.6"/><circle cx="0" cy="-9" r="2.6"/><circle cx="6" cy="-7" r="2.6"/></g>');
      g.push('</g>');
      g.push('</g>'); // head
      g.push('</g>'); // bob
      return g.join('');
    }
  };
})();

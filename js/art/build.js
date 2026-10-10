/* Le Petit Ranger — turns a painted plate (see plates.js) into an <svg> string.
   Each copy gets a unique id prefix so gradients, masks and filters never clash
   when several pictures are on screen at once.
   opts: viewBox (crop), cls, title, cover, scene:false (no backdrop),
         paint:false (no painting: the live <img> layer is used instead),
         shadow:false, hits:false (no tap zones) */
(function () {
  'use strict';
  var PR = (window.PR = window.PR || {});
  var counter = 0;

  /* ---------- painted plates (see plates.js) ---------- */
  var TINTS = { glow: '#FFD84A', good: '#4FD98A', soft: '#FF9F7A' };
  function polysD(list) {
    return (list || []).map(function (p) {
      return 'M' + p.map(function (q) { return q[0] + ' ' + q[1]; }).join('L') + 'Z';
    }).join('');
  }
  function plateSVG(name, opts) {
    var P = PR.plates[name], W = P.w, H = P.h;
    var id = 'pr' + (++counter).toString(36);
    var vb = opts.viewBox || ('0 0 ' + W + ' ' + H);
    var img = '<image href="' + P.img + '" x="0" y="0" width="' + W + '" height="' + H + '" preserveAspectRatio="none"/>';
    var defs = '<radialGradient id="ID_bd" cx="50%" cy="40%" r="78%"><stop offset="0" stop-color="' + P.backdrop[0] + '"/><stop offset="1" stop-color="' + P.backdrop[1] + '"/></radialGradient>' +
      '<filter id="ID_soft" x="-30%" y="-200%" width="160%" height="500%"><feGaussianBlur stdDeviation="16"/></filter>' +
      '<filter id="ID_mblur" filterUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '"><feGaussianBlur stdDeviation="10"/></filter>';
    // highlight look: a soft halo around the part, the part brightened and tinted
    Object.keys(TINTS).forEach(function (k) {
      defs += '<filter id="ID_t-' + k + '" filterUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '" color-interpolation-filters="sRGB">' +
        '<feMorphology in="SourceAlpha" operator="dilate" radius="4" result="d"/><feGaussianBlur in="d" stdDeviation="10" result="b"/>' +
        '<feFlood flood-color="' + TINTS[k] + '" result="c"/><feComposite in="c" in2="b" operator="in" result="halo"/>' +
        '<feComposite in="c" in2="SourceAlpha" operator="in" result="tc"/>' +
        '<feComponentTransfer in="tc" result="tint"><feFuncA type="linear" slope="0.32"/></feComponentTransfer>' +
        '<feComponentTransfer in="SourceGraphic" result="bright"><feFuncR type="linear" slope="1.14"/><feFuncG type="linear" slope="1.14"/><feFuncB type="linear" slope="1.08"/></feComponentTransfer>' +
        '<feMerge><feMergeNode in="halo"/><feMergeNode in="halo"/><feMergeNode in="bright"/><feMergeNode in="tint"/></feMerge></filter>';
    });
    var hl = '', hits = '';
    Object.keys(P.parts).forEach(function (part) {
      var S = P.parts[part], pad = S.pad || 0;
      defs += '<mask id="ID_m-' + part + '" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '"><g filter="url(#ID_mblur)">' +
        '<path d="' + polysD(S.glow || S.hit) + '" fill="#fff" stroke="#fff" stroke-width="' + (pad * 2 + 34) + '" stroke-linejoin="round"/>' +
        (S.holes ? '<path d="' + polysD(S.holes) + '" fill="#000"/>' : '') + '</g></mask>';
      hl += '<g class="hl" data-hl="' + part + '" mask="url(#ID_m-' + part + ')" style="display:none">' + img + '</g>';
      hits += '<g data-part="' + part + '"' + (S.alt ? ' data-alt="' + S.alt + '"' : '') + '><path class="hit" fill-rule="evenodd" d="' +
        polysD(S.hit) + polysD(S.holes) + '" fill="transparent"' + (pad ? ' stroke="transparent" stroke-width="' + pad * 2 + '" stroke-linejoin="round"' : '') + '/></g>';
    });
    var sh = P.shadow;
    var scene = opts.scene === false ? '' : '<rect x="-400" y="-400" width="' + (W + 800) + '" height="' + (H + 800) + '" fill="url(#ID_bd)"/>';
    var shadow = sh ? '<ellipse cx="' + sh[0] + '" cy="' + sh[1] + '" rx="' + sh[2] + '" ry="' + sh[3] + '" fill="#3A2610" opacity="0.28" filter="url(#ID_soft)"/>' : '';
    var cls = 'art plate art-' + name + (opts.cls ? ' ' + opts.cls : '');
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" class="' + cls + '" data-prefix="' + id +
      '" role="img" preserveAspectRatio="' + (opts.cover ? 'xMidYMid slice' : 'xMidYMid meet') + '">' +
      (opts.title ? '<title>' + opts.title + '</title>' : '') + '<defs>' + defs + '</defs>' + scene +
      '<g class="animal">' + (opts.shadow === false ? '' : shadow) + (opts.paint === false ? '' : '<g class="paint">' + img + '</g>') + hl + '</g>' +
      (opts.hits === false ? '' : '<g class="hits">' + hits + '</g>') + '</svg>').replace(/ID_/g, id + '_');
  }
  PR.plateDims = function (name) { var P = PR.plates && PR.plates[name]; return P ? [P.w, P.h] : [800, 600]; };

  PR.svg = function (name, opts) {
    return plateSVG(name, opts || {});
  };

  // The body-part names a plate declares.
  PR.svgParts = function (name) { return Object.keys(PR.plates[name].parts); };
})();

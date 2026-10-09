/* Le Petit Ranger — turns an art definition into an <svg> string.
   Each copy gets a unique id prefix so gradients and filters never clash
   when several pictures are on screen at once. */
(function () {
  'use strict';
  var PR = (window.PR = window.PR || {});
  PR.art = PR.art || {};
  var cache = {};
  var counter = 0;

  function glowFilter(id, color, radius, blur, pulse) {
    return '<filter id="ID_' + id + '" filterUnits="userSpaceOnUse" x="-400" y="-400" width="1600" height="1400">' +
      '<feMorphology in="SourceAlpha" operator="dilate" radius="' + radius + '" result="d"/>' +
      '<feGaussianBlur in="d" stdDeviation="' + blur + '" result="b"/>' +
      '<feFlood flood-color="' + color + '">' +
      (pulse ? '<animate attributeName="flood-opacity" values="1;0.35;1" dur="1.4s" repeatCount="indefinite"/>' : '') +
      '</feFlood>' +
      '<feComposite in2="b" operator="in" result="g"/>' +
      '<feMerge><feMergeNode in="g"/><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>' +
      '</filter>';
  }

  var SHARED_DEFS =
    glowFilter('glow', '#FFE15A', 3, 7, true) +
    glowFilter('good', '#5BE38A', 3, 7, false) +
    glowFilter('soft', '#FFB38A', 2, 6, false) +
    '<filter id="ID_blur2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2"/></filter>' +
    '<filter id="ID_blur6" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>' +
    '<filter id="ID_blur14" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="14"/></filter>';

  function parts(name) {
    if (cache[name]) return cache[name];
    var def = PR.art[name];
    if (!def) throw new Error('Unknown art: ' + name);
    var k = PR.kit;
    cache[name] = {
      defs: SHARED_DEFS + (def.defs ? def.defs(k) : ''),
      scene: def.scene ? def.scene(k) : '',
      animal: def.animal(k),
      front: def.front ? def.front(k) : ''
    };
    return cache[name];
  }

  /* opts: scene (bool, default true), cls (extra class), title (accessible label),
     viewBox (override), still (bool: no idle animation) */
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
      '<g class="animal">' + shadow + '<g class="paint">' + img + '</g>' + hl + '</g>' +
      (opts.hits === false ? '' : '<g class="hits">' + hits + '</g>') + '</svg>').replace(/ID_/g, id + '_');
  }
  PR.plateDims = function (name) { var P = PR.plates && PR.plates[name]; return P ? [P.w, P.h] : [800, 600]; };

  PR.svg = function (name, opts) {
    opts = opts || {};
    if (PR.plates && PR.plates[name]) return plateSVG(name, opts);
    var def = PR.art[name];
    var p = parts(name);
    var id = 'pr' + (++counter).toString(36);
    var vb = opts.viewBox || def.viewBox || '0 0 800 600';
    var scene = opts.scene === false ? '' : p.scene;
    var front = opts.scene === false ? '' : p.front;
    var cls = 'art art-' + name + (opts.cls ? ' ' + opts.cls : '') + (opts.still ? ' still' : '');
    var label = opts.title ? '<title>' + opts.title + '</title>' : '';
    var body = '<defs>' + p.defs + '</defs>' + scene +
      (opts.animal === false ? '' : '<g class="animal">' + p.animal + '</g>') + front;
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" class="' + cls +
      '" data-prefix="' + id + '" role="img" preserveAspectRatio="' + (opts.cover ? 'xMidYMid slice' : 'xMidYMid meet') + '">' + label + body + '</svg>')
      .replace(/ID_/g, id + '_');
  };

  // Lists the part names an art piece declares (data-part="...").
  PR.svgParts = function (name) {
    if (PR.plates && PR.plates[name]) return Object.keys(PR.plates[name].parts);
    var p = parts(name);
    var found = {}, re = /data-part="([^"]+)"/g, m;
    while ((m = re.exec(p.animal))) found[m[1]] = true;
    return Object.keys(found);
  };
})();

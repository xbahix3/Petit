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
  PR.svg = function (name, opts) {
    opts = opts || {};
    var def = PR.art[name];
    var p = parts(name);
    var id = 'pr' + (++counter).toString(36);
    var vb = opts.viewBox || def.viewBox || '0 0 800 600';
    var scene = opts.scene === false ? '' : p.scene;
    var front = opts.scene === false ? '' : p.front;
    var cls = 'art art-' + name + (opts.cls ? ' ' + opts.cls : '') + (opts.still ? ' still' : '');
    var label = opts.title ? '<title>' + opts.title + '</title>' : '';
    var body = '<defs>' + p.defs + '</defs>' + scene +
      '<g class="animal">' + p.animal + '</g>' + front;
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" class="' + cls +
      '" data-prefix="' + id + '" role="img" preserveAspectRatio="xMidYMid meet">' + label + body + '</svg>')
      .replace(/ID_/g, id + '_');
  };

  // Lists the part names an art piece declares (data-part="...").
  PR.svgParts = function (name) {
    var p = parts(name);
    var found = {}, re = /data-part="([^"]+)"/g, m;
    while ((m = re.exec(p.animal))) found[m[1]] = true;
    return Object.keys(found);
  };
})();

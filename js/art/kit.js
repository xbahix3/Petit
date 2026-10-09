/* Le Petit Ranger — drawing kit.
   Small helpers that turn point lists into smooth SVG paths, so the
   illustrations can be described as shapes instead of raw curve data.
   Everything is deterministic (seeded), so a picture is identical on every load. */
(function () {
  'use strict';
  var PR = (window.PR = window.PR || {});

  function n(v) { return Math.round(v * 10) / 10; }
  function pt(p) { return n(p[0]) + ' ' + n(p[1]); }

  // Seeded random numbers (mulberry32).
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Smooth curve through points (Catmull-Rom converted to cubic Béziers).
  // tension 1 = classic Catmull-Rom; lower values make tighter corners.
  function smooth(pts, closed, tension) {
    if (closed === undefined) closed = true;
    var t = tension === undefined ? 1 : tension;
    var len = pts.length;
    function get(i) {
      if (closed) return pts[(i + len) % len];
      return pts[Math.max(0, Math.min(len - 1, i))];
    }
    var d = 'M' + pt(pts[0]);
    var segs = closed ? len : len - 1;
    for (var i = 0; i < segs; i++) {
      var p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
      var c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * t, p1[1] + ((p2[1] - p0[1]) / 6) * t];
      var c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * t, p2[1] - ((p3[1] - p1[1]) / 6) * t];
      d += 'C' + pt(c1) + ' ' + pt(c2) + ' ' + pt(p2);
    }
    return d + (closed ? 'Z' : '');
  }

  // Ring of flame-like tufts (manes, ruffs, feather collars).
  // o: {cx, cy, r1 (valley radius), r2 (tip radius), n, seed, curl (radians),
  //     sx, sy (scale), jitter (0..1), start, end (angle range, radians)}
  function tufts(o) {
    var r = rng(o.seed || 1);
    var count = o.n || 16;
    var start = o.start === undefined ? 0 : o.start;
    var end = o.end === undefined ? Math.PI * 2 : o.end;
    var full = Math.abs(end - start - Math.PI * 2) < 1e-6;
    var da = (end - start) / count;
    var sx = o.sx || 1, sy = o.sy || 1;
    var curl = o.curl === undefined ? 0.25 : o.curl;
    var jit = o.jitter === undefined ? 0.18 : o.jitter;
    function P(a, rad) { return [o.cx + Math.cos(a) * rad * sx, o.cy + Math.sin(a) * rad * sy]; }
    var valleys = [];
    for (var i = 0; i <= count; i++) {
      valleys.push(o.r1 * (1 - jit * 0.4 + r() * jit * 0.4));
    }
    if (full) valleys[count] = valleys[0];
    var d = 'M' + pt(P(start, valleys[0]));
    var round = o.round || 0;
    for (var j = 0; j < count; j++) {
      var a = start + j * da;
      var tipR = o.r2 * (1 - jit + r() * jit * 1.2);
      var ta = a + da * 0.5 + curl * da;
      var c1 = P(a + da * 0.05, valleys[j] + (tipR - valleys[j]) * 0.62);
      var c2 = P(a + da * 0.95, valleys[j + 1] + (tipR - valleys[j + 1]) * 0.35);
      if (round > 0) {
        // soft, rounded tip: two shoulder points joined by a small bulge
        var w = da * round * 0.22;
        var t1 = P(ta - w, tipR * 0.96), t2 = P(ta + w, tipR * 0.96);
        d += 'Q' + pt(c1) + ' ' + pt(t1) + 'Q' + pt(P(ta, tipR * 1.05)) + ' ' + pt(t2) +
          'Q' + pt(c2) + ' ' + pt(P(a + da, valleys[j + 1]));
      } else {
        d += 'Q' + pt(c1) + ' ' + pt(P(ta, tipR)) + 'Q' + pt(c2) + ' ' + pt(P(a + da, valleys[j + 1]));
      }
    }
    return d + (full ? 'Z' : '');
  }

  // Grass blades along a band. Returns a string of <path> elements.
  // o: {x0, x1, y, h, count, seed, colors[], lean, width, opacity}
  function grass(o) {
    var r = rng(o.seed || 7);
    var out = '';
    var colors = o.colors || ['#8bbf4a'];
    for (var i = 0; i < o.count; i++) {
      var x = o.x0 + r() * (o.x1 - o.x0);
      var y = o.y + (o.dy ? r() * o.dy : 0);
      var h = o.h * (0.55 + r() * 0.6);
      var w = (o.width || 5) * (0.7 + r() * 0.6);
      var lean = (o.lean === undefined ? 0 : o.lean) + (r() - 0.5) * (o.spread === undefined ? 0.9 : o.spread);
      var tipX = x + lean * h * 0.6;
      var tipY = y - h;
      var midX = x + lean * h * 0.15;
      var d = 'M' + n(x - w / 2) + ' ' + n(y) +
        'Q' + n(midX - w * 0.2) + ' ' + n(y - h * 0.55) + ' ' + n(tipX) + ' ' + n(tipY) +
        'Q' + n(midX + w * 0.45) + ' ' + n(y - h * 0.5) + ' ' + n(x + w / 2) + ' ' + n(y) + 'Z';
      var c = colors[Math.floor(r() * colors.length)];
      out += '<path d="' + d + '" fill="' + c + '"' + (o.opacity ? ' opacity="' + o.opacity + '"' : '') + '/>';
    }
    return out;
  }

  // Short fur strokes inside an ellipse area, following an angle.
  // o: {cx, cy, rx, ry, count, len, angle (deg), seed, color, width, opacity}
  function fur(o) {
    var r = rng(o.seed || 3);
    var out = '';
    var base = ((o.angle || 0) * Math.PI) / 180;
    for (var i = 0; i < o.count; i++) {
      var a = r() * Math.PI * 2, rad = Math.sqrt(r());
      var x = o.cx + Math.cos(a) * o.rx * rad;
      var y = o.cy + Math.sin(a) * o.ry * rad;
      var L = o.len * (0.6 + r() * 0.7);
      var dir = o.radial ? Math.atan2(y - o.cy, x - o.cx) + (o.twist || 0) : base;
      var ang = dir + (r() - 0.5) * 0.5;
      var x2 = x + Math.cos(ang) * L, y2 = y + Math.sin(ang) * L;
      var bend = (r() - 0.5) * L * 0.5;
      var mx = (x + x2) / 2 - Math.sin(ang) * bend, my = (y + y2) / 2 + Math.cos(ang) * bend;
      out += '<path d="M' + n(x) + ' ' + n(y) + 'Q' + n(mx) + ' ' + n(my) + ' ' + n(x2) + ' ' + n(y2) + '"/>';
    }
    return '<g fill="none" stroke="' + (o.color || '#000') + '" stroke-width="' + (o.width || 1.6) +
      '" stroke-linecap="round" opacity="' + (o.opacity === undefined ? 0.25 : o.opacity) + '">' + out + '</g>';
  }

  // Tapered tube along a centre line (trunks, tails, necks, tusks).
  // widths: number of widths matching pts, or [w0, w1] interpolated along the line.
  function tube(pts, widths, opts) {
    opts = opts || {};
    var cnt = pts.length, left = [], right = [];
    function wAt(i) {
      if (widths.length === cnt) return widths[i];
      return widths[0] + (widths[1] - widths[0]) * (i / (cnt - 1));
    }
    for (var i = 0; i < cnt; i++) {
      var a = pts[Math.max(0, i - 1)], b = pts[Math.min(cnt - 1, i + 1)];
      var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy) || 1;
      var nx = -dy / L, ny = dx / L, w = wAt(i) / 2;
      left.push([pts[i][0] + nx * w, pts[i][1] + ny * w]);
      right.push([pts[i][0] - nx * w, pts[i][1] - ny * w]);
    }
    var e = pts[cnt - 1], p = pts[cnt - 2];
    var ex = e[0] - p[0], ey = e[1] - p[1], eL = Math.sqrt(ex * ex + ey * ey) || 1;
    var tip = opts.sharp ? [e[0] + (ex / eL) * wAt(cnt - 1) * 2.2, e[1] + (ey / eL) * wAt(cnt - 1) * 2.2]
      : [e[0] + (ex / eL) * wAt(cnt - 1) * 0.5, e[1] + (ey / eL) * wAt(cnt - 1) * 0.5];
    var all = left.concat([tip]).concat(right.reverse());
    return smooth(all, true, opts.tension === undefined ? 0.9 : opts.tension);
  }

  // Voronoi cells (for giraffe patches, scales…). seeds: [[x,y]], box: [x0,y0,x1,y1]
  function clipPoly(poly, fn) {
    var out = [];
    for (var i = 0; i < poly.length; i++) {
      var a = poly[i], b = poly[(i + 1) % poly.length], fa = fn(a), fb = fn(b);
      if (fa <= 0) out.push(a);
      if ((fa <= 0) !== (fb <= 0)) {
        var t = fa / (fa - fb);
        out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      }
    }
    return out;
  }
  function voronoi(seeds, box) {
    return seeds.map(function (s, i) {
      var poly = [[box[0], box[1]], [box[2], box[1]], [box[2], box[3]], [box[0], box[3]]];
      for (var j = 0; j < seeds.length && poly.length; j++) {
        if (j === i) continue;
        var o = seeds[j], mx = (s[0] + o[0]) / 2, my = (s[1] + o[1]) / 2, nx = o[0] - s[0], ny = o[1] - s[1];
        poly = clipPoly(poly, function (p) { return (p[0] - mx) * nx + (p[1] - my) * ny; });
      }
      return poly;
    });
  }
  // Shrink a polygon toward its centre by a fixed gap (approximately).
  function inset(poly, gap) {
    var cx = 0, cy = 0;
    poly.forEach(function (p) { cx += p[0]; cy += p[1]; });
    cx /= poly.length; cy /= poly.length;
    return poly.map(function (p) {
      var dx = p[0] - cx, dy = p[1] - cy, L = Math.sqrt(dx * dx + dy * dy) || 1;
      var k = Math.max(0.1, (L - gap) / L);
      return [cx + dx * k, cy + dy * k];
    });
  }
  // Jittered grid of seed points.
  function seedsGrid(box, step, jitter, seed) {
    var r = rng(seed || 5), out = [];
    for (var y = box[1]; y <= box[3]; y += step) {
      for (var x = box[0] + ((y / step) % 2 ? step / 2 : 0); x <= box[2]; x += step) {
        out.push([x + (r() - 0.5) * step * jitter, y + (r() - 0.5) * step * jitter]);
      }
    }
    return out;
  }

  // Soft cartoon cloud (flat bottom, puffy top, light shading underneath).
  function cloud(x, y, s, light, shade) {
    light = light || '#FFFFFF'; shade = shade || '#DCEFFA';
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<path d="M-70 10 C-90 10 -92 -18 -66 -20 C-66 -46 -30 -52 -18 -34 C-10 -64 34 -66 42 -34 C58 -50 88 -38 80 -14 C100 -12 98 10 78 10 Z" fill="' + shade + '"/>' +
      '<path d="M-70 4 C-88 2 -86 -20 -64 -22 C-62 -46 -30 -52 -18 -36 C-8 -64 34 -66 42 -36 C58 -50 86 -38 78 -16 C96 -12 94 4 76 4 Z" fill="' + light + '"/>' +
      '</g>';
  }

  // Linear / radial gradient helpers. stops: [[offset, color, opacity?], ...]
  function stopsXml(stops) {
    return stops.map(function (s) {
      return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"' +
        (s[2] !== undefined ? ' stop-opacity="' + s[2] + '"' : '') + '/>';
    }).join('');
  }
  function lin(id, x1, y1, x2, y2, stops) {
    return '<linearGradient id="ID_' + id + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '">' + stopsXml(stops) + '</linearGradient>';
  }
  function linU(id, x1, y1, x2, y2, stops) {
    return '<linearGradient id="ID_' + id + '" gradientUnits="userSpaceOnUse" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '">' + stopsXml(stops) + '</linearGradient>';
  }
  function rad(id, cx, cy, r, stops, fx, fy) {
    return '<radialGradient id="ID_' + id + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '"' +
      (fx !== undefined ? ' fx="' + fx + '" fy="' + fy + '"' : '') + '>' + stopsXml(stops) + '</radialGradient>';
  }
  function radU(id, cx, cy, r, stops, fx, fy) {
    return '<radialGradient id="ID_' + id + '" gradientUnits="userSpaceOnUse" cx="' + cx + '" cy="' + cy + '" r="' + r + '"' +
      (fx !== undefined ? ' fx="' + fx + '" fy="' + fy + '"' : '') + '>' + stopsXml(stops) + '</radialGradient>';
  }

  function path(d, attrs) { return '<path d="' + d + '"' + (attrs ? ' ' + attrs : '') + '/>'; }
  function shape(pts, attrs, tension) { return path(smooth(pts, true, tension), attrs); }
  function line(pts, attrs, tension) { return path(smooth(pts, false, tension), attrs); }
  function f(id) { return 'url(#ID_' + id + ')'; }

  // Mirror a list of points around a vertical axis x = ax.
  function mirror(pts, ax) { return pts.map(function (p) { return [2 * ax - p[0], p[1]]; }); }
  // Translate / scale point lists.
  function move(pts, dx, dy) { return pts.map(function (p) { return [p[0] + dx, p[1] + dy]; }); }

  PR.kit = {
    rng: rng, smooth: smooth, tufts: tufts, grass: grass, fur: fur, tube: tube, cloud: cloud, voronoi: voronoi, inset: inset, seedsGrid: seedsGrid,
    lin: lin, linU: linU, rad: rad, radU: radU,
    path: path, shape: shape, line: line, f: f, mirror: mirror, move: move, n: n
  };
})();

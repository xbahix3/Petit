/* Le Petit Ranger — icons (inline SVG strings). */
(function () {
  'use strict';
  var PR = (window.PR = window.PR || {});
  function svg(vb, body, cls) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '"' + (cls ? ' class="' + cls + '"' : '') + ' aria-hidden="true">' + body + '</svg>';
  }
  PR.icons = {
    home: svg('0 0 24 24', '<path d="M3 11.2 12 4l9 7.2" fill="none" stroke="#3B2A1C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.5 10v9a1 1 0 0 0 1 1h4v-5.5h3V20h4a1 1 0 0 0 1-1v-9" fill="#F5A524" stroke="#3B2A1C" stroke-width="2.2" stroke-linejoin="round"/>'),
    back: svg('0 0 24 24', '<path d="M15 5l-7 7 7 7" fill="none" stroke="#3B2A1C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'),
    next: svg('0 0 24 24', '<path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'),
    soundOn: svg('0 0 24 24', '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="#3FA9E0" stroke="#3B2A1C" stroke-width="2" stroke-linejoin="round"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="#3B2A1C" stroke-width="2.2" stroke-linecap="round"/>'),
    soundOff: svg('0 0 24 24', '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="#D8C8B0" stroke="#3B2A1C" stroke-width="2" stroke-linejoin="round"/><path d="M16 9.5l5 5M21 9.5l-5 5" stroke="#3B2A1C" stroke-width="2.2" stroke-linecap="round"/>'),
    speak: svg('0 0 24 24', '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'),
    bulb: svg('0 0 24 24', '<path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" fill="#FFD54A" stroke="#3B2A1C" stroke-width="1.8"/><path d="M9.5 19.5h5M10.5 22h3" stroke="#3B2A1C" stroke-width="1.8" stroke-linecap="round"/>'),
    check: svg('0 0 24 24', '<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>'),
    plus: svg('0 0 24 24', '<circle cx="12" cy="12" r="4" fill="#fff"/>'),
    again: svg('0 0 24 24', '<path d="M19 12a7 7 0 1 1-2.1-5" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M17.5 3.5v4.2h-4.2" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>'),
    star: function (on) {
      return svg('0 0 64 64', '<defs><linearGradient id="st' + (on ? 1 : 0) + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE27A"/><stop offset="1" stop-color="#F5A524"/></linearGradient></defs>' +
        '<path d="M32 4l8.6 17.4 19.2 2.8-13.9 13.6 3.3 19.1L32 47.9 14.8 56.9l3.3-19.1L4.2 24.2l19.2-2.8z" fill="url(#st' + (on ? 1 : 0) + ')" stroke="#C97A0C" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M24 22l8-14 3 8" fill="none" stroke="#FFF6CF" stroke-width="3" stroke-linecap="round" opacity=".8"/>', on ? '' : 'off');
    },
    paw: svg('0 0 64 64', '<g fill="#FFF3D6"><ellipse cx="32" cy="42" rx="14" ry="12"/><ellipse cx="16" cy="26" rx="6" ry="8"/><ellipse cx="27" cy="17" rx="6" ry="8"/><ellipse cx="38" cy="17" rx="6" ry="8"/><ellipse cx="48" cy="26" rx="6" ry="8"/></g>'),
    leaf: svg('0 0 64 64', '<path d="M6 40C14 14 40 6 58 8c-2 22-16 44-44 44 0 0-6 0-8-12z" fill="#6CC04A"/><path d="M10 50C22 38 34 26 52 14" stroke="#3E8A2A" stroke-width="3" fill="none" stroke-linecap="round"/>'),

    // Activity icons (larger, coloured)
    binoculars: svg('0 0 96 96',
      '<defs><linearGradient id="bn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4B5B66"/><stop offset="1" stop-color="#26323A"/></linearGradient></defs>' +
      '<rect x="14" y="26" width="28" height="46" rx="12" fill="url(#bn)"/><rect x="54" y="26" width="28" height="46" rx="12" fill="url(#bn)"/>' +
      '<rect x="38" y="34" width="20" height="18" rx="6" fill="#55656F"/><rect x="20" y="16" width="16" height="16" rx="5" fill="#33414A"/><rect x="60" y="16" width="16" height="16" rx="5" fill="#33414A"/>' +
      '<circle cx="28" cy="70" r="13" fill="#9FD8F2" stroke="#26323A" stroke-width="4"/><circle cx="68" cy="70" r="13" fill="#9FD8F2" stroke="#26323A" stroke-width="4"/>' +
      '<circle cx="24" cy="66" r="4" fill="#fff"/><circle cx="64" cy="66" r="4" fill="#fff"/>', 'icon'),
    pointer: svg('0 0 96 96',
      '<circle cx="34" cy="26" r="16" fill="none" stroke="#fff" stroke-width="4" opacity=".7"/><circle cx="34" cy="26" r="7" fill="#fff"/>' +
      '<path d="M30 30c0-4 6-4 6 0v22l3-1c0-4 6-4 6 0v2c0-4 6-4 6 0v3c0-4 6-4 6 0v14c0 10-6 18-17 18h-4c-7 0-12-4-15-10l-8-15c-2-4 3-7 6-4l5 6V30z" fill="#FFE0BF" stroke="#3B2A1C" stroke-width="3.5" stroke-linejoin="round"/>', 'icon'),
    pencil: svg('0 0 96 96',
      '<g transform="rotate(40 48 48)"><rect x="38" y="6" width="20" height="62" rx="3" fill="#FFC93C" stroke="#3B2A1C" stroke-width="3.5"/>' +
      '<rect x="38" y="6" width="20" height="12" rx="3" fill="#F28CA0" stroke="#3B2A1C" stroke-width="3.5"/><rect x="38" y="16" width="20" height="6" fill="#C9CED6" stroke="#3B2A1C" stroke-width="3"/>' +
      '<path d="M38 68h20L48 88z" fill="#F7DDB5" stroke="#3B2A1C" stroke-width="3.5" stroke-linejoin="round"/><path d="M44.5 80.5h7L48 88z" fill="#3B2A1C"/></g>' +
      '<path d="M12 84c10-6 18 4 28-2" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>', 'icon'),
    question: svg('0 0 96 96',
      '<path d="M48 10c22 0 38 14 38 32S70 74 48 74c-4 0-8 0-12-2L18 82l4-16C14 60 10 52 10 42c0-18 16-32 38-32z" fill="#fff" stroke="#3B2A1C" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M38 34c0-7 5-11 11-11s11 4 11 10c0 8-10 8-10 15" fill="none" stroke="#8E6FD8" stroke-width="7" stroke-linecap="round"/><circle cx="50" cy="60" r="5" fill="#8E6FD8"/>', 'icon'),
    cards: svg('0 0 96 96',
      '<g transform="rotate(-14 34 52)"><rect x="12" y="18" width="40" height="56" rx="8" fill="#2E9E6A" stroke="#3B2A1C" stroke-width="3.5"/><g transform="translate(18 32) scale(.44)" fill="#FFF3D6"><ellipse cx="32" cy="42" rx="14" ry="12"/><ellipse cx="16" cy="26" rx="6" ry="8"/><ellipse cx="27" cy="17" rx="6" ry="8"/><ellipse cx="38" cy="17" rx="6" ry="8"/><ellipse cx="48" cy="26" rx="6" ry="8"/></g></g>' +
      '<g transform="rotate(12 62 52)"><rect x="42" y="18" width="40" height="56" rx="8" fill="#fff" stroke="#3B2A1C" stroke-width="3.5"/><path d="M52 52c4-14 18-18 22-6-8 2-14 8-22 6z" fill="#F5A524"/><circle cx="62" cy="36" r="6" fill="#E5677E"/></g>', 'icon'),
    bubble: svg('0 0 96 96',
      '<path d="M14 18h68a8 8 0 0 1 8 8v34a8 8 0 0 1-8 8H44L26 82l4-14H14a8 8 0 0 1-8-8V26a8 8 0 0 1 8-8z" fill="#fff" stroke="#3B2A1C" stroke-width="4" stroke-linejoin="round"/>' +
      '<rect x="18" y="32" width="18" height="8" rx="4" fill="#F08F5E"/><rect x="40" y="32" width="36" height="8" rx="4" fill="#D9C7AE"/>' +
      '<rect x="18" y="48" width="30" height="8" rx="4" fill="#D9C7AE"/><rect x="52" y="48" width="14" height="8" rx="4" fill="#2E9E6A"/>', 'icon'),
    ear: svg('0 0 24 24', '<path d="M5 20c2 0 3-1 3-3 0-3 4-4 4-8a4 4 0 1 0-8 0" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>')
  };
})();

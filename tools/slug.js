// Turns « la crinière du lion » into « la-criniere-du-lion ».
module.exports = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/['’]/g, '-').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

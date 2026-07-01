/**
 * assets.js
 * Asset manifest — maps logical asset keys to their public paths.
 * The AssetManager preloads entries from this manifest.
 * Future phases: add entries here and they auto-preload.
 */

export const ASSET_MANIFEST = {
  // ─── Audio: Music ────────────────────────────────────────────────────────
  music: {
    loading:        '/audio/music/loading-theme.mp3',
    authentication: '/audio/music/auth-theme.mp3',
    welcome:        '/audio/music/welcome-fanfare.mp3',
    nightSky:       '/audio/music/night-sky-ambient.mp3',
    castle:         '/audio/music/castle-theme.mp3',
    princess:       '/audio/music/princess-entrance.mp3',
    balloons:       '/audio/music/celebration-jingle.mp3',
    cake:           '/audio/music/happy-birthday-orchestral.mp3',
    gallery:        '/audio/music/gallery-waltz.mp3',
    letter:         '/audio/music/letter-piano.mp3',
    games:          '/audio/music/game-theme.mp3',
    certificate:    '/audio/music/achievement-fanfare.mp3',
    feedback:       '/audio/music/feedback-gentle.mp3',
    finale:         '/audio/music/grand-finale.mp3',
  },

  // ─── Audio: SFX ──────────────────────────────────────────────────────────
  sfx: {
    magicWand:      '/audio/sfx/magic-wand.mp3',
    firework:       '/audio/sfx/firework-burst.mp3',
    candleBlow:     '/audio/sfx/candle-blow.mp3',
    cakeCut:        '/audio/sfx/cake-cut.mp3',
    balloonPop:     '/audio/sfx/balloon-pop.mp3',
    sparkle:        '/audio/sfx/sparkle.mp3',
    pageFlip:       '/audio/sfx/page-flip.mp3',
    buttonClick:    '/audio/sfx/button-click.mp3',
    success:        '/audio/sfx/success-chime.mp3',
    transitionWhoosh: '/audio/sfx/transition-whoosh.mp3',
  },

  // ─── 3D Models ───────────────────────────────────────────────────────────
  models: {
    cake:     '/models/birthday-cake.glb',
    castle:   '/models/castle.glb',
    crown:    '/models/crown.glb',
  },

  // ─── Textures ─────────────────────────────────────────────────────────────
  textures: {
    starfield:      '/textures/starfield.png',
    cakeFrosting:   '/textures/cake-frosting.jpg',
    castleStone:    '/textures/castle-stone.jpg',
    certificatePaper: '/textures/certificate-paper.jpg',
  },

  // ─── HDR Environments ─────────────────────────────────────────────────────
  hdr: {
    nightSky:  '/assets/hdr/night-sky.hdr',
    castle:    '/assets/hdr/castle-interior.hdr',
  },
};

/**
 * Returns the flat list of all asset URLs for a given category.
 * @param {'music'|'sfx'|'models'|'textures'|'hdr'} category
 * @returns {string[]}
 */
export function getAssetUrls(category) {
  return Object.values(ASSET_MANIFEST[category] ?? {});
}

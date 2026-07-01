/**
 * audio.js
 * Audio key constants — mirrors the ASSET_MANIFEST keys in config/assets.js.
 * Always use these constants when calling SoundManager.play().
 */

/** Background music track keys */
export const MUSIC = {
  LOADING:        'loading',
  AUTHENTICATION: 'authentication',
  WELCOME:        'welcome',
  NIGHT_SKY:      'nightSky',
  CASTLE:         'castle',
  PRINCESS:       'princess',
  BALLOONS:       'balloons',
  CAKE:           'cake',
  GALLERY:        'gallery',
  LETTER:         'letter',
  GAMES:          'games',
  CERTIFICATE:    'certificate',
  FEEDBACK:       'feedback',
  FINALE:         'finale',
};

/** Sound effect keys */
export const SFX = {
  MAGIC_WAND:           'magicWand',
  FIREWORK:             'firework',
  CANDLE_BLOW:          'candleBlow',
  CAKE_CUT:             'cakeCut',
  BALLOON_POP:          'balloonPop',
  SPARKLE:              'sparkle',
  PAGE_FLIP:            'pageFlip',
  BUTTON_CLICK:         'buttonClick',
  SUCCESS:              'success',
  TRANSITION_WHOOSH:    'transitionWhoosh',
};

/** Default volume levels (0.0 – 1.0) */
export const VOLUME = {
  MUSIC_DEFAULT: 0.5,
  MUSIC_AMBIENT: 0.3,
  SFX_DEFAULT:   0.8,
  MUTED:         0.0,
};

/** Crossfade duration in milliseconds */
export const CROSSFADE_DURATION = 1500;

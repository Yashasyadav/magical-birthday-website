/**
 * scenes.js
 * Scene name constants — used by SceneManager, router, and AppContext.
 * Never use raw strings for scene names anywhere in the codebase.
 */

export const SCENES = {
  LOADING:         'loading',
  AUTHENTICATION:  'authentication',
  WELCOME:         'welcome',
  NIGHT_SKY:       'night-sky',
  CASTLE:          'castle',
  PRINCESS:        'princess',
  BALLOONS:        'balloons',
  CAKE:            'cake',
  MEMORY_CAMERA:   'memory-camera',
  GALLERY:         'gallery',
  LETTER:          'letter',
  GAMES:           'games',
  CERTIFICATE:     'certificate',
  FEEDBACK:        'feedback',
  FINALE:          'finale',
};

/**
 * Ordered scene sequence for the birthday experience.
 * SceneManager.nextScene() follows this array.
 */
export const SCENE_SEQUENCE = [
  SCENES.LOADING,
  SCENES.AUTHENTICATION,
  SCENES.WELCOME,
  SCENES.NIGHT_SKY,
  SCENES.CASTLE,
  SCENES.PRINCESS,
  SCENES.BALLOONS,
  SCENES.CAKE,
  SCENES.MEMORY_CAMERA,
  SCENES.GALLERY,
  SCENES.LETTER,
  SCENES.GAMES,
  SCENES.CERTIFICATE,
  SCENES.FEEDBACK,
  SCENES.FINALE,
];

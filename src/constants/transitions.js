/**
 * transitions.js
 * Transition type constants and per-scene transition map.
 * TransitionManager reads SCENE_TRANSITIONS to select the correct effect.
 */

/** All available transition effects */
export const TRANSITIONS = {
  FADE:             'fade',
  DOOR_OPEN:        'door-open',
  CURTAIN:          'curtain',
  ZOOM_OUT:         'zoom-out',
  WIPE:             'wipe',
  SPARKLE_DISSOLVE: 'sparkle-dissolve',
  IRIS:             'iris',
  NONE:             'none',
};

/** Default duration for each transition type (ms) */
export const TRANSITION_DURATION = {
  [TRANSITIONS.FADE]:             800,
  [TRANSITIONS.DOOR_OPEN]:       1400,
  [TRANSITIONS.CURTAIN]:         1200,
  [TRANSITIONS.ZOOM_OUT]:        1000,
  [TRANSITIONS.WIPE]:             900,
  [TRANSITIONS.SPARKLE_DISSOLVE]: 1000,
  [TRANSITIONS.IRIS]:             1100,
  [TRANSITIONS.NONE]:               0,
};

/**
 * Per-scene transition map.
 * Key = scene leaving. Value = transition to play before mounting next scene.
 * Add entries here when adding new scenes.
 */
export const SCENE_TRANSITIONS = {
  loading:        TRANSITIONS.FADE,
  authentication: TRANSITIONS.SPARKLE_DISSOLVE,
  welcome:        TRANSITIONS.CURTAIN,
  'night-sky':    TRANSITIONS.DOOR_OPEN,
  castle:         TRANSITIONS.ZOOM_OUT,
  princess:       TRANSITIONS.SPARKLE_DISSOLVE,
  balloons:       TRANSITIONS.IRIS,
  cake:           TRANSITIONS.CURTAIN,
  gallery:        TRANSITIONS.WIPE,
  letter:         TRANSITIONS.FADE,
  games:          TRANSITIONS.FADE,
  certificate:    TRANSITIONS.SPARKLE_DISSOLVE,
  feedback:       TRANSITIONS.FADE,
  finale:         TRANSITIONS.NONE,
};

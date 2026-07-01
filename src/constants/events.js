/**
 * events.js
 * Global event name constants for the custom event bus.
 * Use EventEmitter (engine) or browser CustomEvent with these names.
 * Never dispatch/listen to raw string events.
 */

export const EVENTS = {
  // ─── Scene Lifecycle ───────────────────────────────────────────────────
  SCENE_LOAD_START:     'scene:load:start',
  SCENE_LOAD_COMPLETE:  'scene:load:complete',
  SCENE_ENTER_START:    'scene:enter:start',
  SCENE_ENTER_COMPLETE: 'scene:enter:complete',
  SCENE_EXIT_START:     'scene:exit:start',
  SCENE_EXIT_COMPLETE:  'scene:exit:complete',
  SCENE_CHANGE:         'scene:change',

  // ─── Asset Loading ─────────────────────────────────────────────────────
  ASSET_LOAD_START:     'asset:load:start',
  ASSET_LOAD_PROGRESS:  'asset:load:progress',
  ASSET_LOAD_COMPLETE:  'asset:load:complete',
  ASSET_LOAD_ERROR:     'asset:load:error',

  // ─── Audio ─────────────────────────────────────────────────────────────
  AUDIO_PLAY:           'audio:play',
  AUDIO_PAUSE:          'audio:pause',
  AUDIO_STOP:           'audio:stop',
  AUDIO_MUTE:           'audio:mute',
  AUDIO_UNMUTE:         'audio:unmute',
  AUDIO_VOLUME_CHANGE:  'audio:volume:change',
  MUSIC_CROSSFADE:      'music:crossfade',

  // ─── Transitions ───────────────────────────────────────────────────────
  TRANSITION_START:     'transition:start',
  TRANSITION_MIDPOINT:  'transition:midpoint',
  TRANSITION_COMPLETE:  'transition:complete',

  // ─── Camera ────────────────────────────────────────────────────────────
  CAMERA_MOVE_START:    'camera:move:start',
  CAMERA_MOVE_COMPLETE: 'camera:move:complete',
  CAMERA_PRESET_LOAD:   'camera:preset:load',

  // ─── User Interaction & Milestones ────────────────────────────────────────
  USER_AUTHENTICATED:   'user:authenticated',
  CANDLE_BLOWN:         'interaction:candle:blown',
  CAKE_CUT:             'interaction:cake:cut',
  BALLOON_POPPED:       'interaction:balloon:popped',
  GAME_COMPLETE:        'game:complete',
  FEEDBACK_SUBMITTED:   'feedback:submitted',
  
  // ─── Pre-Phase 3 Global Requested Events ────────────────────────────────
  SCENE_STARTED:        'scene:started',
  SCENE_FINISHED:       'scene:finished',
  ANIMATION_COMPLETE:   'animation:complete',
  AUTH_SUCCESS:         'auth:success',
  WORLD_REVEAL:         'world:reveal',
  PRINCESS_ENTRY:       'princess:entry',
  CAKE_COMPLETE:        'cake:complete',
  FINAL_MESSAGE:        'final:message',
};

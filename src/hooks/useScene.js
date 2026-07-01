/**
 * useScene.js
 * Convenience hook wrapping SceneContext for scene navigation.
 */

import { useSceneContext } from '@context/SceneContext';

export function useScene() {
  return useSceneContext();
}

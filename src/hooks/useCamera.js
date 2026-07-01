/**
 * useCamera.js
 * Hook to control cinematic camera movement from any component.
 *
 * @example
 *   const { moveTo, shake } = useCamera();
 *   useEffect(() => { moveTo('CASTLE_WIDE', { duration: 3 }); }, []);
 */

import { useCallback } from 'react';
import cameraManager from '@engine/CameraManager';

export function useCamera() {
  const moveTo = useCallback((presetName, options) => {
    cameraManager.moveTo(presetName, options);
  }, []);

  const moveToPosition = useCallback((position, options) => {
    cameraManager.moveToPosition(position, options);
  }, []);

  const shake = useCallback((intensity, duration) => {
    cameraManager.shake(intensity, duration);
  }, []);

  return {
    moveTo,
    moveToPosition,
    shake,
    currentPreset: cameraManager.currentPreset,
  };
}

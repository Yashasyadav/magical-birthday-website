/**
 * CameraManager.jsx
 * React Three Fiber bridge for the engine CameraManager.
 * Mounts inside ThreeCanvas, registers the R3F camera with the engine,
 * and applies camera position updates each frame.
 */

import { useEffect }   from 'react';
import { useThree }    from '@react-three/fiber';
import cameraEngine    from '@engine/CameraManager';

function CameraManager() {
  const { camera } = useThree();

  useEffect(() => {
    // Register the live R3F camera object with the engine singleton
    cameraEngine.registerCamera(camera);

    return () => {
      // Deregister on unmount (though ThreeCanvas should persist)
      cameraEngine.registerCamera(null);
    };
  }, [camera]);

  // This component renders nothing — it only wires the engine to R3F
  return null;
}

export default CameraManager;

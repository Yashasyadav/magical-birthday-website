/**
 * LightingManager.jsx
 * React Three Fiber bridge for the engine LightingManager.
 * Renders the base lighting rig (ambient + directional + point lights)
 * and registers each light with the engine for animated preset transitions.
 */

import { useRef, useEffect } from 'react';
import lightingEngine        from '@engine/LightingManager';
import { LIGHTING_PRESETS }  from '@engine/LightingManager';

function LightingManager({ initialPreset = 'DARK' }) {
  const ambientRef     = useRef();
  const directionalRef = useRef();
  const point0Ref      = useRef();
  const point1Ref      = useRef();
  const point2Ref      = useRef();

  useEffect(() => {
    // Register all lights with the engine
    if (ambientRef.current)     lightingEngine.registerLight('ambient',     ambientRef.current);
    if (directionalRef.current) lightingEngine.registerLight('directional', directionalRef.current);
    if (point0Ref.current)      lightingEngine.registerLight('point_0',     point0Ref.current);
    if (point1Ref.current)      lightingEngine.registerLight('point_1',     point1Ref.current);
    if (point2Ref.current)      lightingEngine.registerLight('point_2',     point2Ref.current);

    // Apply initial preset without animation
    lightingEngine.transitionTo(initialPreset, 0);

    return () => {
      lightingEngine.unregisterLight('ambient');
      lightingEngine.unregisterLight('directional');
      lightingEngine.unregisterLight('point_0');
      lightingEngine.unregisterLight('point_1');
      lightingEngine.unregisterLight('point_2');
    };
  }, [initialPreset]);

  const preset = LIGHTING_PRESETS[initialPreset] ?? LIGHTING_PRESETS.DARK;

  return (
    <>
      <ambientLight
        ref={ambientRef}
        color={preset.ambient?.color}
        intensity={preset.ambient?.intensity ?? 0.3}
      />

      <directionalLight
        ref={directionalRef}
        color={preset.directional?.color}
        intensity={preset.directional?.intensity ?? 0.5}
        position={[
          preset.directional?.position?.x ?? 5,
          preset.directional?.position?.y ?? 10,
          preset.directional?.position?.z ?? 5,
        ]}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Three point light slots — activated by preset transitions */}
      <pointLight ref={point0Ref} intensity={0} />
      <pointLight ref={point1Ref} intensity={0} />
      <pointLight ref={point2Ref} intensity={0} />
    </>
  );
}

export default LightingManager;

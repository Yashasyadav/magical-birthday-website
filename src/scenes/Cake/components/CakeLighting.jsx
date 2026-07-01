import React from 'react';
import { CAKE_CONFIG } from '../../../config/cake';

/**
 * CakeLighting
 * Premium three-point studio lighting configuration for photorealistic PBR rendering.
 * Warm Key light, Soft Fill, and Cool Rim light with shadow maps.
 */
export function CakeLighting() {
  const { lighting } = CAKE_CONFIG;

  return (
    <>
      {/* Ambient environment base */}
      <ambientLight 
        color={lighting.ambientColor} 
        intensity={lighting.ambientIntensity} 
      />

      {/* Warm Key Light */}
      <directionalLight
        position={[5, 7, 4]}
        color={lighting.keyLightColor}
        intensity={lighting.keyIntensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00005}
        shadow-normalBias={0.02}
      />

      {/* Soft Fill Light */}
      <directionalLight
        position={[-6, 3, 2]}
        color={lighting.fillLightColor}
        intensity={lighting.fillIntensity}
      />

      {/* Cool Rim Light for highlights */}
      <directionalLight
        position={[0, 6, -6]}
        color={lighting.rimLightColor}
        intensity={lighting.rimIntensity}
      />
    </>
  );
}

export default CakeLighting;

export const CAKE_CONFIG = {
  modelPath: '/models/cake.glb',
  knifePath: '/models/knife.glb',
  platePath: '/models/plate.glb',
  tablePath: '/models/table.glb',
  
  // Studio lighting intensities
  lighting: {
    keyLightColor: '#fffbeb',
    keyIntensity: 3.5,
    fillLightColor: '#fdf2f8',
    fillIntensity: 1.5,
    rimLightColor: '#eff6ff',
    rimIntensity: 2.5,
    ambientColor: '#fafaf9',
    ambientIntensity: 0.8,
  },
  
  // Cinematic camera parameters
  camera: {
    fov: 45,
    near: 0.1,
    far: 100,
    initialPos: [0, 3.5, 7.5],
    lookAt: [0, 1.2, 0],
    focusPos: [0, 1.5, 3.5],
    closeUpPos: [0, 2.0, 2.5],
  },
  
  // Interaction and sequence durations (seconds)
  durations: {
    cameraIntro: 2.2,
    wishFade: 0.8,
    blowStagger: 0.45,
    cutSlice: 1.8,
  }
};

export default CAKE_CONFIG;

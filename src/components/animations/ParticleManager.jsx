/**
 * ParticleManager.jsx
 * tsparticles orchestrator component.
 * Renders a named particle preset via useParticles hook.
 *
 * @example
 *   <ParticleManager preset="fairy-dust" />
 *   <ParticleManager preset="night-stars" className="absolute-fill" />
 */

import Particles                    from '@tsparticles/react';
import { useParticles }             from '@hooks/useParticles';
import { getParticleConfig }        from '@utils/particleUtils';

/**
 * @param {{
 *   preset:    string,       // PARTICLE_PRESETS constant
 *   className?: string,
 *   style?:    object,
 * }} props
 */
function ParticleManager({ preset, className = 'absolute-fill', style = {} }) {
  const config                            = getParticleConfig(preset);
  const { particlesId, onInit, onLoaded } = useParticles(config);

  return (
    <Particles
      id={particlesId}
      className={className}
      style={{ position: 'absolute', inset: 0, ...style }}
      options={config}
      init={onInit}
      loaded={onLoaded}
    />
  );
}

export default ParticleManager;

import React from 'react';
import CinematicBackground from '@components/effects/background/CinematicBackground';
import CinematicNebula     from '@components/effects/background/CinematicNebula';
import CinematicStars      from '@components/effects/background/CinematicStars';
import CinematicParticles  from '@components/effects/background/CinematicParticles';

/**
 * Reuses the magical background components established in Phase 1.1.
 * Creates the atmospheric foundation for the royal doors.
 */
function AuthenticationBackground() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <CinematicBackground />
      <CinematicNebula />
      <CinematicStars />
      <CinematicParticles />
    </div>
  );
}

export default AuthenticationBackground;

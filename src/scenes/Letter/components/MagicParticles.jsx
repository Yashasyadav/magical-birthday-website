import React, { useMemo } from 'react';
import Particles from '@tsparticles/react';

function buildOptions(variant) {
  const isBurst = variant === 'dissolve' || variant === 'seal-crack';
  const isAiry = variant === 'ambient' || variant === 'flight';

  return {
    fullScreen: { enable: false },
    detectRetina: true,
    fpsLimit: 60,
    particles: {
      number: { value: isBurst ? 70 : 42, density: { enable: true, area: 900 } },
      color: { value: isBurst ? ['#fbbf24', '#f472b6', '#e9d5ff', '#fff7d6'] : ['#fbbf24', '#fde68a', '#ffffff'] },
      shape: { type: ['circle', 'star'] },
      opacity: {
        value: { min: 0.08, max: isBurst ? 0.85 : 0.55 },
        animation: { enable: true, speed: isBurst ? 1.8 : 1.1, minimumValue: 0.05, sync: false },
      },
      size: {
        value: { min: isBurst ? 1 : 1.5, max: isBurst ? 4 : 3 },
        animation: { enable: true, speed: 2, minimumValue: 0.5, sync: false },
      },
      move: {
        enable: true,
        speed: isBurst ? { min: 0.8, max: 2.4 } : { min: 0.25, max: 0.9 },
        direction: isBurst ? 'none' : 'top',
        random: true,
        straight: false,
        outModes: { default: 'out' },
        attract: { enable: isAiry, rotate: { x: 800, y: 1200 } },
      },
      twinkle: {
        particles: {
          enable: true,
          frequency: 0.18,
          opacity: 1,
        },
      },
      links: { enable: false },
    },
    interactivity: { detectsOn: 'window', events: { resize: true } },
  };
}

export function MagicParticles({ phase, variant = 'ambient' }) {
  const isVisible = ['memory-bloom', 'butterfly-forming', 'butterfly-flight', 'seal-pulse', 'seal-crack', 'letter-opening', 'writing', 'finished'].includes(phase);
  const options = useMemo(() => buildOptions(variant), [variant]);

  if (!isVisible) return null;

  return (
    <div className={`absolute inset-0 z-10 pointer-events-none mix-blend-screen transition-opacity duration-1000 ${isVisible ? 'opacity-80' : 'opacity-0'}`}>
      <Particles id={`magic-particles-${variant}`} options={options} className="w-full h-full" />
    </div>
  );
}

export default MagicParticles;
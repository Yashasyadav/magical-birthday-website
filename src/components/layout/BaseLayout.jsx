/**
 * BaseLayout.jsx
 * Root layout shell — renders once, wraps every scene.
 * Responsibilities:
 *   - Applies global background and font
 *   - Mounts SceneTransition overlay (always present in DOM)
 *   - Mounts AssetLoader progress overlay
 *   - Renders children (the active scene)
 */

import SceneTransition from '@components/transitions/SceneTransition';
import AssetLoader     from '@components/loading/AssetLoader';
import { useTransitionContext } from '@context/TransitionContext';

function BaseLayout({ children }) {
  const { isTransitioning, prefersReducedMotion } = useTransitionContext();

  const containerStyle = {
    transition: prefersReducedMotion
      ? 'opacity 0.1s ease'
      : 'opacity 0.4s ease, filter 0.4s ease',
    opacity: isTransitioning ? 0 : 1,
    filter: (isTransitioning && !prefersReducedMotion) ? 'blur(8px)' : 'none',
  };

  return (
    <div
      id="base-layout"
      className="relative w-full min-h-screen overflow-hidden bg-night-900 font-body"
    >
      {/* Active scene content */}
      <div id="active-scene-container" className="w-full h-full" style={containerStyle}>
        {children}
      </div>

      {/* Transition overlay — always mounted, controlled by TransitionManager */}
      <SceneTransition />

      {/* Asset preloader progress — shows during scene preloads */}
      <AssetLoader />
    </div>
  );
}

export default BaseLayout;

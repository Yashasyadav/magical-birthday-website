/**
 * SceneWrapper.jsx
 * Per-scene mount wrapper.
 * Every scene is wrapped in this component which:
 *   - Provides a consistent `scene` CSS class (fixed, full-viewport)
 *   - Wraps with ErrorBoundary for isolated failure handling
 *   - Accepts an optional `data-scene` attribute for debugging
 *
 * @example
 *   <SceneWrapper sceneName="castle">
 *     <CastleScene />
 *   </SceneWrapper>
 */

import ErrorBoundary from '@components/common/ErrorBoundary';

/**
 * @param {{ sceneName: string, children: React.ReactNode, className?: string }} props
 */
function SceneWrapper({ sceneName, children, className = '' }) {
  return (
    <ErrorBoundary>
      <section
        className={`scene ${className}`}
        data-scene={sceneName}
        aria-label={`${sceneName} scene`}
      >
        {children}
      </section>
    </ErrorBoundary>
  );
}

export default SceneWrapper;

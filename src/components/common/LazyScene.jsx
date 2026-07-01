/**
 * LazyScene.jsx
 * Wraps React.lazy() scenes in Suspense with a minimal non-blocking fallback.
 * Actual loading progress is handled by AssetLoader.jsx — this just prevents
 * Suspense from unmounting the whole tree during code splitting.
 */

import { Suspense } from 'react';

/** Transparent full-screen div — invisible while scene chunk loads */
function SceneLoadingFallback() {
  return (
    <div
      aria-hidden="true"
      style={{
        position:   'fixed',
        inset:      0,
        background: '#0d0a1e',
        zIndex:     9,
      }}
    />
  );
}

/**
 * @param {{ children: React.ReactNode }} props
 */
export function LazyScene({ children }) {
  return (
    <Suspense fallback={<SceneLoadingFallback />}>
      {children}
    </Suspense>
  );
}

export default LazyScene;

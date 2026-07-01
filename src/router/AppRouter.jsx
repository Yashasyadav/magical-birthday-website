/**
 * AppRouter.jsx
 * Lazy-loaded scene routes.
 * ─────────────────────────────────────────────────────────────────────────────
 * Each scene is code-split via React.lazy().
 * Adding a new scene = import it here + add one <Route>.
 * Never remove existing routes — only add new ones.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { lazy }                     from 'react';
import { Routes, Route, Navigate }  from 'react-router-dom';
import { LazyScene }                from '@components/common/LazyScene';
import { ROUTES }                   from '@config/routes';
import { RouterSync }               from './RouterSync';

// ─── Lazy Scene Imports ───────────────────────────────────────────────────────
// Each scene is its own chunk — only downloaded when needed.
const LoadingScene        = lazy(() => import('@scenes/Loading'));
const AuthenticationScene = lazy(() => import('@scenes/Authentication'));
const WelcomeScene        = lazy(() => import('@scenes/Welcome'));
const NightSkyScene       = lazy(() => import('@scenes/NightSky'));
const CastleScene         = lazy(() => import('@scenes/Castle'));
const PrincessScene       = lazy(() => import('@scenes/PrincessEntrance'));
const BalloonsScene       = lazy(() => import('@scenes/Balloons'));
const CakeScene           = lazy(() => import('@scenes/Cake'));
const MemoryCameraScene   = lazy(() => import('@scenes/MemoryCamera'));
const GalleryScene        = lazy(() => import('@scenes/Gallery'));
const LetterScene         = lazy(() => import('@scenes/Letter'));
const GamesScene          = lazy(() => import('@scenes/Games'));
const CertificateScene    = lazy(() => import('@scenes/Certificate'));
const FeedbackScene       = lazy(() => import('@scenes/Feedback'));
const FinaleScene         = lazy(() => import('@scenes/Finale'));

function ProtectedRoute({ children }) {
  const isAuthenticated = sessionStorage.getItem('birthday_authenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTHENTICATION} replace />;
  }
  return children;
}

function AppRouter() {
  return (
    <LazyScene>
      <RouterSync />
      <Routes>
        {/* ── Main Experience Flow ─────────────────────────────────────── */}
        <Route path={ROUTES.LOADING}        element={<LoadingScene />}        />
        <Route path={ROUTES.AUTHENTICATION} element={<AuthenticationScene />} />
        <Route path={ROUTES.WELCOME}        element={<ProtectedRoute><WelcomeScene /></ProtectedRoute>}        />
        <Route path={ROUTES.NIGHT_SKY}      element={<ProtectedRoute><NightSkyScene /></ProtectedRoute>}       />
        <Route path={ROUTES.CASTLE}         element={<ProtectedRoute><CastleScene /></ProtectedRoute>}         />
        <Route path={ROUTES.PRINCESS}       element={<ProtectedRoute><PrincessScene /></ProtectedRoute>}       />
        <Route path={ROUTES.BALLOONS}       element={<ProtectedRoute><BalloonsScene /></ProtectedRoute>}       />
        <Route path={ROUTES.CAKE}           element={<ProtectedRoute><CakeScene /></ProtectedRoute>}           />
        <Route path={ROUTES.MEMORY_CAMERA}  element={<ProtectedRoute><MemoryCameraScene /></ProtectedRoute>}   />
        <Route path={ROUTES.GALLERY}        element={<ProtectedRoute><GalleryScene /></ProtectedRoute>}        />
        <Route path={ROUTES.LETTER}         element={<ProtectedRoute><LetterScene /></ProtectedRoute>}         />
        <Route path={ROUTES.GAMES}          element={<ProtectedRoute><GamesScene /></ProtectedRoute>}          />
        <Route path={ROUTES.CERTIFICATE}    element={<ProtectedRoute><CertificateScene /></ProtectedRoute>}    />
        <Route path={ROUTES.FEEDBACK}       element={<ProtectedRoute><FeedbackScene /></ProtectedRoute>}       />
        <Route path={ROUTES.FINALE}         element={<ProtectedRoute><FinaleScene /></ProtectedRoute>}         />

        {/* ── Fallback: redirect unknown paths to Loading ───────────── */}
        <Route path="*" element={<Navigate to={ROUTES.LOADING} replace />} />
      </Routes>
    </LazyScene>
  );
}

export default AppRouter;

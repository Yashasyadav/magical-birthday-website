/**
 * App.jsx
 * Root application component.
 * Assembles all providers, the base layout, and the router.
 * The provider order matters — inner providers can consume outer ones.
 */

import { BrowserRouter } from 'react-router-dom';

import { AppProvider }   from '@context/AppContext';
import { SceneProvider } from '@context/SceneContext';
import { AudioProvider } from '@context/AudioContext';
import { AssetProvider } from '@context/AssetContext';
import { TransitionProvider } from '@context/TransitionContext';

import BaseLayout        from '@components/layout/BaseLayout';
import AppRouter         from '@router/AppRouter';
import '@engine/TransitionManager';

function App() {
  return (
    // BrowserRouter wraps everything for history API routing
    <BrowserRouter>
      {/* AppProvider: user auth + global flags */}
      <AppProvider>
        {/* AssetProvider: preload progress tracking */}
        <AssetProvider>
          {/* AudioProvider: music + sfx state */}
          <AudioProvider>
            {/* SceneProvider: current scene + transition state */}
            <SceneProvider>
              {/* TransitionProvider: manages cinematic page transitions */}
              <TransitionProvider>
                {/* BaseLayout: root shell with transition + loader overlays */}
                <BaseLayout>
                  {/* AppRouter: lazy scene routes */}
                  <AppRouter />
                </BaseLayout>
              </TransitionProvider>
            </SceneProvider>
          </AudioProvider>
        </AssetProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;

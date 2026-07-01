/**
 * SceneContext.jsx
 * Exposes SceneManager state to the React tree as reactive values.
 * Components subscribe to scene changes via useScene() hook.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import sceneManager, { SCENE_STATE } from '@engine/SceneManager';
import { EVENTS }                    from '@constants/events';

const SceneContext = createContext(null);

export function SceneProvider({ children }) {
  const [currentScene,    setCurrentScene]    = useState(sceneManager.currentScene);
  const [sceneState,      setSceneState]      = useState(sceneManager.state);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Mirror engine state machine into React state
    const unsubChange = sceneManager.on(EVENTS.SCENE_CHANGE, ({ to }) => {
      setIsTransitioning(true);
    });

    const unsubEnter = sceneManager.on(EVENTS.SCENE_ENTER_COMPLETE, ({ scene }) => {
      setCurrentScene(scene);
      setIsTransitioning(false);
    });

    const unsubState = sceneManager.on('stateChange', ({ state }) => {
      setSceneState(state);
    });

    return () => {
      unsubChange();
      unsubEnter();
      unsubState();
    };
  }, []);

  const value = {
    currentScene,
    sceneState,
    isTransitioning,
    isActive: sceneState === SCENE_STATE.ACTIVE,
    // Engine delegates
    navigateTo:  (...args) => sceneManager.navigateTo(...args),
    goNext:      ()        => sceneManager.goNext(),
    goPrevious:  ()        => sceneManager.goPrevious(),
    history:     sceneManager.history,
  };

  return (
    <SceneContext.Provider value={value}>
      {children}
    </SceneContext.Provider>
  );
}

export function useSceneContext() {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error('useSceneContext must be used within <SceneProvider>');
  return ctx;
}

export default SceneContext;

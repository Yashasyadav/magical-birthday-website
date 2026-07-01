import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSceneContext } from '@context/SceneContext';
import { SCENES } from '@constants/scenes';
import { ROUTES } from '@config/routes';
import sceneManager from '@engine/SceneManager';

// Map scene IDs to route paths automatically using their matching keys
const sceneToRoute = Object.keys(SCENES).reduce((acc, key) => {
  acc[SCENES[key]] = ROUTES[key];
  return acc;
}, {});

// Reverse map: route path to scene ID
const routeToScene = Object.keys(SCENES).reduce((acc, key) => {
  acc[ROUTES[key]] = SCENES[key];
  return acc;
}, {});

// Synchronize initial SceneManager currentScene with browser's URL path on boot
const initialPath = window.location.pathname;
const matchedScene = routeToScene[initialPath];
if (matchedScene && sceneManager._currentScene !== matchedScene) {
  sceneManager._currentScene = matchedScene;
  sceneManager._history = [matchedScene];
}

/**
 * Synchronizes the internal SceneManager engine state with react-router URL.
 */
export function RouterSync() {
  const { currentScene } = useSceneContext();
  const navigate = useNavigate();

  useEffect(() => {
    const targetRoute = sceneToRoute[currentScene];
    if (targetRoute) {
      // Use replace to prevent stacking endless history during transitions
      navigate(targetRoute, { replace: true });
    }
  }, [currentScene, navigate]);

  return null;
}

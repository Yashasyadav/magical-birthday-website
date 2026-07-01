import React, { createContext, useContext, useEffect, useState } from 'react';
import { worldRevealEngine } from '../engine/WorldRevealEngine';

const WorldRevealContext = createContext();

export function WorldRevealProvider({ children }) {
  const [state, setState] = useState(worldRevealEngine.getState());

  useEffect(() => {
    return worldRevealEngine.subscribe(setState);
  }, []);

  return (
    <WorldRevealContext.Provider value={state}>
      {children}
    </WorldRevealContext.Provider>
  );
}

export function useWorldReveal() {
  const context = useContext(WorldRevealContext);
  if (context === undefined) {
    throw new Error('useWorldReveal must be used within a WorldRevealProvider');
  }
  return context;
}

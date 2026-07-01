import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadingEngine } from '../engine/LoadingEngine';

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [state, setState] = useState(loadingEngine.getState());

  useEffect(() => {
    const unsubscribe = loadingEngine.subscribe(setState);
    loadingEngine.start();
    return () => unsubscribe();
  }, []);

  return (
    <LoadingContext.Provider value={state}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoadingContext() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoadingContext must be used within a LoadingProvider');
  }
  return context;
}

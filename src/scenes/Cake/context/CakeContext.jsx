import React, { createContext, useContext, useEffect, useState } from 'react';
import { cakeEngine } from '../engine/CakeEngine';

const CakeContext = createContext();

export function CakeProvider({ children }) {
  const [state, setState] = useState(cakeEngine.getState());

  useEffect(() => {
    return cakeEngine.subscribe(setState);
  }, []);

  return (
    <CakeContext.Provider value={state}>
      {children}
    </CakeContext.Provider>
  );
}

export function useCake() {
  const ctx = useContext(CakeContext);
  if (!ctx) throw new Error('useCake must be used within CakeProvider');
  return ctx;
}

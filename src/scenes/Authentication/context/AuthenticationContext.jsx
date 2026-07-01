import React, { createContext, useContext, useEffect, useState } from 'react';
import { authenticationEngine } from '../engine/AuthenticationEngine';

const AuthenticationContext = createContext(null);

export function AuthenticationProvider({ children }) {
  const [state, setState] = useState(authenticationEngine.getState());

  useEffect(() => {
    const unsubscribe = authenticationEngine.subscribe(setState);
    // Initial state is IDLE, index.jsx will trigger DIALOGUE via Master Timeline
    return () => unsubscribe();
  }, []);

  // Expose the engine validation method
  const submitAnswer = (answer) => {
    authenticationEngine.validate(answer);
  };

  return (
    <AuthenticationContext.Provider value={{ state, submitAnswer }}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthenticationContext() {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error('useAuthenticationContext must be used within an AuthenticationProvider');
  }
  return context;
}

/**
 * AppContext.jsx
 * Global application state — wraps the entire tree.
 * Holds top-level app state: authenticated user and global UI flags.
 * Scene, Audio, and Asset state live in their own dedicated contexts.
 */

import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user,      setUser]      = useState(null);   // Set after authentication
  const [isReady,   setIsReady]   = useState(false);  // True after initial load
  const [isMobile,  setIsMobile]  = useState(() => window.innerWidth < 768);

  const authenticate = useCallback((userData) => {
    setUser(userData);
  }, []);

  const markReady = useCallback(() => {
    setIsReady(true);
  }, []);

  const value = {
    user,
    isReady,
    isMobile,
    authenticate,
    markReady,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

/** @returns {ReturnType<typeof AppProvider>['props']['value']} */
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within <AppProvider>');
  return ctx;
}

export default AppContext;

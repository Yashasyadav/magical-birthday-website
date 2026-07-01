import React, { createContext, useState, useMemo } from 'react';

export const LetterContext = createContext(null);

export function LetterProvider({ children }) {
  // Complete State Machine:
  // idle -> scene-fade -> golden-light -> envelope-descending -> envelope-hovering -> envelope-landing ->
  // idle-envelope -> seal-hover -> seal-click -> seal-separate -> flap-open-top -> flap-open-left ->
  // flap-open-right -> letter-glow -> balloon-launch -> camera-follow -> camera-return -> letter-rise ->
  // letter-unfold-stage1 -> letter-unfold-stage2 -> letter-unfold-stage3 -> paper-settle -> pen-arrives ->
  // writing -> finished
  const [phase, setPhase] = useState('idle');

  const contextValue = useMemo(() => ({
    phase,
    setPhase,
  }), [phase]);

  return (
    <LetterContext.Provider value={contextValue}>
      {children}
    </LetterContext.Provider>
  );
}

export default LetterContext;

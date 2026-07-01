import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MEMORIES } from '../../../config/memories';

export const MemoryContext = createContext(null);

export function MemoryProvider({ children }) {
  const [activePhotoId, setActivePhotoId] = useState(null);
  const [flippedPhotos, setFlippedPhotos] = useState({}); // { [id]: boolean }
  const [visitedPhotos, setVisitedPhotos] = useState(new Set());
  const [isClosing, setIsClosing] = useState(false);
  const [flyState, setFlyState] = useState(() => {
    const skip = sessionStorage.getItem('skip_gallery_entrance') === 'true';
    if (skip) {
      sessionStorage.removeItem('skip_gallery_entrance');
      return 'active';
    }
    return 'idle';
  }); // idle -> enter -> exit -> complete
  
  const totalPages = MEMORIES.length;

  const selectPhoto = useCallback((id) => {
    setActivePhotoId(id);
    if (id !== null) {
      setVisitedPhotos(prev => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    }
  }, []);

  const flipPhoto = useCallback((id) => {
    setFlippedPhotos(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  const closePhoto = useCallback(() => {
    setActivePhotoId(null);
  }, []);

  const viewedAll = visitedPhotos.size >= totalPages;

  return (
    <MemoryContext.Provider
      value={{
        activePhotoId,
        setActivePhotoId,
        selectPhoto,
        closePhoto,
        flippedPhotos,
        flipPhoto,
        visitedPhotos,
        viewedAll,
        totalPages,
        isClosing,
        setIsClosing,
        flyState,
        setFlyState,
        memories: MEMORIES
      }}
    >
      {children}
    </MemoryContext.Provider>
  );
}

export function useMemory() {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error('useMemory must be used within a MemoryProvider');
  }
  return context;
}

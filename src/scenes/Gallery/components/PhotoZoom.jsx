import React, { useEffect } from 'react';
import useMemory from '../hooks/useMemory';

/**
 * PhotoZoom
 * Renders the dark modal backdrop overlay behind a selected memory photo.
 * Closes the zoom view on ESC key press or when clicking outside.
 */
export function PhotoZoom({ children }) {
  const { activePhotoId, closePhoto } = useMemory();

  // Bind Escape Key Listener and Document Click Listener
  useEffect(() => {
    if (activePhotoId === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closePhoto();
      }
    };

    const handleDocumentClick = (e) => {
      // Since clicks inside the active PhotoFrame call e.stopPropagation(),
      // any click that reaches the document level is outside the active photo.
      closePhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Add click listener with a tiny timeout to avoid capturing the current event loop's click
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleDocumentClick);
    }, 0);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [activePhotoId, closePhoto]);

  if (activePhotoId === null) return null;

  return (
    <div 
      className="absolute w-[300vw] h-[300vh] bg-black/85 backdrop-blur-md z-[40] flex items-center justify-center transition-opacity duration-300 pointer-events-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      {/* Visual close prompt text positioned exactly 24px from the top of the viewport */}
      <span className="absolute top-[calc(100vh+24px)] left-1/2 -translate-x-1/2 font-sans text-white/30 text-[10px] tracking-widest uppercase pointer-events-none z-50">
        Click anywhere or press ESC to close
      </span>
      {children}
    </div>
  );
}

export default PhotoZoom;

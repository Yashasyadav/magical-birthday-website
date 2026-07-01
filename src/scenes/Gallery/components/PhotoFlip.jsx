import React from 'react';

/**
 * PhotoFlip
 * Helper styling class config providing standard perspective settings for 3D flip.
 */
export function PhotoFlip({ children }) {
  return (
    <div 
      className="w-full h-full relative"
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
}

export default PhotoFlip;

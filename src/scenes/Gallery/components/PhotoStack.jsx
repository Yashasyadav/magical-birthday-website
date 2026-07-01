import React from 'react';
import useMemory from '../hooks/useMemory';
import PhotoFrame from './PhotoFrame';

/**
 * PhotoStack
 * Groups and renders the array of photograph frames.
 * Attaches index-based refs so that MemoryEngine can animate them individually.
 */
export function PhotoStack({ photoRefs, clipRefs }) {
  const { memories } = useMemory();

  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none">
      {memories.map((m, idx) => (
        <PhotoFrame
          key={m.id}
          memory={m}
          index={idx}
          innerRef={(el) => (photoRefs.current[idx] = el)}
          clipRef={(el) => (clipRefs.current[idx] = el)}
        />
      ))}
    </div>
  );
}

export default PhotoStack;

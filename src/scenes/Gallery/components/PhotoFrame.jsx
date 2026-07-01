import React from 'react';
import useMemory from '../hooks/useMemory';
import MemoryPhoto from './MemoryPhoto';
import PhotoBack from './PhotoBack';

/**
 * PhotoFrame
 * Renders a handcrafted floating Polaroid memory frame.
 * Connects to the context select/zoom triggers and supports realistic 3D flipping.
 */
export function PhotoFrame({ memory, index, innerRef, clipRef }) {
  const { selectPhoto, activePhotoId, flippedPhotos, flipPhoto } = useMemory();

  const isSelected = activePhotoId === memory.id;
  const isFlipped = !!flippedPhotos[memory.id];

  const handleFrameClick = (e) => {
    e.stopPropagation();
    if (!isSelected) {
      selectPhoto(memory.id);
    }
  };

  const handleFlipClick = (e) => {
    e.stopPropagation();
    flipPhoto(memory.id);
  };

  return (
    <div
      ref={innerRef}
      onClick={handleFrameClick}
      className={`absolute transition-all duration-300 pointer-events-auto ${
        isSelected ? 'z-50 cursor-default' : 'z-10 hover:scale-105 active:scale-95 cursor-pointer hover:z-25'
      }`}
      style={{
        left: `${memory.position.x}%`,
        top: `${memory.position.y}%`,
        width: isSelected ? '320px' : '170px',
        height: isSelected ? '400px' : '212px',
        transform: isSelected 
          ? 'translate(-50%, -50%) rotate(0deg)' 
          : `translate(-50%, -50%) rotate(${memory.rotation}deg)`,
        transformStyle: 'preserve-3d',
        perspective: '1200px',
        // Dynamic centering during zoom
        ...(isSelected && {
          position: 'fixed',
          left: '50%',
          top: '48%',
        })
      }}
    >
      {/* 1. MAGICAL GOLDEN CLIP */}
      <div 
        ref={clipRef}
        className="absolute top-[-16px] left-1/2 -translate-x-1/2 w-7 h-5 bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-600 rounded-xs shadow-[0_2px_6px_rgba(0,0,0,0.3)] z-40 border border-yellow-300/40 flex items-center justify-center"
        style={{
          transform: isSelected ? 'scale(0)' : 'scale(1)',
          transition: 'transform 0.4s ease',
        }}
      >
        {/* Clip hinge detail */}
        <div className="w-1.5 h-1.5 rounded-full bg-amber-950" />
      </div>

      {/* 2. 3D FLIPPABLE CONTAINER CARD */}
      <div 
        className="w-full h-full relative transition-transform duration-[0.8s] ease-in-out shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          borderRadius: '4px',
        }}
      >
        {/* FRONT SIDE (Polaroid Photograph) */}
        <div 
          className="absolute inset-0 w-full h-full rounded-sm"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <MemoryPhoto 
            id={memory.id}
            title={memory.title}
            date={memory.date}
            location={memory.location}
            image={memory.image}
            emoji={memory.emoji}
          />
        </div>

        {/* BACK SIDE (Handwritten aged paper message) */}
        <div 
          className="absolute inset-0 w-full h-full rounded-sm"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <PhotoBack 
            id={memory.id}
            placeholderMessage={memory.placeholderMessage}
            location={memory.location}
          />
        </div>
      </div>

      {/* 3. FLIP INTERACTION OVERLAY BUTTON (Only visible when zoomed) */}
      {isSelected && (
        <button
          onClick={handleFlipClick}
          className="absolute bottom-[-55px] left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-teal-950 text-xs font-bold font-sans tracking-widest rounded-full shadow-lg border border-yellow-300/40 pointer-events-auto transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          ✨ Flip Photo ✨
        </button>
      )}
    </div>
  );
}

export default PhotoFrame;

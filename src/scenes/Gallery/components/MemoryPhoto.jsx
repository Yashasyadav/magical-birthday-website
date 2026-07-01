import React from 'react';

/**
 * MemoryPhoto
 * Renders the front side of a polaroid memory photograph, complete with
 * white margins, hand-written location descriptions, and titles.
 */
export function MemoryPhoto({ title, date, location, image, id, emoji }) {
  // Safe zero-padded photo index
  const photoIndex = String(id).padStart(2, '0');

  // Fallback layout if no image is loaded
  const fallback = (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-amber-50 to-orange-100/50 p-4 border border-amber-900/10">
      <span className="text-3xl mb-1.5 animate-pulse">{emoji || '📸'}</span>
      <span className="text-[9px] font-sans font-bold text-amber-950/60 uppercase tracking-widest">
        Moments Saved
      </span>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#fbfbf9] p-3 shadow-inner">
      {/* Photo viewport */}
      <div className="relative w-full aspect-[4/3] bg-neutral-100 rounded-xs overflow-hidden border border-neutral-900/10">
        {image ? (
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-contain"
          />
        ) : (
          fallback
        )}
        {/* Soft vignette overlay */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]" />
      </div>

      {/* Polaroid bottom border text space */}
      <div className="flex flex-col items-center pt-2 select-none">
        <div className="flex items-center justify-center w-full text-[10px] font-script text-amber-900/60">
          <span>Memory #{photoIndex}</span>
        </div>
        <h4 
          className="text-sm font-bold text-amber-950/90 text-center tracking-wide mt-1"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          {title}
        </h4>
        {location && (
          <span className="text-[9px] font-script text-amber-900/40 italic mt-0.5">
            📍 {location}
          </span>
        )}
      </div>
    </div>
  );
}

export default MemoryPhoto;

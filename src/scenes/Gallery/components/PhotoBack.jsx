import React from 'react';

/**
 * PhotoBack
 * Renders the realistic paper backside of a polaroid photograph.
 * Formatted with cream aged paper textures, handwritten messages, and sticker decorations.
 */
export function PhotoBack({ id, placeholderMessage, location }) {
  const photoIndex = String(id).padStart(2, '0');

  return (
    <div 
      className="w-full h-full flex flex-col justify-between p-5 rounded-sm relative border-l border-amber-900/5"
      style={{
        background: 'linear-gradient(135deg, #fbf8f0 0%, #f7f3e8 100%)', // Cream aged paper
        boxShadow: 'inset 0 0 15px rgba(212, 163, 115, 0.1)',
      }}
    >
      {/* Paper texture overlay (subtle paper fibers/grain) */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(black 1px, transparent 0), radial-gradient(black 1px, transparent 0)',
          backgroundSize: '4px 4px',
          backgroundPosition: '0 0, 2px 2px',
        }}
      />

      {/* Decorative Stamp or Sticker */}
      <div className="absolute top-3 right-3 w-8 h-8 rounded-full border border-dashed border-amber-950/20 flex items-center justify-center text-[10px] text-amber-950/30 font-serif rotate-12">
        ⚜️
      </div>

      {/* Top Header */}
      <div className="text-[10px] font-sans text-amber-900/40 uppercase tracking-widest border-b border-amber-900/10 pb-1 w-2/3">
        Postcard #{photoIndex}
      </div>

      {/* Handwritten Message */}
      <div className="my-auto py-2">
        <p 
          className="font-script text-base text-amber-950/90 leading-relaxed italic text-center"
          style={{ textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}
        >
          &ldquo;{placeholderMessage}&rdquo;
        </p>
      </div>

      {/* Bottom details */}
      <div className="flex items-center justify-between border-t border-amber-900/10 pt-2 text-[9px] text-amber-900/40 font-script">
        <span>Keep safely, forever.</span>
        {location && <span>📍 {location}</span>}
      </div>
    </div>
  );
}

export default PhotoBack;

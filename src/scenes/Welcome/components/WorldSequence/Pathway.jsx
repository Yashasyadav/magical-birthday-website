import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import Lamp from './Lamp';

/**
 * A highly polished pathway leading to the Castle.
 * Uses SVG texture mapping for realistic stone tile grids.
 */
const Pathway = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const leftLampsRef = useRef([]);
  const rightLampsRef = useRef([]);

  useImperativeHandle(ref, () => ({
    getContainer: () => containerRef.current,
    getPath: () => pathRef.current,
    getLeftLamps: () => leftLampsRef.current.map(l => l?.getLight()),
    getRightLamps: () => rightLampsRef.current.map(l => l?.getLight())
  }));

  // Perspective parameters for lamps (closer = larger, lower on screen)
  const lampPositions = [
    { leftY: 45, rightY: 45, leftX: 45, rightX: 55, scale: 0.35 },
    { leftY: 35, rightY: 35, leftX: 40, rightX: 60, scale: 0.5 },
    { leftY: 25, rightY: 25, leftX: 34, rightX: 66, scale: 0.65 },
    { leftY: 15, rightY: 15, leftX: 28, rightX: 72, scale: 0.85 },
    { leftY: 5,  rightY: 5,  leftX: 18, rightX: 82, scale: 1.15 },
    { leftY: -5, rightY: -5, leftX: 5,  rightX: 95, scale: 1.55 },
  ];

  return (
    <div 
      ref={containerRef} 
      className="absolute bottom-0 left-0 w-full h-[45vh] pointer-events-none opacity-0"
      style={{ zIndex: 10 }}
    >
      {/* 
        Stone Pathway drawn in SVG to allow repeating brick textures 
        that align perfectly with the perspective trapezoid.
      */}
      <svg 
        ref={pathRef}
        className="absolute inset-0 w-full h-full drop-shadow-[0_-5px_15px_rgba(0,0,0,0.5)]" 
        viewBox="0 0 1000 400" 
        preserveAspectRatio="none"
      >
        <defs>
          {/* Stone Cobble Pattern */}
          <pattern id="cobblePattern" width="40" height="25" patternUnits="userSpaceOnUse" patternTransform="rotate(-15)">
            <path d="M 0 0 L 40 0 L 40 25 L 0 25 Z" fill="none" stroke="#14102e" strokeWidth="1" />
            <path d="M 0 12.5 L 40 12.5 M 20 0 L 20 12.5 M 10 12.5 L 10 25 M 30 12.5 L 30 25" fill="none" stroke="#251e52" strokeWidth="0.8" />
          </pattern>
          
          <linearGradient id="pathFade" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#14102e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Textured Pathway Base Trapezoid */}
        <polygon 
          points="500,180 500,180 0,400 1000,400" 
          fill="url(#cobblePattern)" 
          opacity="0.65"
        />
        <polygon 
          points="500,180 500,180 0,400 1000,400" 
          fill="url(#pathFade)" 
        />
      </svg>

      {/* Lamps */}
      {lampPositions.map((pos, i) => (
        <React.Fragment key={i}>
          <Lamp 
            ref={el => leftLampsRef.current[i] = el}
            left={pos.leftX}
            bottom={pos.leftY}
            scale={pos.scale}
          />
          <Lamp 
            ref={el => rightLampsRef.current[i] = el}
            left={pos.rightX}
            bottom={pos.rightY}
            scale={pos.scale}
          />
        </React.Fragment>
      ))}
    </div>
  );
});

export default Pathway;

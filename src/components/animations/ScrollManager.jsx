/**
 * ScrollManager.jsx
 * Scroll-driven animation manager using GSAP ScrollTrigger.
 * Wraps content that should animate as the user scrolls.
 * Primarily used in Gallery and Letter scenes.
 *
 * @example
 *   <ScrollManager pinned>
 *     <GalleryTrack />
 *   </ScrollManager>
 */

import { useRef, useLayoutEffect } from 'react';
import { useGSAP }                 from '@gsap/react';
import gsap                        from 'gsap';
import { ScrollTrigger }           from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * @param {{
 *   children:  React.ReactNode,
 *   pinned?:   boolean,   // Pin container during scroll animation
 *   scrub?:    boolean | number,
 *   start?:    string,    // ScrollTrigger start value
 *   end?:      string,    // ScrollTrigger end value
 *   onEnter?:  Function,
 *   onLeave?:  Function,
 *   className?: string,
 * }} props
 */
function ScrollManager({
  children,
  pinned   = false,
  scrub    = 1,
  start    = 'top top',
  end      = '+=100%',
  onEnter,
  onLeave,
  className = '',
}) {
  const containerRef = useRef();

  useGSAP(() => {
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start,
      end,
      pin:       pinned,
      scrub,
      onEnter,
      onLeave,
    });

    return () => trigger.kill();
  }, { scope: containerRef, dependencies: [pinned, scrub, start, end] });

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

export default ScrollManager;

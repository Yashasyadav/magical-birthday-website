/**
 * TimelineManager.jsx
 * GSAP ReactContext provider — gives all child components access to
 * a shared GSAP context scope for coordinated timeline cleanup.
 */

import { useRef, useLayoutEffect }  from 'react';
import { useGSAP }                  from '@gsap/react';
import gsap                         from 'gsap';

/**
 * @param {{
 *   children:  React.ReactNode,
 *   id?:       string,
 *   onReady?:  (context: gsap.Context) => void,
 * }} props
 */
function TimelineManager({ children, id = 'timeline-root', onReady }) {
  const containerRef = useRef();

  useGSAP(() => {
    const ctx = gsap.context(() => {}, containerRef);
    onReady?.(ctx);
    return () => ctx.revert();
  }, { scope: containerRef, dependencies: [] });

  return (
    <div ref={containerRef} id={id} style={{ display: 'contents' }}>
      {children}
    </div>
  );
}

export default TimelineManager;

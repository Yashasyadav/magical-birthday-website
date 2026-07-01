/**
 * TransitionManager.jsx
 * React component orchestrator for in-scene element transitions.
 * NOT the scene-level transition (that's SceneTransition.jsx).
 * This handles element-level entrance/exit animations within a scene.
 *
 * @example
 *   <TransitionManager>
 *     <motion.div variants={FADE_UP_VARIANTS}>...</motion.div>
 *   </TransitionManager>
 */

import { motion } from 'framer-motion';

/** Reusable Framer Motion variant presets for scene elements */
export const ELEMENT_VARIANTS = {
  FADE_UP: {
    hidden:  { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
    exit:    { opacity: 0, y: -40, transition: { duration: 0.5 } },
  },
  FADE_IN: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
    exit:    { opacity: 0, transition: { duration: 0.4 } },
  },
  SCALE_IN: {
    hidden:  { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] } },
    exit:    { opacity: 0, scale: 0.9, transition: { duration: 0.4 } },
  },
  DISNEY_BOUNCE: {
    hidden:  { opacity: 0, scale: 0, rotate: -10 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] } },
    exit:    { opacity: 0, scale: 0.5, transition: { duration: 0.4 } },
  },
};

/** Stagger container variant — animates children in sequence */
export const STAGGER_CONTAINER = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

/**
 * Wraps children in a motion.div stagger container.
 * @param {{ children: React.ReactNode, delay?: number, stagger?: number }} props
 */
function TransitionManager({ children, delay = 0.2, stagger = 0.15, className = '' }) {
  const container = {
    ...STAGGER_CONTAINER,
    visible: {
      ...STAGGER_CONTAINER.visible,
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {children}
    </motion.div>
  );
}

export default TransitionManager;

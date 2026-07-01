/**
 * AssetLoader.jsx
 * Preloader progress overlay — displays during scene asset preloads.
 * Connects to AssetContext for live progress data.
 * Hides itself when not loading.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useAssetContext }         from '@context/AssetContext';

function AssetLoader() {
  const { isLoading, progress } = useAssetContext();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="asset-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{    opacity: 0, transition: { duration: 0.5 } }}
          style={{
            position:       'fixed',
            bottom:         '2rem',
            left:           '50%',
            transform:      'translateX(-50%)',
            zIndex:         'var(--z-hud)',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            gap:            '0.5rem',
          }}
        >
          {/* Progress bar */}
          <div
            style={{
              width:        '200px',
              height:       '3px',
              background:   'rgba(255,255,255,0.1)',
              borderRadius: '2px',
              overflow:     'hidden',
            }}
          >
            <motion.div
              style={{
                height:     '100%',
                background: 'linear-gradient(90deg, #8b5cf6, #fbbf24)',
                borderRadius: '2px',
              }}
              animate={{ width: `${Math.round(progress * 100)}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>

          {/* Percentage */}
          <span
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize:   '0.75rem',
              color:      'rgba(255,255,255,0.5)',
              letterSpacing: '0.1em',
            }}
          >
            {Math.round(progress * 100)}%
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AssetLoader;

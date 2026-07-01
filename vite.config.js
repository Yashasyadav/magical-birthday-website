import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // ─── Path Aliases ──────────────────────────────────────────────────────────
  // All source imports use @/ instead of ../../ — never change these aliases.
  resolve: {
    alias: {
      '@':          path.resolve(__dirname, './src'),
      '@engine':    path.resolve(__dirname, './src/engine'),
      '@components': path.resolve(__dirname, './src/components'),
      '@scenes':    path.resolve(__dirname, './src/scenes'),
      '@hooks':     path.resolve(__dirname, './src/hooks'),
      '@context':   path.resolve(__dirname, './src/context'),
      '@utils':     path.resolve(__dirname, './src/utils'),
      '@helpers':   path.resolve(__dirname, './src/helpers'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@config':    path.resolve(__dirname, './src/config'),
      '@services':  path.resolve(__dirname, './src/services'),
      '@styles':    path.resolve(__dirname, './src/styles'),
      '@assets':    path.resolve(__dirname, './src/assets'),
      '@router':    path.resolve(__dirname, './src/router'),
    },
  },

  // ─── Dev Server ────────────────────────────────────────────────────────────
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // ─── Build ─────────────────────────────────────────────────────────────────
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Split vendor chunks for optimal caching
    rollupOptions: {
      output: {
        // Function form required by Vite 6 / Rolldown
        manualChunks(id) {
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'vendor-react';
          if (id.includes('three') || id.includes('@react-three')) return 'vendor-three';
          if (id.includes('gsap')) return 'vendor-gsap';
          if (id.includes('framer-motion')) return 'vendor-motion';
          if (id.includes('howler')) return 'vendor-audio';
          if (id.includes('tsparticles') || id.includes('@tsparticles')) return 'vendor-particles';
        },
      },
    },
  },
});

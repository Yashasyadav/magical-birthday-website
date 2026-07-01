/**
 * main.jsx
 * Application entry point. Mounts <App /> into #root.
 * StrictMode is enabled for development — will be transparent in production.
 */

import { StrictMode }   from 'react';
import { createRoot }   from 'react-dom/client';
import '@styles/globals.css';
import App              from './App.jsx';

const container = document.getElementById('root');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);

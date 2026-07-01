/**
 * ErrorBoundary.jsx
 * Scene-level error boundary. Catches render errors within a scene
 * and renders a graceful fallback instead of crashing the whole app.
 */

import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Scene crashed:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            position:       'fixed',
            inset:          0,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            background:     '#0d0a1e',
            color:          '#ffffff',
            fontFamily:     'Outfit, sans-serif',
            gap:            '1rem',
            padding:        '2rem',
            textAlign:      'center',
          }}
        >
          <span style={{ fontSize: '3rem' }}>✨</span>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', color: '#fbbf24' }}>
            A little magic went wrong
          </h2>
          <p style={{ color: '#c4b5fd', maxWidth: '400px', lineHeight: 1.6 }}>
            {this.state.error?.message ?? 'An unexpected error occurred in this scene.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop:    '1rem',
              padding:      '0.75rem 2rem',
              background:   'linear-gradient(135deg, #7c3aed, #8b5cf6)',
              border:       'none',
              borderRadius: '2rem',
              color:        '#fff',
              cursor:       'pointer',
              fontSize:     '1rem',
              fontFamily:   'Outfit, sans-serif',
            }}
          >
            Try Again ✨
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

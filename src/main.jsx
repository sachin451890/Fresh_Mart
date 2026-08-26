import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('FreshMart ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          background: '#f8fafc',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <span style={{ fontSize: '4rem', marginBottom: '16px' }}>🥑</span>
          <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '8px' }}>FreshMart Grocery</h2>
          <p style={{ color: '#dc2626', maxWidth: '600px', marginBottom: '12px', fontWeight: 'bold' }}>
            {this.state.error?.message || 'Unknown Error'}
          </p>
          <pre style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.78rem',
            textAlign: 'left',
            maxWidth: '700px',
            overflowX: 'auto',
            marginBottom: '20px'
          }}>
            {this.state.error?.stack || ''}
          </pre>
          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}
            style={{
              padding: '12px 24px',
              background: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            🔄 Clear Data & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <CartProvider>
        <App />
      </CartProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

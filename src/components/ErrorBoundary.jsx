import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.icon}>⚠️</div>
            <h2 style={styles.title}>Oops! Something went wrong</h2>
            <p style={styles.description}>
              FreshMart encountered an unexpected error while displaying this view.
            </p>

            <div style={styles.actions}>
              <button onClick={this.handleReset} style={styles.retryBtn}>
                🔄 Try Again
              </button>
              <button onClick={this.handleReload} style={styles.reloadBtn}>
                🏠 Reload Application
              </button>
            </div>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Technical Error Stack</summary>
                <pre style={styles.stack}>{this.state.error.toString()}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    backgroundColor: '#f8fafc',
  },
  card: {
    maxWidth: '520px',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
  },
  icon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 12px 0',
  },
  description: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.6',
    margin: '0 0 24px 0',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  retryBtn: {
    padding: '12px 24px',
    backgroundColor: '#059669',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.2)',
  },
  reloadBtn: {
    padding: '12px 24px',
    backgroundColor: '#f1f5f9',
    color: '#334155',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  details: {
    marginTop: '24px',
    textAlign: 'left',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid #e2e8f0',
  },
  summary: {
    fontWeight: '600',
    color: '#475569',
    cursor: 'pointer',
    fontSize: '13px',
  },
  stack: {
    fontSize: '12px',
    color: '#dc2626',
    whiteSpace: 'pre-wrap',
    marginTop: '8px',
  },
};

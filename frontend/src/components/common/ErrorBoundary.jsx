import React, { Component } from 'react';

export class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[React Error Boundary Caught]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#FEF2F2', color: '#991B1B' }}>
          <h2>Application Rendering Error</h2>
          <p>{this.state.error?.message || 'An unexpected UI error occurred.'}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
          >
            Retry Component Render
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}


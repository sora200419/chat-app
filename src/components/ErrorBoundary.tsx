// src/components/ErrorBoundary.tsx

import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className='p-4 bg-red-50 border border-red-200 rounded-md'>
          <h2 className='text-xl font-bold text-red-700 mb-2'>Something went wrong</h2>
          <p className='text-red-600 mb-4'>
            {this.state.error && this.state.error.toString()}
          </p>
          {/* Use window object instead of process.env for environment detection */}
          {typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
            <details className='bg-white p-3 rounded border border-red-200'>
              <summary className='cursor-pointer font-semibold text-red-700'>Error Details</summary>
              <pre className='mt-2 text-xs overflow-auto max-h-60'>
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button
            className='mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8 text-center bg-red-500/5 border border-red-500/10 rounded-3xl">
          <div className="max-w-md">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            <h2 className="text-2xl font-black mb-4">Critical System Error</h2>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              An unexpected error occurred while rendering this component. Our telemetry has been notified.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-premium btn-primary !rounded-xl !py-3 flex items-center gap-2 mx-auto"
            >
              <RefreshCw size={18} /> Restart Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-6 bg-[#090d16] text-slate-100 font-sans flex flex-col items-center justify-center min-h-screen text-center">
          <h2 className="text-lg font-bold text-red-400 uppercase tracking-wider mb-2">
            SURVEILLANCE CONSOLE RECOVERY
          </h2>
          <p className="text-xs text-slate-400 mb-4 max-w-md">
            An animation or component encountered a runtime issue. Recovering ground station console...
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onReset) this.props.onReset();
            }}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase transition-all cursor-pointer"
          >
            CONTINUE TO GROUND STATION
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

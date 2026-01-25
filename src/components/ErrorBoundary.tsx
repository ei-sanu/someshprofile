import { AlertCircle } from 'lucide-react';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-sm border border-red-500/30 rounded-xl p-8">
                        <div className="flex items-center justify-center mb-6">
                            <div className="p-4 bg-red-500/20 rounded-full">
                                <AlertCircle className="w-12 h-12 text-red-400" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-white text-center mb-3">
                            Something went wrong
                        </h1>

                        <p className="text-gray-400 text-center mb-6">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all"
                            >
                                Reload Page
                            </button>

                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-all"
                            >
                                Go to Home
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-6 p-4 bg-slate-950/50 rounded-lg">
                                <summary className="text-sm text-gray-400 cursor-pointer">
                                    Error Details
                                </summary>
                                <pre className="mt-2 text-xs text-red-400 overflow-auto">
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

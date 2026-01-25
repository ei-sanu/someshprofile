import { ClerkProvider } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AuthSync from './components/AuthSync';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import Header from './components/Header';
import Loader from './components/Loader';
import AdminPanel from './pages/AdminPanel';
import Home from './pages/Home';
import PaymentResult from './pages/PaymentResult';
import Payments from './pages/Payments';
import Privacy from './pages/Privacy';
import Projects from './pages/Projects';
import Terms from './pages/Terms';
import Transactions from './pages/Transactions';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn('Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file');
}

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Error boundary fallback
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center p-8 bg-red-900/20 border border-red-500/50 rounded-xl max-w-md">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  }

  try {
    return (
      <ErrorBoundary>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY || ''}>
          <AuthSync>
            <Router>
              <div className="min-h-screen bg-slate-950 flex flex-col">
                <Header />
                <div className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/payment/success" element={<PaymentResult />} />
                    <Route path="/payment/failure" element={<PaymentResult />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                  </Routes>
                </div>
                <Footer />
              </div>
            </Router>
          </AuthSync>
        </ClerkProvider>
      </ErrorBoundary>
    );
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    return null;
  }
}

export default App;

import { ClerkProvider } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AuthSync from './components/AuthSync';
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
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
  );
}

export default App;

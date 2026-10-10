import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuthCard } from './components/AuthCard';
import { Calculator } from './components/Calculator';
import { HistoryList } from './components/HistoryList';
import { Toast } from './components/Toast';

function App() {
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [toast, setToast] = useState(null);
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/auth/me', {
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      showToast('Logged out', 'info');
    } catch (err) {
      setUser(null);
    }
  };

  const handleCalculationSuccess = () => {
    setHistoryRefreshTrigger(prev => prev + 1);
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {!user ? (
          <div className="max-w-md mx-auto pt-6 sm:pt-12">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-slate-100">
                Calculator
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Sign in to calculate and save your calculation history
              </p>
            </div>
            <AuthCard
              onAuthSuccess={(userData) => setUser(userData)}
              onShowToast={showToast}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <Calculator
                onCalculateSuccess={handleCalculationSuccess}
                onShowToast={showToast}
              />
            </div>

            <div className="lg:col-span-5">
              <HistoryList
                refreshTrigger={historyRefreshTrigger}
              />
            </div>
          </div>
        )}
      </main>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;

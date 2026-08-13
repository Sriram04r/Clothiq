import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import Overview from './pages/Overview';
import Orders from './pages/Orders';
import Customers from './pages/Customers';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)' }}>Loading Clothiq Admin...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/dashboard" />} 
        />
        
        {/* Protected Dashboard Routes */}
        {user ? (
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Overview />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

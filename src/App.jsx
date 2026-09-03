import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TvSeries from './pages/TvSeries';
import MyList from './pages/MyList';
import MovieDetails from './pages/MovieDetails';
import Admin from './pages/Admin';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Search from './pages/Search';
import { AuthProvider, useAuth } from './context/AuthContext';
import axios from 'axios';

const AdManager = () => {
  const location = useLocation();

  useEffect(() => {
    const isNoAdPage = location.pathname.startsWith('/secure-hub-panel') || location.pathname === '/login';

    if (isNoAdPage) {
      // Remove scripts if we are on admin or login page
      const social = document.getElementById('adsterra-social');
      if (social) social.remove();
    } else {
      // Inject Social Bar
      if (!document.getElementById('adsterra-social')) {
        const social = document.createElement('script');
        social.id = 'adsterra-social';
        social.src = 'https://pl25263799.profitableratecpmnetwork.com/7c/d5/1f/7cd51f3740e66c29531e70b5e90d1dfb.js';
        document.body.appendChild(social);
      }
    }
  }, [location.pathname]);

  return null;
};

const SettingsManager = () => {
  useEffect(() => {
    const applySettings = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + '/api/admin/settings');
        if (res.data && res.data.disableInspect) {
          document.addEventListener('contextmenu', e => e.preventDefault());
          document.addEventListener('keydown', e => {
            if (e.key === 'F12' || 
               (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) || 
               (e.ctrlKey && (e.key === 'U' || e.key === 'u'))) {
              e.preventDefault();
            }
          });
        }
      } catch (err) { console.error('Failed to load settings', err); }
    };
    applySettings();
  }, []);
  return null;
};

// Protected Route for Normal Users
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  return (
    <>
      <Navbar />
      <div className="min-h-screen pb-16 md:pb-10">
        {children}
      </div>
      <BottomNav />
      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm mb-6 hidden md:block">
        <p>Ac 2026 MovieHub UI. Built with React and Tailwind CSS.</p>
      </footer>
    </>
  );
};

// Admin Route
const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  if (!currentUser) return <Navigate to="/secure-hub-panel/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return children;
};

// If logged in, don't show login page
const PublicRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  if (currentUser) {
    if (isAdmin) return <Navigate to="/secure-hub-panel" />;
    return <Navigate to="/" />;
  }
  return children;
};

// For the Admin Login page: if already admin, go to panel. If normal user, let them see it so they can log in as admin.
const AdminLoginRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  if (currentUser && isAdmin) {
    return <Navigate to="/secure-hub-panel" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AdManager />
        <SettingsManager />
        <div className="bg-[#141414] min-h-screen text-white overflow-x-hidden">
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/secure-hub-panel/login" element={<AdminLoginRoute><AdminLogin /></AdminLoginRoute>} />
            
            {/* Protected Routes (Normal Users) */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
            <Route path="/tvseries" element={<ProtectedRoute><TvSeries /></ProtectedRoute>} />
            <Route path="/mylist" element={<ProtectedRoute><MyList /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
            <Route path="/movie/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
            
            {/* Admin Route */}
            <Route path="/secure-hub-panel" element={<AdminRoute><Admin /></AdminRoute>} />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

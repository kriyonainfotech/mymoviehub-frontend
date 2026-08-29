import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TvSeries from './pages/TvSeries';
import MyList from './pages/MyList';
import Admin from './pages/Admin';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Search from './pages/Search';
import { AuthProvider, useAuth } from './context/AuthContext';

const AdManager = () => {
  const location = useLocation();

  useEffect(() => {
    const isAdmin = location.pathname.startsWith('/admin');

    if (isAdmin) {
      // Remove scripts if we are on admin page
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


// Protected Route for Normal Users
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  return (
    <>
      <Navbar />
      <div className="min-h-screen pb-10">
        {children}
      </div>
      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm mb-6">
        <p>© 2026 MovieHub UI. Built with React and Tailwind CSS.</p>
      </footer>
    </>
  );
};

// Admin Route
const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  if (!currentUser) return <Navigate to="/admin/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return children;
};

// If logged in, don't show login page
const PublicRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  if (currentUser) {
    if (isAdmin) return <Navigate to="/admin" />;
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AdManager />
        <div className="bg-[#141414] min-h-screen text-white overflow-x-hidden">
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
            
            {/* Protected Routes (Normal Users) */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
            <Route path="/tvseries" element={<ProtectedRoute><TvSeries /></ProtectedRoute>} />
            <Route path="/mylist" element={<ProtectedRoute><MyList /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
            
            {/* Admin Route */}
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

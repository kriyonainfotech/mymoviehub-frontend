import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaFilm, FaTv, FaUserCircle, FaList, FaThumbsUp, FaSignOutAlt, FaCog, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Profile Bottom Sheet */}
      {showDropdown && (
        <div className="lg:hidden fixed inset-0 z-[10000] flex flex-col justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowDropdown(false)}></div>
          
          {/* Sheet */}
          <div className="relative bg-[#1a1a1a] w-full max-w-[500px] mx-auto rounded-t-2xl p-6 border-t border-gray-800 shadow-2xl pb-24">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-bold text-lg">Browse</h2>
              <button onClick={() => setShowDropdown(false)} className="bg-gray-800/50 p-2 rounded-full text-gray-400 hover:text-white">
                <FaTimes size={16} />
              </button>
            </div>
            
            <div className="mb-4">
               <p className="text-xs text-gray-400 font-bold tracking-wider mb-3">ACCOUNT</p>
               <div className="text-sm text-gray-300 mb-4">{currentUser?.email}</div>
            </div>

            <p className="text-xs text-gray-400 font-bold tracking-wider mb-3">FEATURES</p>
            <div className="grid grid-cols-3 gap-3">
              <Link to="/mylist" onClick={() => setShowDropdown(false)} className="flex flex-col items-center justify-center bg-[#252525] hover:bg-[#303030] rounded-xl p-4 gap-2 transition border border-gray-700/50">
                <FaList className="text-[#3b82f6] text-xl" />
                <span className="text-xs text-white font-medium">Watchlist</span>
              </Link>
              
              {currentUser?.email === 'admin@moviehub.com' && (
                <Link to="/secure-hub-panel" onClick={() => setShowDropdown(false)} className="flex flex-col items-center justify-center bg-[#252525] hover:bg-[#303030] rounded-xl p-4 gap-2 transition border border-gray-700/50">
                  <FaCog className="text-[#a855f7] text-xl" />
                  <span className="text-xs text-white font-medium">Admin Panel</span>
                </Link>
              )}
              
              <button onClick={() => { setShowDropdown(false); logout(); }} className="flex flex-col items-center justify-center bg-[#252525] hover:bg-[#303030] rounded-xl p-4 gap-2 transition border border-gray-700/50">
                <FaSignOutAlt className="text-[#ef4444] text-xl" />
                <span className="text-xs text-white font-medium">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Nav */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[10000] w-[90%] max-w-[400px] h-14 bg-[#141414]/90 backdrop-blur-xl border border-gray-800/80 rounded-full flex items-center justify-around px-2 shadow-2xl">
        <Link to="/" className={`p-3 rounded-full transition-colors ${location.pathname === '/' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'}`}>
          <FaHome size={18} />
        </Link>
        <Link to="/search" className={`p-3 rounded-full transition-colors ${location.pathname === '/search' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'}`}>
          <FaSearch size={18} />
        </Link>
        <Link to="/movies" className={`p-3 rounded-full transition-colors ${location.pathname === '/movies' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'}`}>
          <FaFilm size={18} />
        </Link>
        <Link to="/tvseries" className={`p-3 rounded-full transition-colors ${location.pathname === '/tvseries' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'}`}>
          <FaTv size={18} />
        </Link>
        
        {/* Profile Trigger */}
        <div className="p-3">
          <div 
            className="cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="User" className="w-5 h-5 rounded-full object-cover" />
            ) : (
              <FaUserCircle size={18} className={`transition-colors ${showDropdown ? 'text-white' : 'text-gray-400 hover:text-white'}`} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNav;

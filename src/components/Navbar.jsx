import { useState, useEffect } from 'react';
import { FaSearch, FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Update URL on every keystroke
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim()) {
      navigate(`/search?q=${encodeURIComponent(val.trim())}`);
    } else if (location.pathname === '/search') {
      navigate(`/search?q=`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path 
    ? 'bg-zinc-700 text-white font-bold px-4 py-1.5 rounded-full transition-colors shadow-lg' 
    : 'bg-zinc-800/90 text-gray-300 hover:text-white hover:bg-zinc-700 px-4 py-1.5 rounded-full transition-colors shadow-md';

  if (location.pathname.startsWith('/secure-hub-panel')) {
    return null;
  }

  return (
    <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${isScrolled ? 'bg-[#141414]' : 'bg-transparent bg-gradient-to-b from-black/80 to-transparent'} px-4 md:px-8 py-4 flex justify-between items-center`}>
      <div className="flex items-center space-x-8">
        <Link to="/">
          <h1 className="text-[#E50914] text-2xl md:text-3xl font-black uppercase tracking-wider cursor-pointer drop-shadow-md">MY MOVIE HUB</h1>
        </Link>
        <ul className="hidden md:flex space-x-3 text-sm font-medium">
          <li><Link to="/" className={isActive('/')}>Home</Link></li>
          <li><Link to="/tvseries" className={isActive('/tvseries')}>TV Series</Link></li>
          <li><Link to="/movies" className={isActive('/movies')}>Movies</Link></li>
          <li><Link to="/mylist" className={isActive('/mylist')}>My List</Link></li>
        </ul>
      </div>
      <div className="flex items-center space-x-5 text-white relative">
        <div className={`flex items-center transition-all duration-300 ${searchOpen ? 'border border-white bg-black/60 px-2 py-1' : 'bg-transparent'}`}>
          <FaSearch 
            className="cursor-pointer hover:text-gray-300 text-lg" 
            onClick={(e) => {
              if (searchOpen && searchQuery.trim()) {
                handleSearchSubmit(e);
              } else {
                setSearchOpen(!searchOpen);
              }
            }} 
          />
          <form onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Titles, people, genres" 
              className={`bg-transparent outline-none text-sm text-white placeholder-gray-400 transition-all duration-300 ${searchOpen ? 'w-48 ml-2 px-1' : 'w-0'}`}
              value={searchQuery}
              onChange={handleSearchChange}
              onBlur={() => { if(!searchQuery) setSearchOpen(false) }}
            />
          </form>
        </div>
        <FaBell className="cursor-pointer hover:text-gray-300 text-lg" />
        
        <div className="relative">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="User" 
                className="w-8 h-8 rounded" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png';
                }}
              />
            ) : (
              <FaUserCircle className="text-2xl hover:text-gray-300" />
            )}
          </div>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 border border-gray-800 rounded shadow-lg py-2 flex flex-col z-[100]">
              <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-800 truncate">
                {currentUser?.email}
              </div>
              {isAdmin && (
                <Link to="/secure-hub-panel" onClick={() => setShowDropdown(false)} className="px-4 py-2 hover:bg-gray-800 text-sm transition">
                  Admin Panel
                </Link>
              )}
              <button 
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDropdown(false);
                  logout();
                }} 
                className="px-4 py-2 text-left hover:bg-gray-800 text-sm flex items-center gap-2 transition"
              >
                <FaSignOutAlt /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const TopSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleSidebarToggle = (e) => {
      setIsSidebarOpen(e.detail.isExpanded);
    };
    window.addEventListener('sidebar-toggle', handleSidebarToggle);
    return () => window.removeEventListener('sidebar-toggle', handleSidebarToggle);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/search') {
      setSearchQuery('');
    } else {
      const searchParams = new URLSearchParams(location.search);
      const q = searchParams.get('q');
      setSearchQuery(q || '');
    }
  }, [location.pathname, location.search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className={`fixed top-0 right-0 h-20 bg-transparent flex items-center justify-center px-4 md:px-12 z-[100] pointer-events-none transition-all duration-300 ${isSidebarOpen ? 'left-0 md:left-64' : 'left-0 md:left-20'}`}>
      
      {/* Search Bar (Visible on mobile and desktop) */}
      <div className="flex md:flex flex-1 w-full max-w-5xl pointer-events-auto mt-2">
        <form 
          onSubmit={handleSearchSubmit} 
          className="flex items-center bg-black/50 backdrop-blur-md border border-neutral-700/80 rounded-2xl px-5 py-3 shadow-2xl hover:bg-black/70 transition-all focus-within:bg-black/90 focus-within:border-neutral-500 w-full"
        >
          <FaSearch className="text-gray-400 text-lg mr-4 shrink-0" />
          <input 
            type="text" 
            placeholder="Movies, shows and more" 
            className="bg-transparent text-gray-200 text-base outline-none w-full placeholder-gray-400 font-medium tracking-wide"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export default TopSearchBar;

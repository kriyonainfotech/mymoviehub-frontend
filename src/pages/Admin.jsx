import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaLayerGroup, FaPlus, FaFilm, FaTv, FaTimes, FaEdit, FaTrash, FaImage, FaSignOutAlt, FaUserCircle, FaCopy, FaCog, FaBan, FaCheckCircle, FaHistory } from 'react-icons/fa';
import { getDriveDirectLink } from '../components/Row';
import { useAuth } from '../context/AuthContext';

// Set global header for all axios requests made from the Admin panel
axios.defaults.headers.common['x-admin-secret'] = import.meta.env.VITE_ADMIN_API_SECRET;

const TagInput = ({ label, value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');
  
  // Normalize string value to array of tags
  const tags = Array.isArray(value) 
    ? value 
    : (typeof value === 'string' && value.trim() ? value.split(',').map(s => s.trim()).filter(s => s) : []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = inputValue.trim();
      if (val && !tags.includes(val)) {
        onChange([...tags, val].join(', '));
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter(tag => tag !== tagToRemove).join(', '));
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-400 mb-2">{label}</label>
      <div className="w-full bg-[#111] border border-gray-700 rounded p-2 flex flex-wrap gap-2 items-center min-h-[46px] focus-within:border-red-500">
        {tags.map((tag, idx) => (
          <div key={idx} className="bg-red-600/20 border border-red-500 text-red-100 px-2 py-1 rounded text-sm flex items-center gap-2">
            {tag}
            <FaTimes className="cursor-pointer text-red-400 hover:text-white" onClick={() => removeTag(tag)} />
          </div>
        ))}
        <input 
          type="text" 
          className="bg-transparent outline-none flex-1 min-w-[120px] text-white p-1" 
          placeholder={tags.length === 0 ? placeholder : ''}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) {
              onChange([...tags, inputValue.trim()].join(', '));
              setInputValue('');
            }
          }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">Type and press Enter or Comma (,) to add multiple</p>
    </div>
  );
};

const Admin = () => {
  const { logout } = useAuth();
  const [currentView, setCurrentView] = useState(localStorage.getItem('adminView') || 'categories');

  useEffect(() => {
    localStorage.setItem('adminView', currentView);
  }, [currentView]);

  const [categories, setCategories] = useState([]);
  const [movies, setMovies] = useState([]);
  const [banners, setBanners] = useState([]);
  const [users, setUsers] = useState([]);
  const [notice, setNotice] = useState({ title: '', message: '', showTelegramButton: true, telegramLink: 'https://t.me/', isActive: false });
  const [settings, setSettings] = useState({ disableInspect: false });
  
  // Category Form State
  const [catName, setCatName] = useState('');
  const [catSections, setCatSections] = useState([]);
  const [isCatLargeRow, setIsCatLargeRow] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState('home');
  const [categoryIdToEdit, setCategoryIdToEdit] = useState(null);

  // Banner Form State
  const initialBannerState = { pages: ['home'], title: '', subtitle: '', description: '', bgImage: '', movie: '' };
  const [bannerData, setBannerData] = useState(initialBannerState);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Content Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialContentState = {
    title: '', description: '', type: 'movie', sections: [], categories: [],
    year: new Date().getFullYear(), ageRating: 'U/A 16+',
    durationOrSeasons: '', director: '', writer: '', cast: '', genres: '', tags: '',
    driveVideoId: '', driveImageId: '', driveLargeImageId: '', seasons: []
  };
  const [contentData, setContentData] = useState(initialContentState);
  const [selectedCategoryToAdd, setSelectedCategoryToAdd] = useState('');
  const [historyUser, setHistoryUser] = useState(null);

  // User Filter State
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [userDateFilter, setUserDateFilter] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchMovies();
    fetchBanners();
    fetchNotice();
    fetchUsers();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/admin/settings');
      if (res.data) setSettings(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/api/admin/settings', settings);
      alert('Settings saved successfully!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    }
  };

  const fetchNotice = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/admin/notice');
      if (res.data) {
        setNotice(res.data);
      }
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/admin/users');
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchBanners = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/admin/banners');
      setBanners(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/admin/categories');
      setCategories(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchMovies = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/admin/movies');
      setMovies(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSaveNotice = async (e) => {
    e.preventDefault();
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/api/admin/notice', notice);
      alert('Notice saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save notice');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? They will have to sign up again.')) return;
    try {
      await axios.delete(import.meta.env.VITE_API_URL + `/api/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert('Error deleting user');
      console.error(err);
    }
  };

  const handleBlockUser = async (id, currentStatus) => {
    const action = currentStatus ? 'unblock' : 'block';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      await axios.put(import.meta.env.VITE_API_URL + `/api/admin/users/${id}/block`);
      fetchUsers();
    } catch (err) {
      alert(`Error trying to ${action} user`);
      console.error(err);
    }
  };

  // --- Category Handlers ---
  const handleSectionToggle = (section) => {
    setCatSections(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (catSections.length === 0) return alert('Please select at least one section.');
    try {
      const payload = { name: catName, sections: catSections, isLargeRow: isCatLargeRow };
      if (categoryIdToEdit) {
        await axios.put(import.meta.env.VITE_API_URL + `/api/admin/category/${categoryIdToEdit}`, payload);
        alert('Category updated successfully!');
      } else {
        await axios.post(import.meta.env.VITE_API_URL + '/api/admin/category', payload);
        alert('Category added successfully!');
      }
      setCatName(''); setCatSections([]); setIsCatLargeRow(false); setCategoryIdToEdit(null); fetchCategories();
      setIsCategoryModalOpen(false);
    } catch (err) { alert('Error saving category.'); }
  };

  const handleEditCategory = (cat) => {
    setCatName(cat.name);
    setCatSections(cat.sections || []);
    setIsCatLargeRow(cat.isLargeRow || false);
    setCategoryIdToEdit(cat._id);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(import.meta.env.VITE_API_URL + `/api/admin/category/${id}`);
      fetchCategories();
    } catch (err) { alert('Error deleting category'); }
  };

  // --- Content Form Handlers ---
  const openModal = () => {
    setContentData(initialContentState);
    setIsModalOpen(true);
  };

  const handleAddCategoryToContent = () => {
    if (!selectedCategoryToAdd) return;
    if (!contentData.categories.includes(selectedCategoryToAdd)) {
      setContentData(prev => ({ ...prev, categories: [...prev.categories, selectedCategoryToAdd] }));
    }
    setSelectedCategoryToAdd('');
  };

  const handleRemoveCategoryFromContent = (catId) => {
    setContentData(prev => ({ ...prev, categories: prev.categories.filter(id => id !== catId) }));
  };

  const handleContentSectionToggle = (section) => {
    setContentData(prev => {
      const sections = prev.sections.includes(section) ? prev.sections.filter(s => s !== section) : [...prev.sections, section];
      return { ...prev, sections };
    });
  };

  const handleContentSubmit = async (e) => {
    e.preventDefault();
    if (contentData.categories.length === 0) return alert('Please select at least one category.');

    const type = currentView === 'movies' ? 'movie' : 'tvseries';
    
    // Convert comma separated cast/genres back to array if they are strings
    const payload = {
      ...contentData,
      type,
      cast: typeof contentData.cast === 'string' ? contentData.cast.split(',').map(s => s.trim()).filter(s => s) : contentData.cast,
      genres: typeof contentData.genres === 'string' ? contentData.genres.split(',').map(s => s.trim()).filter(s => s) : contentData.genres,
    };
    
    try {
      if (contentData._id) {
        await axios.put(import.meta.env.VITE_API_URL + `/api/admin/movie/${contentData._id}`, payload);
        alert(`${type === 'movie' ? 'Movie' : 'TV Series'} updated successfully!`);
      } else {
        await axios.post(import.meta.env.VITE_API_URL + '/api/admin/movie', payload);
        alert(`${type === 'movie' ? 'Movie' : 'TV Series'} added successfully!`);
      }
      setIsModalOpen(false);
      fetchMovies();
    } catch (err) {
      alert('Error saving content.');
    }
  };

  const handleEditContent = (item) => {
    // Populate form data, converting arrays back to comma-separated strings for inputs
    setContentData({
      ...item,
      categories: item.categories.map(c => typeof c === 'object' ? c._id : c),
      cast: Array.isArray(item.cast) ? item.cast.join(', ') : item.cast,
      genres: Array.isArray(item.genres) ? item.genres.join(', ') : item.genres,
    });
    setIsModalOpen(true);
  };

  const handleDuplicateContent = (item) => {
    setContentData({
      ...item,
      _id: undefined, // Remove ID so it creates a new entry
      title: item.title + ' (Copy)',
      categories: item.categories.map(c => typeof c === 'object' ? c._id : c),
      cast: Array.isArray(item.cast) ? item.cast.join(', ') : item.cast,
      genres: Array.isArray(item.genres) ? item.genres.join(', ') : item.genres,
    });
    setIsModalOpen(true);
  };

  const handleDeleteContent = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await axios.delete(import.meta.env.VITE_API_URL + `/api/admin/movie/${id}`);
      fetchMovies();
    } catch (err) { alert('Error deleting item'); }
  };

  // --- Banner Form Handlers ---
  const handleBannerPageToggle = (page) => {
    setBannerData(prev => {
      const pages = prev.pages?.includes(page) ? prev.pages.filter(p => p !== page) : [...(prev.pages || []), page];
      return { ...prev, pages };
    });
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    if (!bannerData.movie) return alert('Please select a movie/series for the banner.');
    if (!bannerData.pages || bannerData.pages.length === 0) return alert('Please select at least one page.');
    
    // Ensure movie is just the ID if it's an object (populated)
    const payload = { ...bannerData, movie: typeof bannerData.movie === 'object' ? bannerData.movie._id : bannerData.movie };
    
    try {
      if (bannerData._id) {
        await axios.put(import.meta.env.VITE_API_URL + `/api/admin/banner/${bannerData._id}`, payload);
        alert('Banner updated successfully!');
      } else {
        await axios.post(import.meta.env.VITE_API_URL + '/api/admin/banner', payload);
        alert('Banner saved successfully!');
      }
      setIsBannerModalOpen(false);
      fetchBanners();
    } catch (err) { alert('Error saving banner.'); }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await axios.delete(import.meta.env.VITE_API_URL + `/api/admin/banner/${id}`);
      fetchBanners();
    } catch (err) { alert('Error deleting banner'); }
  };
  const displayList = currentView === 'movies' ? movies.filter(m => m.type === 'movie') : movies.filter(m => m.type === 'tvseries');

  return (
    <div className="h-screen overflow-hidden bg-[#0f0f0f] text-white flex flex-col lg:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-[#141414] border-b lg:border-b-0 lg:border-r border-gray-800 flex flex-col pt-4 lg:pt-6 h-auto lg:h-screen shrink-0 z-20">
        <div className="px-4 lg:px-6 mb-4 lg:mb-10 flex justify-between items-center">
          <h1 className="text-[#E50914] text-xl font-black uppercase tracking-wider drop-shadow-md">MY MOVIE HUB</h1>
          <button onClick={logout} className="lg:hidden flex items-center text-gray-400 hover:text-white transition">
            <FaSignOutAlt size={20} />
          </button>
        </div>
        <h2 className="hidden lg:block text-gray-500 text-xs font-bold uppercase tracking-wider px-6 mb-4">Admin Menu</h2>
        
        <nav className="flex lg:flex-col gap-2 lg:gap-1 overflow-x-auto px-4 lg:px-0 pb-3 lg:pb-0 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          <div onClick={() => setCurrentView('categories')} className={`whitespace-nowrap shrink-0 flex items-center gap-2 lg:gap-3 px-4 py-3 lg:px-6 lg:py-3 cursor-pointer transition rounded-full lg:rounded-none ${currentView === 'categories' ? 'bg-red-600/10 lg:border-r-4 border-red-600 text-red-500 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-[#222]'}`}>
            <FaLayerGroup size={18} /> <span className="hidden lg:inline">Categories</span>
          </div>
          <div onClick={() => setCurrentView('movies')} className={`whitespace-nowrap shrink-0 flex items-center gap-2 lg:gap-3 px-4 py-3 lg:px-6 lg:py-3 cursor-pointer transition rounded-full lg:rounded-none ${currentView === 'movies' ? 'bg-red-600/10 lg:border-r-4 border-red-600 text-red-500 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-[#222]'}`}>
            <FaFilm size={18} /> <span className="hidden lg:inline">Movies</span>
          </div>
          <div onClick={() => setCurrentView('series')} className={`whitespace-nowrap shrink-0 flex items-center gap-2 lg:gap-3 px-4 py-3 lg:px-6 lg:py-3 cursor-pointer transition rounded-full lg:rounded-none ${currentView === 'series' ? 'bg-red-600/10 lg:border-r-4 border-red-600 text-red-500 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-[#222]'}`}>
            <FaTv size={18} /> <span className="hidden lg:inline">TV Series</span>
          </div>
          <div onClick={() => setCurrentView('banners')} className={`whitespace-nowrap shrink-0 flex items-center gap-2 lg:gap-3 px-4 py-3 lg:px-6 lg:py-3 cursor-pointer transition rounded-full lg:rounded-none ${currentView === 'banners' ? 'bg-red-600/10 lg:border-r-4 border-red-600 text-red-500 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-[#222]'}`}>
            <FaImage size={18} /> <span className="hidden lg:inline">Banners</span>
          </div>
          <div onClick={() => setCurrentView('notice')} className={`whitespace-nowrap shrink-0 flex items-center gap-2 lg:gap-3 px-4 py-3 lg:px-6 lg:py-3 cursor-pointer transition rounded-full lg:rounded-none ${currentView === 'notice' ? 'bg-red-600/10 lg:border-r-4 border-red-600 text-red-500 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-[#222]'}`}>
            <FaLayerGroup size={18} /> <span className="hidden lg:inline">Notice</span>
          </div>
          <div onClick={() => setCurrentView('users')} className={`whitespace-nowrap shrink-0 flex items-center gap-2 lg:gap-3 px-4 py-3 lg:px-6 lg:py-3 cursor-pointer transition rounded-full lg:rounded-none ${currentView === 'users' ? 'bg-red-600/10 lg:border-r-4 border-red-600 text-red-500 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-[#222]'}`}>
            <FaUserCircle size={18} /> <span className="hidden lg:inline">Users</span>
          </div>
          <div onClick={() => setCurrentView('settings')} className={`whitespace-nowrap shrink-0 flex items-center gap-2 lg:gap-3 px-4 py-3 lg:px-6 lg:py-3 cursor-pointer transition rounded-full lg:rounded-none ${currentView === 'settings' ? 'bg-red-600/10 lg:border-r-4 border-red-600 text-red-500 font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-[#222]'}`}>
            <FaCog size={18} /> <span className="hidden lg:inline">Settings</span>
          </div>
        </nav>
        
        <div className="hidden lg:block mt-auto p-6 border-t border-gray-800">
          <button 
            onClick={logout} 
            className="flex items-center gap-3 text-gray-400 hover:text-white transition w-full"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto relative">
        
        {/* ======================= CATEGORIES VIEW ======================= */}
        {currentView === 'categories' && (
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-8 text-center lg:text-left">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">Manage Categories</h1>
                <p className="text-sm lg:text-base text-gray-400">Create categories and choose where they should appear.</p>
              </div>
              <button 
                onClick={() => {
                  setCategoryIdToEdit(null);
                  setCatName('');
                  setCatSections([]);
                  setIsCatLargeRow(false);
                  setIsCategoryModalOpen(true);
                }} 
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded shadow-lg flex items-center justify-center gap-2 w-full lg:w-auto"
              >
                <FaPlus /> Create New Category
              </button>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Existing Categories</h2>
            <div className="bg-[#181818] border border-gray-800 rounded-lg overflow-hidden">
              <div className="flex flex-col md:flex-row border-b border-gray-800">
                {['home', 'movie', 'tvseries'].map(tab => (
                  <button key={tab} onClick={() => setActiveCategoryTab(tab)} className={`flex-1 py-4 px-4 font-bold capitalize transition text-left md:text-center ${activeCategoryTab === tab ? 'bg-red-600/10 text-red-500 border-l-4 md:border-l-0 md:border-b-2 border-red-500' : 'text-gray-400 hover:bg-[#222]'}`}>
                    {tab === 'tvseries' ? 'TV Series' : tab} Section
                  </button>
                ))}
              </div>
              <div className="p-6">
                {(() => {
                  const visibleCategories = categories.filter(c => c.sections && c.sections.includes(activeCategoryTab));
                  if (visibleCategories.length === 0) return <p className="text-gray-500 italic py-4 text-center">No categories here.</p>;
                  return (
                    <ul className="space-y-3">
                      {visibleCategories.map(cat => (
                        <li key={cat._id} className="bg-[#222] p-4 rounded border border-gray-700 font-medium flex justify-between items-center group">
                          <span>{cat.name}</span>
                          <div className="flex gap-4 transition">
                            <button onClick={() => handleEditCategory(cat)} className="text-blue-500 hover:text-blue-400"><FaEdit size={16} /></button>
                            <button onClick={() => handleDeleteCategory(cat._id)} className="text-red-500 hover:text-red-400"><FaTrash size={16} /></button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ======================= MOVIES / SERIES LIST VIEW ======================= */}
        {(currentView === 'movies' || currentView === 'series') && (
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-8 text-center lg:text-left">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">Manage {currentView === 'movies' ? 'Movies' : 'TV Series'}</h1>
                <p className="text-sm lg:text-base text-gray-400">View, edit, or delete existing content.</p>
              </div>
              <button onClick={openModal} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded shadow-lg flex items-center justify-center gap-2 w-full lg:w-auto">
                <FaPlus /> Add {currentView === 'movies' ? 'Movie' : 'Series'}
              </button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-[#181818] border border-gray-800 rounded-lg overflow-hidden shadow-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#222] border-b border-gray-800">
                    <th className="p-4 text-gray-400 font-semibold">Title</th>
                    <th className="p-4 text-gray-400 font-semibold">Year</th>
                    <th className="p-4 text-gray-400 font-semibold">Categories</th>
                    <th className="p-4 text-gray-400 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayList.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500 italic">No items found. Click 'Add {currentView === 'movies' ? 'Movie' : 'Series'}' to create one.</td>
                    </tr>
                  ) : (
                    displayList.map(item => (
                      <tr key={item._id} className="border-b border-gray-800 hover:bg-[#1a1a1a]">
                        <td className="p-4 font-bold">{item.title}</td>
                        <td className="p-4 text-gray-300">{item.year}</td>
                        <td className="p-4 text-sm text-gray-400">
                          {item.categories.map(c => c.name).join(', ')}
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => handleDuplicateContent(item)} className="text-green-500 hover:text-green-400 mr-4" title="Duplicate"><FaCopy size={18} /></button>
                          <button onClick={() => handleEditContent(item)} className="text-blue-500 hover:text-blue-400 mr-4" title="Edit"><FaEdit size={18} /></button>
                          <button onClick={() => handleDeleteContent(item._id)} className="text-red-500 hover:text-red-400" title="Delete"><FaTrash size={18} /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden flex flex-col gap-4">
              {displayList.length === 0 ? (
                <div className="p-8 bg-[#181818] rounded-lg border border-gray-800 text-center text-gray-500 italic">
                  No items found. Click 'Add {currentView === 'movies' ? 'Movie' : 'Series'}' to create one.
                </div>
              ) : (
                displayList.map(item => (
                  <div key={item._id} className="bg-[#181818] border border-gray-800 rounded-lg p-5 flex flex-col gap-3 shadow-lg">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-white">{item.title}</h3>
                      <span className="bg-[#222] text-gray-300 text-xs px-2 py-1 rounded font-mono">{item.year}</span>
                    </div>
                    
                    {item.categories && item.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.categories.map((c, i) => (
                          <span key={i} className="text-xs bg-red-600/10 text-red-500 px-2 py-1 rounded">
                            {c.name}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="border-t border-gray-800 pt-3 mt-1 flex justify-end gap-5">
                      <button onClick={() => handleDuplicateContent(item)} className="flex items-center gap-2 text-sm text-green-500 hover:text-green-400" title="Duplicate">
                        <FaCopy size={16} /> <span className="hidden sm:inline">Duplicate</span>
                      </button>
                      <button onClick={() => handleEditContent(item)} className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400" title="Edit">
                        <FaEdit size={16} /> <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button onClick={() => handleDeleteContent(item._id)} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400" title="Delete">
                        <FaTrash size={16} /> <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================= BANNERS VIEW ======================= */}
        {currentView === 'banners' && (
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-8 text-center lg:text-left">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">Manage Banners</h1>
                <p className="text-sm lg:text-base text-gray-400">Upload and manage rotating banners.</p>
              </div>
              <button onClick={() => { setBannerData(initialBannerState); setIsBannerModalOpen(true); }} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded shadow-lg flex items-center justify-center gap-2 w-full lg:w-auto">
                <FaPlus /> Create Banner
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['home', 'movies', 'tvseries'].map(page => {
                const pageBanner = banners.find(b => b.pages && b.pages.includes(page));
                return (
                  <div key={page} className="bg-[#181818] border border-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col">
                    <div className="p-4 bg-[#222] border-b border-gray-800 flex justify-between items-center">
                      <h3 className="font-bold uppercase tracking-wider">{page === 'tvseries' ? 'TV Series' : page} Page</h3>
                      {pageBanner && (
                        <div className="flex gap-3">
                          <button onClick={() => { setBannerData(pageBanner); setIsBannerModalOpen(true); }} className="text-blue-500 hover:text-blue-400"><FaEdit /></button>
                          <button onClick={() => handleDeleteBanner(pageBanner._id)} className="text-red-500 hover:text-red-400"><FaTrash /></button>
                        </div>
                      )}
                    </div>
                    {pageBanner ? (
                      <div className="p-4">
                        <div className="h-32 bg-gray-800 rounded mb-4 overflow-hidden relative">
                           {pageBanner.bgImage && <img src={getDriveDirectLink(pageBanner.bgImage)} alt="Banner" className="w-full h-full object-cover opacity-50" />}
                           <div className="absolute bottom-2 left-2 right-2">
                             <h4 className="font-black text-xl text-white truncate">{pageBanner.title}</h4>
                           </div>
                        </div>
                        <p className="text-xs text-gray-400 mb-2 truncate">{pageBanner.subtitle}</p>
                        <p className="text-xs text-gray-500 truncate">Linked to: {pageBanner.movie?.title || 'Unknown'}</p>
                      </div>
                    ) : (
                      <div className="p-10 text-center text-gray-600 flex-1 flex flex-col justify-center">
                        <p className="italic">No banner set.</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* ======================= NOTICE VIEW ======================= */}
        {currentView === 'notice' && (
          <div className="max-w-4xl mx-auto text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Important Note</h1>
            <p className="text-sm lg:text-base text-gray-400 mb-8">Manage the global important note that appears on your pages.</p>
            
            <form onSubmit={handleSaveNotice} className="bg-[#1f1f1f] p-6 rounded border border-gray-700">
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Enable Note</label>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={notice.isActive}
                      onChange={e => setNotice({...notice, isActive: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600 relative"></div>
                    <span className="ml-3 text-sm font-medium text-gray-300">
                      {notice.isActive ? 'Active (Visible on site)' : 'Inactive (Hidden)'}
                    </span>
                  </label>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Title</label>
                  <input type="text" value={notice.title} onChange={e => setNotice({...notice, title: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded p-3 text-white focus:border-red-500" placeholder="e.g. Important Note" required />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Message</label>
                  <textarea value={notice.message} onChange={e => setNotice({...notice, message: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded p-3 h-24 text-white focus:border-red-500" placeholder="Your note here..." required></textarea>
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center gap-2 mb-2">
                    <input type="checkbox" checked={notice.showTelegramButton} onChange={e => setNotice({...notice, showTelegramButton: e.target.checked})} />
                    <span className="text-sm font-bold text-gray-400">Show Telegram Button</span>
                  </label>
                  {notice.showTelegramButton && (
                    <input type="text" value={notice.telegramLink} onChange={e => setNotice({...notice, telegramLink: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded p-3 text-white focus:border-red-500" placeholder="https://t.me/yourchannel" required />
                  )}
                </div>
                
                <button type="submit" className="bg-red-600 text-white font-bold py-3 px-8 rounded mt-4 hover:bg-red-700 transition">
                  Save Note
                </button>
              </form>
          </div>
        )}

        {/* ======================= USERS VIEW ======================= */}
        {currentView === 'users' && (() => {
          const filteredUsers = users.filter(u => {
            const matchesSearch = (u.displayName || '').toLowerCase().includes(userSearchTerm.toLowerCase()) || 
                                  (u.email || '').toLowerCase().includes(userSearchTerm.toLowerCase());
            const matchesFilter = userFilter === 'all' || 
                                  (userFilter === 'blocked' && u.isBlocked) || 
                                  (userFilter === 'active' && !u.isBlocked);
            let matchesDate = true;
            if (userDateFilter) {
              const uDate = new Date(u.lastLogin).toISOString().split('T')[0];
              matchesDate = uDate === userDateFilter;
            }
            return matchesSearch && matchesFilter && matchesDate;
          });

          return (
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-4 mb-8 text-center lg:text-left">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2">Registered Users</h1>
                  <p className="text-sm lg:text-base text-gray-400">View all users who have logged in via Google.</p>
                </div>
                <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
                  <input 
                    type="date"
                    value={userDateFilter}
                    onChange={(e) => setUserDateFilter(e.target.value)}
                    className="bg-[#111] border border-gray-800 rounded p-2 text-sm text-gray-300 focus:outline-none focus:border-red-600"
                    style={{ colorScheme: 'dark' }}
                    title="Filter by Login Date"
                  />
                  <input 
                    type="text" 
                    placeholder="Search name or email..." 
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="bg-[#111] border border-gray-800 rounded p-2 text-sm text-white focus:outline-none focus:border-red-600 w-64"
                  />
                  <select 
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    className="bg-[#111] border border-gray-800 rounded p-2 text-sm text-gray-300 focus:outline-none focus:border-red-600"
                  >
                    <option value="all">All Users</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>
              
              <>
              {/* Desktop Table View */}
              <div className="hidden lg:block bg-[#181818] border border-gray-800 rounded-lg overflow-hidden shadow-lg overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-[#222] border-b border-gray-800">
                      <th className="p-4 text-gray-400 font-semibold w-16">Profile</th>
                      <th className="p-4 text-gray-400 font-semibold">Name</th>
                      <th className="p-4 text-gray-400 font-semibold">Email</th>
                      <th className="p-4 text-gray-400 font-semibold">Network & Device</th>
                      <th className="p-4 text-gray-400 font-semibold">Last Login</th>
                      <th className="p-4 text-gray-400 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-gray-500 italic">No users found.</td>
                      </tr>
                    ) : (
                      filteredUsers.map(user => (
                      <tr key={user._id} className="border-b border-gray-800 hover:bg-[#1a1a1a]">
                        <td className="p-4 align-top">
                          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg uppercase shadow-lg">
                            {(user.displayName || user.email || '?').charAt(0)}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-gray-200 align-top">
                          {user.displayName || 'N/A'}
                          {user.isBlocked && <span className="ml-2 px-2 py-0.5 bg-red-900/50 text-red-400 text-[10px] rounded border border-red-800">BLOCKED</span>}
                        </td>
                        <td className="p-4 text-gray-400 align-top">{user.email}</td>
                        <td className="p-4 text-gray-400 text-sm align-top">
                          {user.lastIp && <div className="text-blue-400 font-mono text-xs mb-1">IP: {user.lastIp}</div>}
                          {user.city && user.country && <div className="mb-1 text-gray-300">📍 {user.city}, {user.country}</div>}
                          {user.isp && <div className="mb-1 text-gray-300">🌐 {user.isp}</div>}
                          {user.userAgent && (
                            <div className="text-gray-500 text-xs mt-1" title={user.userAgent}>
                              {(() => {
                                const ua = user.userAgent;
                                let os = 'Unknown OS';
                                if (ua.includes('Windows')) os = '🖥️ Windows';
                                else if (ua.includes('Mac OS')) os = '🍎 Mac';
                                else if (ua.includes('Android')) os = '📱 Android';
                                else if (ua.includes('iPhone') || ua.includes('iPad')) os = '📱 iOS';
                                else if (ua.includes('Linux')) os = '🐧 Linux';

                                let browser = 'Unknown Browser';
                                if (ua.includes('Edg')) browser = 'Edge';
                                else if (ua.includes('Chrome')) browser = 'Chrome';
                                else if (ua.includes('Firefox')) browser = 'Firefox';
                                else if (ua.includes('Safari')) browser = 'Safari';

                                return <span>{os} • {browser}</span>;
                              })()}
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-gray-400 align-top">
                           {new Date(user.lastLogin).toLocaleString()}
                           <div className="text-xs text-gray-500 mt-1">Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="p-4 text-right align-top flex justify-end gap-2">
                          <button onClick={() => setHistoryUser(user)} className="p-2 text-blue-500 hover:text-blue-400" title="View History"><FaHistory size={18} /></button>
                          <button onClick={() => handleBlockUser(user._id, user.isBlocked)} className={`p-2 ${user.isBlocked ? 'text-green-500 hover:text-green-400' : 'text-orange-500 hover:text-orange-400'}`} title={user.isBlocked ? "Unblock User" : "Block User"}>
                            {user.isBlocked ? <FaCheckCircle size={18} /> : <FaBan size={18} />}
                          </button>
                          <button onClick={() => handleDeleteUser(user._id)} className="text-red-500 hover:text-red-400 p-2" title="Delete User"><FaTrash size={18} /></button>
                        </td>
                      </tr>
                    ))
                  )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden flex flex-col gap-4">
                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 italic bg-[#181818] border border-gray-800 rounded-lg">No users found.</div>
                ) : (
                  filteredUsers.map(user => (
                    <div key={user._id} className="bg-[#181818] border border-gray-800 rounded-lg p-4 flex flex-col gap-3 shadow-md relative">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xl uppercase shadow-lg flex-shrink-0">
                          {(user.displayName || user.email || '?').charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-200 truncate flex items-center gap-2">
                            {user.displayName || 'N/A'}
                            {user.isBlocked && <span className="px-2 py-0.5 bg-red-900/50 text-red-400 text-[10px] rounded border border-red-800 shrink-0">BLOCKED</span>}
                          </h4>
                          <p className="text-sm text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="bg-[#222] rounded p-3 text-xs text-gray-400 space-y-1">
                        {user.lastIp && <div className="text-blue-400 font-mono">IP: {user.lastIp}</div>}
                        {user.city && user.country && <div className="text-gray-300">📍 {user.city}, {user.country}</div>}
                        {user.isp && <div className="text-gray-300">🌐 {user.isp}</div>}
                        {user.userAgent && (
                          <div className="text-gray-500 mt-1">
                            {(() => {
                              const ua = user.userAgent;
                              let os = 'Unknown OS';
                              if (ua.includes('Windows')) os = '🖥️ Windows';
                              else if (ua.includes('Mac OS')) os = '🍎 Mac';
                              else if (ua.includes('Android')) os = '📱 Android';
                              else if (ua.includes('iPhone') || ua.includes('iPad')) os = '📱 iOS';
                              else if (ua.includes('Linux')) os = '🐧 Linux';

                              let browser = 'Unknown Browser';
                              if (ua.includes('Edg')) browser = 'Edge';
                              else if (ua.includes('Chrome')) browser = 'Chrome';
                              else if (ua.includes('Firefox')) browser = 'Firefox';
                              else if (ua.includes('Safari')) browser = 'Safari';

                              return <span>{os} • {browser}</span>;
                            })()}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-400 flex justify-between items-end">
                        <div>
                          <div><span className="text-gray-500">Last:</span> {new Date(user.lastLogin).toLocaleString()}</div>
                          <div className="text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setHistoryUser(user)} className="p-2 bg-[#2a2a2a] rounded text-blue-500 hover:text-blue-400" title="View History"><FaHistory size={14} /></button>
                          <button onClick={() => handleBlockUser(user._id, user.isBlocked)} className={`p-2 bg-[#2a2a2a] rounded ${user.isBlocked ? 'text-green-500 hover:text-green-400' : 'text-orange-500 hover:text-orange-400'}`} title={user.isBlocked ? "Unblock User" : "Block User"}>
                            {user.isBlocked ? <FaCheckCircle size={14} /> : <FaBan size={14} />}
                          </button>
                          <button onClick={() => handleDeleteUser(user._id)} className="p-2 bg-[#2a2a2a] rounded text-red-500 hover:text-red-400" title="Delete User"><FaTrash size={14} /></button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              </>
            </div>
          );
        })()}

        {/* ======================= SETTINGS VIEW ======================= */}
        {currentView === 'settings' && (
          <div className="max-w-4xl mx-auto text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Global Settings</h1>
            <p className="text-sm lg:text-base text-gray-400 mb-8">Manage app-wide settings and security features.</p>
            
            <form onSubmit={handleSaveSettings} className="bg-[#1f1f1f] p-6 rounded border border-gray-700">
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Security: Disable Inspect Element (Right Click / F12)</label>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings.disableInspect || false}
                      onChange={e => setSettings({...settings, disableInspect: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600 relative"></div>
                    <span className="ml-3 text-sm font-medium text-gray-300">
                      {settings.disableInspect ? 'Enabled (Users cannot inspect)' : 'Disabled (Default browser behavior)'}
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">When enabled, this will block right-click, F12, and Ctrl+Shift+I across the entire public website to prevent users from easily inspecting the code or stealing assets.</p>
                </div>
                
                <button type="submit" className="bg-red-600 text-white font-bold py-3 px-8 rounded mt-4 hover:bg-red-700 transition">
                  Save Settings
                </button>
            </form>
          </div>
        )}

      </main>

      {/* ======================= CREATE CONTENT MODAL ======================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/80 backdrop-blur-sm p-0 md:p-4">
          <div className="w-full h-full md:h-auto max-w-4xl bg-[#141414] md:max-h-[95vh] rounded-none md:rounded-xl shadow-2xl flex flex-col border-0 md:border border-gray-800 overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-800 bg-[#181818]">
              <h2 className="text-xl md:text-2xl font-bold">
                {contentData._id ? 'Edit' : 'Add New'} {currentView === 'movies' ? 'Movie' : 'TV Series'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white bg-[#222] p-2 rounded-full">
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <form id="content-form" onSubmit={handleContentSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pb-20">
                
                {/* Category Assignment */}
                <div className="lg:col-span-2 bg-[#1f1f1f] p-5 rounded border border-gray-700">
                  <h3 className="text-lg font-bold mb-4 text-red-500 flex items-center gap-2"><FaLayerGroup /> Assign to Categories</h3>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-end mb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-gray-400 mb-2">Select Category</label>
                      <select value={selectedCategoryToAdd} onChange={e => setSelectedCategoryToAdd(e.target.value)} className="w-full bg-[#111] border border-gray-600 rounded p-3 text-white">
                        <option value="">-- Choose a Category --</option>
                        {categories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <button type="button" onClick={handleAddCategoryToContent} className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold p-3 px-6 rounded flex items-center justify-center gap-2 h-auto sm:h-[50px] mt-2 sm:mt-0">
                      <FaPlus /> Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {contentData.categories.length === 0 && <span className="text-gray-500 text-sm italic">No categories added yet.</span>}
                    {contentData.categories.map(catId => {
                      const catObj = categories.find(c => c._id === catId);
                      if (!catObj) return null;
                      return (
                        <div key={catId} className="bg-red-600/20 border border-red-500/50 text-red-100 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm">
                          {catObj.name}
                          <FaTimes className="cursor-pointer text-red-400 hover:text-white" onClick={() => handleRemoveCategoryFromContent(catId)} />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Removed 'Show on Pages' section as requested */}

                <div className="lg:col-span-2 border-t border-gray-800 pt-4 mt-2"><h3 className="text-lg font-bold text-white">General Info</h3></div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Title</label>
                  <input type="text" value={contentData.title} onChange={e => setContentData({...contentData, title: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded p-3" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Description</label>
                  <textarea rows="1" value={contentData.description} onChange={e => setContentData({...contentData, description: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded p-3" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Year</label>
                  <input type="number" value={contentData.year} onChange={e => setContentData({...contentData, year: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded p-3" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Duration / Seasons</label>
                  <input type="text" value={contentData.durationOrSeasons} onChange={e => setContentData({...contentData, durationOrSeasons: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded p-3" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Age Rating</label>
                  <input type="text" placeholder="e.g. U/A 16+, A, U" value={contentData.ageRating || ''} onChange={e => setContentData({...contentData, ageRating: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded p-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Director</label>
                  <input type="text" value={contentData.director || ''} onChange={e => setContentData({...contentData, director: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded p-3" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Writer</label>
                  <input type="text" value={contentData.writer || ''} onChange={e => setContentData({...contentData, writer: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded p-3" />
                </div>
                <div className="md:col-span-2">
                  <TagInput 
                    label="Cast Members" 
                    placeholder="e.g. Yash, Sanjay Dutt" 
                    value={contentData.cast} 
                    onChange={val => setContentData({...contentData, cast: val})} 
                  />
                </div>
                <div className="md:col-span-2">
                  <TagInput 
                    label="Genres" 
                    placeholder="e.g. Action, Drama" 
                    value={contentData.genres} 
                    onChange={val => setContentData({...contentData, genres: val})} 
                  />
                </div>

                {/* Google Drive Attachments */}
                <div className="md:col-span-2 border-t border-gray-800 pt-6 mt-4">
                  <h3 className="text-xl font-bold mb-2 text-blue-400">Google Drive Attachments (Public Links)</h3>
                  <p className="text-sm text-gray-400 mb-6">Apne Google Drive se file ka 'Copy Link' karein aur yahan paste kar dein (Folder public hona chahiye).</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Video File Link</label>
                      <input 
                        type="text" 
                        placeholder="https://drive.google.com/file/d/..."
                        value={contentData.driveVideoId} 
                        onChange={e => setContentData({...contentData, driveVideoId: e.target.value})} 
                        className="w-full bg-[#111] border border-blue-900/50 rounded p-3 text-white focus:border-blue-500" 
                        required={contentData.type === 'movie'} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Thumbnail Link (Hover)</label>
                      <input type="text" placeholder="https://drive.google.com/file/d/..." value={contentData.driveImageId} onChange={e => setContentData({...contentData, driveImageId: e.target.value})} className="w-full bg-[#111] border border-blue-900/50 rounded p-3 text-white focus:border-blue-500" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Banner Link (Top/Modal)</label>
                      <input type="text" placeholder="https://drive.google.com/file/d/..." value={contentData.driveLargeImageId} onChange={e => setContentData({...contentData, driveLargeImageId: e.target.value})} className="w-full bg-[#111] border border-blue-900/50 rounded p-3 text-white focus:border-blue-500" />
                    </div>
                  </div>
                </div>

                {/* Seasons & Episodes UI */}
                {contentData.type === 'tvseries' && (
                  <div className="md:col-span-2 border-t border-gray-800 pt-6 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-green-400">Seasons & Episodes</h3>
                      <button 
                        type="button" 
                        onClick={() => setContentData({
                          ...contentData, 
                          seasons: [...(contentData.seasons || []), { name: `Season ${(contentData.seasons?.length || 0) + 1}`, episodes: [] }]
                        })}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-bold flex items-center gap-2"
                      >
                        <FaPlus size={10} /> Add Season
                      </button>
                    </div>
                    
                    {(contentData.seasons || []).map((season, sIdx) => (
                      <div key={sIdx} className="bg-[#222] p-4 rounded mb-4 border border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                          <input 
                            type="text" 
                            value={season.name} 
                            onChange={(e) => {
                              const newSeasons = [...contentData.seasons];
                              newSeasons[sIdx].name = e.target.value;
                              setContentData({...contentData, seasons: newSeasons});
                            }}
                            className="bg-[#111] border border-gray-600 rounded p-2 text-white font-bold"
                          />
                          <div className="flex gap-2">
                            <button 
                              type="button"
                              onClick={() => {
                                const newSeasons = [...contentData.seasons];
                                newSeasons[sIdx].episodes.push({ title: '', duration: '', description: '', driveImageId: '', driveVideoId: '' });
                                setContentData({...contentData, seasons: newSeasons});
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold"
                            >
                              + Add Episode
                            </button>
                            <button 
                              type="button"
                              onClick={() => {
                                const newSeasons = contentData.seasons.filter((_, i) => i !== sIdx);
                                setContentData({...contentData, seasons: newSeasons});
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-bold"
                            >
                              Delete Season
                            </button>
                          </div>
                        </div>

                        {season.episodes.map((ep, eIdx) => (
                          <div key={eIdx} className="bg-[#111] p-3 rounded mb-3 border border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-3 relative pr-10">
                            <button 
                              type="button"
                              onClick={() => {
                                const newSeasons = [...contentData.seasons];
                                newSeasons[sIdx].episodes = newSeasons[sIdx].episodes.filter((_, i) => i !== eIdx);
                                setContentData({...contentData, seasons: newSeasons});
                              }}
                              className="absolute right-2 top-2 bg-red-600 hover:bg-red-500 rounded w-6 h-6 flex items-center justify-center text-white"
                            >
                              <FaTimes size={10} />
                            </button>
                            <input type="text" placeholder="Episode Title" value={ep.title} onChange={e => {
                              const newSeasons = [...contentData.seasons];
                              newSeasons[sIdx].episodes[eIdx].title = e.target.value;
                              setContentData({...contentData, seasons: newSeasons});
                            }} className="bg-[#222] border border-gray-700 rounded p-2 text-sm w-full" required />
                            
                            <input type="text" placeholder="Duration (e.g. 45m)" value={ep.duration} onChange={e => {
                              const newSeasons = [...contentData.seasons];
                              newSeasons[sIdx].episodes[eIdx].duration = e.target.value;
                              setContentData({...contentData, seasons: newSeasons});
                            }} className="bg-[#222] border border-gray-700 rounded p-2 text-sm w-full" required />
                            
                            <textarea placeholder="Description" value={ep.description} onChange={e => {
                              const newSeasons = [...contentData.seasons];
                              newSeasons[sIdx].episodes[eIdx].description = e.target.value;
                              setContentData({...contentData, seasons: newSeasons});
                            }} className="bg-[#222] border border-gray-700 rounded p-2 text-sm w-full md:col-span-2" rows="2" />
                            
                            <input type="text" placeholder="Drive Video Link" value={ep.driveVideoId} onChange={e => {
                              const newSeasons = [...contentData.seasons];
                              newSeasons[sIdx].episodes[eIdx].driveVideoId = e.target.value;
                              setContentData({...contentData, seasons: newSeasons});
                            }} className="bg-[#222] border border-blue-900/50 rounded p-2 text-sm w-full" required />
                            
                            <input type="text" placeholder="Drive Image Link (Optional)" value={ep.driveImageId} onChange={e => {
                              const newSeasons = [...contentData.seasons];
                              newSeasons[sIdx].episodes[eIdx].driveImageId = e.target.value;
                              setContentData({...contentData, seasons: newSeasons});
                            }} className="bg-[#222] border border-blue-900/50 rounded p-2 text-sm w-full" />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-4 md:p-6 border-t border-gray-800 bg-[#181818] flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-gray-300 hover:text-white w-full sm:w-auto text-center">Cancel</button>
              <button form="content-form" type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-10 rounded shadow-lg w-full sm:w-auto text-center">Save</button>
            </div>

          </div>
        </div>
      )}

      {/* ======================= CATEGORY MODAL ======================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/80 backdrop-blur-sm p-0 md:p-4">
          <div className="w-full h-full md:h-auto max-w-2xl bg-[#181818] rounded-none md:rounded-xl shadow-2xl flex flex-col border-0 md:border border-gray-800 overflow-hidden max-h-screen md:max-h-[90vh]">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-800 bg-[#222]">
              <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                <FaLayerGroup className="text-red-600" /> {categoryIdToEdit ? 'Edit Category' : 'Create New Category'}
              </h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-white bg-[#333] p-2 rounded-full"><FaTimes size={16} /></button>
            </div>
            
            <div className="p-4 md:p-6 overflow-y-auto">
              <form onSubmit={handleAddCategory}>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Category Name</label>
                  <input type="text" placeholder="e.g. Action Movies..." value={catName} onChange={e => setCatName(e.target.value)} className="w-full bg-[#222] border border-gray-700 rounded p-3 text-white focus:border-red-500" required />
                </div>
                
                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-400 mb-3">Show this category in:</label>
                  <div className="flex flex-wrap gap-4 sm:gap-6">
                    {['home', 'movie', 'tvseries'].map(sec => (
                      <label key={sec} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="hidden" checked={catSections.includes(sec)} onChange={() => handleSectionToggle(sec)} />
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${catSections.includes(sec) ? 'bg-red-600 border-red-600' : 'bg-transparent border-gray-600 group-hover:border-gray-400'}`}>
                          {catSections.includes(sec) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className="capitalize font-medium text-gray-300 text-sm sm:text-base">{sec === 'tvseries' ? 'TV Series' : sec}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="flex items-start sm:items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="hidden" checked={isCatLargeRow} onChange={e => setIsCatLargeRow(e.target.checked)} />
                    <div className={`w-5 h-5 mt-1 sm:mt-0 rounded border flex items-center justify-center shrink-0 ${isCatLargeRow ? 'bg-blue-600 border-blue-600' : 'bg-transparent border-gray-600 group-hover:border-gray-400'}`}>
                      {isCatLargeRow && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <div>
                      <span className="font-bold text-white block text-sm sm:text-base">Use Numbered UI (Large Row)</span>
                      <span className="text-xs text-gray-400 leading-tight block mt-1">Enable this to show large numbers (1, 2, 3...) next to items (e.g. for "Top 10" sections).</span>
                    </div>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-8 pt-6 border-t border-gray-800">
                  <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-6 py-3 font-bold text-gray-400 hover:text-white w-full sm:w-auto text-center">Cancel</button>
                  <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded shadow-lg w-full sm:w-auto text-center">
                    {categoryIdToEdit ? 'Update Category' : 'Save Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ======================= CREATE BANNER MODAL ======================= */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/80 backdrop-blur-sm p-0 md:p-4">
          <div className="w-full h-full md:h-auto max-w-2xl bg-[#181818] rounded-none md:rounded-xl shadow-2xl flex flex-col border-0 md:border border-gray-800 overflow-hidden max-h-screen md:max-h-[90vh]">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-800 bg-[#222]">
              <h2 className="text-lg md:text-xl font-bold">{bannerData._id ? 'Edit' : 'Create'} Banner</h2>
              <button onClick={() => setIsBannerModalOpen(false)} className="text-gray-400 hover:text-white bg-[#333] p-2 rounded-full"><FaTimes size={16} /></button>
            </div>
            
            <div className="p-4 md:p-6 overflow-y-auto">
              <form id="banner-form" onSubmit={handleBannerSubmit} className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-400 mb-1 md:mb-2">Show on Pages</label>
                  <div className="flex flex-wrap gap-4 sm:gap-6">
                    {['home', 'movies', 'tvseries'].map(page => (
                      <label key={page} className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="hidden" checked={bannerData.pages?.includes(page) || false} onChange={() => handleBannerPageToggle(page)} />
                        <div className={`w-4 h-4 md:w-5 md:h-5 rounded border flex items-center justify-center shrink-0 ${bannerData.pages?.includes(page) ? 'bg-red-600 border-red-600' : 'bg-transparent border-gray-600 group-hover:border-gray-400'}`}>
                          {bannerData.pages?.includes(page) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className="capitalize font-medium text-gray-300 text-sm">{page === 'tvseries' ? 'TV Series' : page}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-400 mb-1 md:mb-2">Link to Movie / Series</label>
                  <select value={bannerData.movie ? (typeof bannerData.movie === 'object' ? bannerData.movie._id : bannerData.movie) : ''} onChange={e => setBannerData({...bannerData, movie: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded p-2 md:p-3 text-sm md:text-base text-white" required>
                    <option value="">-- Select a Movie/Series --</option>
                    {movies.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-400 mb-1 md:mb-2">Banner Title</label>
                  <input type="text" value={bannerData.title} onChange={e => setBannerData({...bannerData, title: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded p-2 md:p-3 text-sm md:text-base text-white" required />
                </div>
                
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-400 mb-1 md:mb-2">Subtitle</label>
                  <input type="text" value={bannerData.subtitle} onChange={e => setBannerData({...bannerData, subtitle: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded p-2 md:p-3 text-sm md:text-base text-white" required />
                </div>
                
                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-400 mb-1 md:mb-2">Description</label>
                  <textarea rows="2" value={bannerData.description} onChange={e => setBannerData({...bannerData, description: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded p-2 md:p-3 text-sm md:text-base text-white" required />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-bold text-gray-400 mb-1 md:mb-2">Background Image (Drive Public Link)</label>
                  <input type="text" value={bannerData.bgImage} onChange={e => setBannerData({...bannerData, bgImage: e.target.value})} className="w-full bg-[#111] border border-gray-700 rounded p-2 md:p-3 text-sm md:text-base text-white" required />
                </div>
              </form>
            </div>

            <div className="p-4 md:p-6 border-t border-gray-800 bg-[#222] flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <button onClick={() => setIsBannerModalOpen(false)} className="px-6 py-3 font-bold text-gray-400 hover:text-white w-full sm:w-auto text-center">Cancel</button>
              <button form="banner-form" type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded shadow-lg w-full sm:w-auto text-center">Save Banner</button>
            </div>
          </div>
        </div>
      )}

      {/* HISTORY MODAL */}
      {historyUser && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-0 md:p-4 overflow-y-auto">
          <div className="bg-[#141414] border-0 md:border border-gray-800 rounded-none md:rounded-lg w-full h-full md:h-auto max-w-lg shadow-2xl flex flex-col md:max-h-[95vh]">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-800">
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <FaHistory className="text-red-600" /> Watch History
              </h2>
              <button onClick={() => setHistoryUser(null)} className="text-gray-400 hover:text-white bg-[#333] p-2 rounded-full">
                <FaTimes size={16} />
              </button>
            </div>
            
            <div className="p-4 md:p-6 overflow-y-auto flex-1">
              <div className="mb-4">
                <span className="text-gray-400">User:</span> <span className="font-bold text-white">{historyUser.displayName || historyUser.email}</span>
              </div>
              
              {(!historyUser.watchHistory || historyUser.watchHistory.length === 0) ? (
                <div className="text-center text-gray-500 py-10 italic">No watch history found for this user.</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {historyUser.watchHistory.map((item, i) => (
                    <div key={i} className="bg-[#1f1f1f] border border-gray-800 rounded p-4 flex flex-col gap-1">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-red-500">{item.title}</span>
                        <span className="text-xs text-gray-500 bg-[#111] px-2 py-1 rounded capitalize">{item.type}</span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {new Date(item.viewedAt).toLocaleDateString()} at {new Date(item.viewedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-800 bg-[#222] flex justify-end">
              <button onClick={() => setHistoryUser(null)} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 font-bold text-white rounded">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;

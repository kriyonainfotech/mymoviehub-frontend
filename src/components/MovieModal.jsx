import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaPlay, FaPlus, FaThumbsUp, FaTimes, FaChevronDown } from 'react-icons/fa';
import { getDriveDirectLink } from './Row';
import axios from 'axios';

const MovieModal = ({ movie: initialMovie, onClose, onPlay }) => {
  const [currentMovie, setCurrentMovie] = useState(initialMovie);
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    setCurrentMovie(initialMovie);
    setSelectedSeasonIndex(0);
    setImageLoading(true);
  }, [initialMovie]);

  useEffect(() => {
    const container = document.getElementById('movie-modal-container');
    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentMovie]);

  useEffect(() => {
    // Disable background scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    // Fetch similar movies
    const fetchSimilar = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + '/api/admin/movies');
        const allMovies = res.data;
        const filtered = allMovies.filter(m => m.type === currentMovie.type && m._id !== currentMovie._id);
        // Shuffle array
        for (let i = filtered.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
        }
        setSimilarMovies(filtered.slice(0, 10));
      } catch (err) {
        console.error('Failed to fetch similar movies', err);
      }
    };
    fetchSimilar();

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [currentMovie._id, currentMovie.type]);

  if (!currentMovie) return null;

  const handleMovieChange = (newMovie) => {
    setIsAnimating(true);
    setTimeout(() => {
      setImageLoading(true);
      setCurrentMovie(newMovie);
      setSelectedSeasonIndex(0);
      setIsAnimating(false);
    }, 300);
  };

  return createPortal(
    <div id="movie-modal-container" className="fixed inset-0 z-[9998] overflow-y-scroll overflow-x-hidden bg-black/80 scrollbar-hide md:pt-10 md:pb-20 md:px-4">
      <div className={`relative bg-[#181818] w-full max-w-4xl mx-auto md:rounded-xl shadow-2xl h-max pb-10 transition-all duration-300 transform ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-50 bg-[#181818]/60 backdrop-blur-md rounded-full p-2 text-white hover:bg-neutral-800 transition"
        >
          <FaTimes size={24} />
        </button>

        {/* Hero Section */}
        <div className="relative w-full h-[40vh] md:h-[60vh]">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent z-10" />
          <img src={getDriveDirectLink(currentMovie.driveLargeImageId || currentMovie.driveImageId)} alt={currentMovie.title} className="w-full h-full object-cover md:rounded-t-xl" />
          
          <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 z-20 w-[calc(100%-2rem)] max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 uppercase drop-shadow-lg">{currentMovie.title}</h1>
            <div className="flex gap-3 md:gap-4">
              <button 
                onClick={() => {
                  if (currentMovie.type === 'tvseries' && currentMovie.seasons?.[0]?.episodes?.[0] && !currentMovie.driveVideoId) {
                    onPlay(currentMovie.seasons[0].episodes[0]);
                  } else {
                    onPlay(currentMovie);
                  }
                }} 
                className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-white text-black font-bold px-6 py-2 md:py-3 rounded hover:bg-neutral-300 transition"
              >
                <FaPlay size={18} /> Play
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  let currentList = JSON.parse(localStorage.getItem('myList')) || [];
                  if (currentList.find(m => m._id === currentMovie._id)) {
                    currentList = currentList.filter(m => m._id !== currentMovie._id);
                  } else {
                    currentList.push(currentMovie);
                  }
                  localStorage.setItem('myList', JSON.stringify(currentList));
                  alert(currentList.find(m => m._id === currentMovie._id) ? 'Added to My List!' : 'Removed from My List');
                }} 
                className="flex items-center justify-center bg-transparent border-2 border-gray-400 text-white w-10 h-10 md:w-12 md:h-12 rounded-full hover:border-white transition"
              >
                <FaPlus size={16} />
              </button>
              <button onClick={(e) => {
                e.stopPropagation();
                const currentLiked = JSON.parse(localStorage.getItem('likedMovies')) || [];
                if (!currentLiked.find(m => m._id === currentMovie._id)) {
                  localStorage.setItem('likedMovies', JSON.stringify([...currentLiked, currentMovie]));
                  alert(`You liked ${currentMovie.title}!`);
                } else {
                  alert(`${currentMovie.title} is already in your Liked Movies.`);
                }
              }} className="flex items-center justify-center bg-transparent border-2 border-gray-400 text-white w-10 h-10 md:w-12 md:h-12 rounded-full hover:border-white transition">
                <FaThumbsUp size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="px-4 md:px-4 md:px-10 py-4 text-white flex flex-col md:flex-row gap-4 md:gap-8">
          <div className="w-full md:w-2/3">
            <div className="flex items-center gap-2 mb-4 font-bold text-sm">
              <span className="text-white">{currentMovie.year}</span>
              <span>{currentMovie.durationOrSeasons}</span>
              <span className="border border-gray-500 px-1 text-xs rounded">HD</span>
            </div>
            {currentMovie.ageRating && <div className="border border-gray-600 px-2 py-1 text-xs inline-block mb-4 rounded">{currentMovie.ageRating}</div>}
            <p className="text-base text-gray-200 mb-6 leading-relaxed">
              {currentMovie.description}
            </p>
          </div>
          
          <div className="w-full md:w-1/3 text-sm text-gray-400 flex flex-col gap-3">
            <div>
              <span className="text-gray-500">Cast: </span>
              <span className="text-gray-300">{currentMovie.cast?.length ? currentMovie.cast.join(', ') : 'Unknown'}</span>
            </div>
            <div>
              <span className="text-gray-500">Genres: </span>
              <span className="text-gray-300">{currentMovie.genres?.length ? currentMovie.genres.join(', ') : 'Unknown'}</span>
            </div>
          </div>
        </div>

        {/* Episodes Section - Only show for series */}
        {currentMovie.type === 'tvseries' && currentMovie.seasons && currentMovie.seasons.length > 0 && (
          <div className="px-4 md:px-10 mt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Episodes</h3>
              
              <div className="relative">
                <select 
                  value={selectedSeasonIndex}
                  onChange={(e) => setSelectedSeasonIndex(Number(e.target.value))}
                  className="appearance-none bg-neutral-800 text-white px-4 py-2 pr-8 rounded text-sm font-medium border border-neutral-600 focus:outline-none cursor-pointer"
                >
                  {currentMovie.seasons.map((season, idx) => (
                    <option key={idx} value={idx}>{season.name} ({season.episodes?.length || 0} EP)</option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" size={12} />
              </div>
            </div>
            
            <div className="flex flex-col border-b border-neutral-700 pb-4">
              {currentMovie.seasons[selectedSeasonIndex]?.episodes?.map((ep, i) => (
                <div key={ep._id || i} className="flex items-center p-4 border-b border-neutral-800 hover:bg-neutral-800 cursor-pointer rounded transition" onClick={() => onPlay(ep)}>
                  <div className="text-2xl text-neutral-400 w-12 font-medium">{i + 1}</div>
                  <div className="relative w-32 h-20 flex-shrink-0 rounded overflow-hidden mr-4">
                    <img src={ep.driveImageId ? getDriveDirectLink(ep.driveImageId) : getDriveDirectLink(currentMovie.driveImageId)} alt={ep.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex justify-center items-center opacity-0 hover:opacity-100 bg-black/40">
                      <FaPlay size={24} className="text-white border rounded-full p-1 border-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <h4 className="text-white font-bold">{ep.title}</h4>
                      <span className="text-neutral-400 text-sm">{ep.duration}</span>
                    </div>
                    <p className="text-neutral-400 text-sm line-clamp-2">{ep.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* More Like This Section */}
        {similarMovies.length > 0 && (
          <div className="px-4 md:px-10 mt-10">
            <h3 className="text-2xl font-bold text-white mb-6">More Like This</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {similarMovies.map(sm => (
                <div key={sm._id} onClick={() => handleMovieChange(sm)} className="bg-[#2f2f2f] rounded overflow-hidden cursor-pointer hover:bg-[#404040] transition">
                  <div className="relative h-36">
                    <img src={getDriveDirectLink(sm.driveImageId)} alt={sm.title} className="w-full h-full object-cover" />
                    {sm.durationOrSeasons && (
                      <span className="absolute top-2 right-2 font-bold text-sm text-white drop-shadow-md">
                        {sm.durationOrSeasons}
                      </span>
                    )}
                    <FaPlay onClick={(e) => { e.stopPropagation(); onPlay(sm); }} size={30} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition text-white border border-white rounded-full p-2" />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        {sm.ageRating && <span className="border border-neutral-500 px-1 rounded text-xs text-neutral-300">{sm.ageRating}</span>}
                        <span className="text-xs text-neutral-300">{sm.year}</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          let currentList = JSON.parse(localStorage.getItem('myList')) || [];
                          if (currentList.length >= 32) return alert('List is full (Max 32 allow)');
                          if (currentList.find(m => m._id === sm._id)) {
                            currentList = currentList.filter(m => m._id !== sm._id);
                            alert('Removed from My List');
                          } else {
                            currentList.push(sm);
                            alert('Added to My List!');
                          }
                          localStorage.setItem('myList', JSON.stringify(currentList));
                        }}
                        className="border-2 border-neutral-400 text-white w-8 h-8 flex items-center justify-center rounded-full hover:border-white transition shadow-md"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>
                    <p className="text-neutral-400 text-sm line-clamp-4">{sm.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About Section */}
        <div className="px-4 md:px-10 py-8 border-t border-neutral-700 mt-10">
          <h3 className="text-2xl font-normal text-white mb-6">
            <span className="font-bold">About</span> {currentMovie.title}
          </h3>
          
          <div className="text-sm space-y-3">
            <div className="flex">
              <span className="text-gray-500 w-32 flex-shrink-0">Director:</span>
              <span className="text-gray-300">{currentMovie.director || 'Unknown'}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-32 flex-shrink-0">Writer:</span>
              <span className="text-gray-300">{currentMovie.writer || 'Unknown'}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-32 flex-shrink-0">Cast:</span>
              <span className="text-gray-300">{currentMovie.cast?.length ? currentMovie.cast.join(', ') : 'Unknown'}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-32 flex-shrink-0">Genres:</span>
              <span className="text-gray-300">{currentMovie.genres?.length ? currentMovie.genres.join(', ') : 'Unknown'}</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-500 w-32 flex-shrink-0 mt-1">Maturity rating:</span>
              <div className="text-gray-300">
                <div className="flex items-center gap-2 mb-1">
                  {currentMovie.ageRating && <span className="border border-gray-500 px-1 py-0.5 text-xs rounded inline-block">{currentMovie.ageRating}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default MovieModal;

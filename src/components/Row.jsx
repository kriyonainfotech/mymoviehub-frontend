import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaPlus, FaThumbsUp, FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import VideoPlayer from './VideoPlayer';

// Helper function to convert Google Drive view link to direct image link
export const getDriveDirectLink = (url) => {
  if (!url) return '';
  // Extract ID from formats like /d/ID or ?id=ID
  const match = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    // Route it through our own backend proxy to 100% bypass Chrome's cross-origin blocking!
    return import.meta.env.VITE_API_URL + `/api/image-proxy?id=${match[1]}`;
  }
  return url;
};

const Row = ({ title, isLargeRow, movies }) => {
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [playingMovie, setPlayingMovie] = useState(null);
  const [isHoveredRow, setIsHoveredRow] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);

  const handleScrollLeft = () => {
    setSliderIndex(prev => Math.max(0, prev - 1));
  };

  const handleScrollRight = () => {
    // Show approx 5-6 items per screen, so max index is around 2
    setSliderIndex(prev => Math.min(2, prev + 1));
  };

  const handleAddToList = (e, movie) => {
    e.stopPropagation();
    let currentList = JSON.parse(localStorage.getItem('myList')) || [];
    if (currentList.length >= 32) return alert('List is full (Max 32 allow)');
    if (currentList.find(m => m._id === movie._id)) {
      // Remove it
      currentList = currentList.filter(m => m._id !== movie._id);
    } else {
      // Add it
      currentList.push(movie);
    }
    localStorage.setItem('myList', JSON.stringify(currentList));
    // Hack to force re-render across components isn't trivial without Context, 
    // but we can just use a local state or let user see next time they hover.
    // For simplicity, we just alert or silently succeed.
    alert(currentList.find(m => m._id === movie._id) ? 'Added to My List!' : 'Removed from My List');
  };

  return (
    <div 
      className={`ml-4 md:ml-12 mt-6 text-white relative transition-all duration-300 ${isHoveredRow ? 'z-[60]' : 'z-10'} mb-8`}
      onMouseEnter={() => setIsHoveredRow(true)}
      onMouseLeave={() => setIsHoveredRow(false)}
    >
      <h2 className="text-xl font-bold mb-2 md:mb-4">{title}</h2>
      
      <div className="relative group/slider">
        {/* Left Arrow */}
        {sliderIndex > 0 && (
          <div 
            className="absolute left-0 top-0 bottom-0 w-12 bg-black/60 z-[70] flex items-center justify-center cursor-pointer opacity-0 group-hover/slider:opacity-100 transition-opacity -ml-12"
            onClick={handleScrollLeft}
          >
            <FaChevronLeft size={24} />
          </div>
        )}

        {/* Right Arrow */}
        {sliderIndex < 2 && (
          <div 
            className="absolute right-0 top-0 bottom-0 w-12 bg-black/60 z-[70] flex items-center justify-center cursor-pointer opacity-0 group-hover/slider:opacity-100 transition-opacity"
            onClick={handleScrollRight}
          >
            <FaChevronRight size={24} />
          </div>
        )}

        {/* Slider Container - No native scroll, pure transform */}
        <div className="relative w-full overflow-visible">
          <div 
            className="flex space-x-3 transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(calc(-${sliderIndex * 85}%))` }}
          >
            {movies.map((movie, i) => (
              <React.Fragment key={movie._id || i}>
                <div 

                key={movie._id || i}
                className={`relative flex-shrink-0 cursor-pointer group rounded-md ${
                  isLargeRow ? 'w-[150px] md:w-[220px]' : 'w-[200px] md:w-[280px]'
                }`}
              >
                {isLargeRow && (
                  <span className="absolute -left-4 md:-left-6 bottom-0 text-[100px] md:text-[140px] font-black text-black" style={{ 
                    WebkitTextStroke: '2px #fff', 
                    lineHeight: '0.8',
                    zIndex: 1
                  }}>
                    {i + 1}
                  </span>
                )}
                
                {/* Base Image and Overlays */}
                <div className="relative w-full h-full">
                  <img 
                    src={isLargeRow ? getDriveDirectLink(movie.driveLargeImageId || movie.driveImageId) : getDriveDirectLink(movie.driveImageId)} 
                    alt={movie.title}
                    onClick={() => navigate('/movie/' + movie._id)}
                    className={`rounded-md object-cover w-full transition-transform duration-300 ${isLargeRow ? 'h-[225px] md:h-[330px] ml-6' : 'h-[112px] md:h-[157px]'}`}
                  />
                  
                  {/* Rating Badge */}
                  {movie.rating && (
                    <div className={`absolute top-2 right-2 bg-black/70 border border-yellow-500/50 text-yellow-500 text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1 z-10 ${isLargeRow ? 'mr-[-24px]' : ''}`}>
                      <span>★</span>
                      <span>{movie.rating}</span>
                    </div>
                  )}

                  {/* Always Visible Details Overlay */}
                  <div 
                    onClick={() => navigate('/movie/' + movie._id)}
                    className={`flex absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-20 flex-col justify-end p-2 md:p-4 rounded-md cursor-pointer ${isLargeRow ? 'ml-6' : ''}`}
                  >
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (movie.type === 'tvseries' && movie.seasons?.[0]?.episodes?.[0] && !movie.driveVideoId) {
                          setPlayingMovie(movie.seasons[0].episodes[0]);
                        } else {
                          setPlayingMovie(movie);
                        }
                      }} 
                      className="bg-white text-black w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-gray-300 transition shadow-md mb-1 md:mb-2"
                    >
                      <FaPlay size={10} className="ml-1 md:ml-1 md:size-[12px]" />
                    </button>
                    <h3 className="text-white font-bold text-xs md:text-sm leading-tight truncate">{movie.title}</h3>
                    <p className="text-neutral-300 text-[10px] md:text-xs mt-0.5">{movie.year || movie.releaseYear || ''}</p>
                  </div>
                </div>
              </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {playingMovie && (
        <VideoPlayer movie={playingMovie} onClose={() => setPlayingMovie(null)} />
      )}
    </div>
  );
};

export default Row;

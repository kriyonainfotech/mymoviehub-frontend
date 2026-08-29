import React, { useState } from 'react';
import { FaPlay, FaPlus, FaThumbsUp, FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MovieModal from './MovieModal';
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
                
                {/* Base Image */}
                <img 
                  src={isLargeRow ? getDriveDirectLink(movie.driveLargeImageId || movie.driveImageId) : getDriveDirectLink(movie.driveImageId)} 
                  alt={movie.title}
                  onClick={() => setSelectedMovie(movie)}
                  className={`rounded-md object-cover w-full transition-transform duration-300 ${
                    isLargeRow ? 'h-[225px] md:h-[330px] ml-6 group-hover:opacity-0' : 'h-[112px] md:h-[157px] group-hover:opacity-0'
                  }`}
                />

                {/* Hover Card (appears on hover) */}
                <div className="absolute top-0 left-0 w-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 delay-300 z-[100] transform group-hover:scale-125 bg-[#141414] rounded-md shadow-2xl origin-center pointer-events-none group-hover:pointer-events-auto border border-neutral-700/50">
                  <img 
                    src={getDriveDirectLink(movie.driveImageId)} 
                    alt={movie.title}
                    onClick={() => setSelectedMovie(movie)}
                    className={`rounded-t-md object-cover w-full ${isLargeRow ? 'h-[150px]' : 'h-[112px] md:h-[157px]'}`}
                  />
                  
                  <div className="p-4 bg-[#141414] rounded-b-md">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (movie.type === 'tvseries' && movie.seasons?.[0]?.episodes?.[0] && !movie.driveVideoId) {
                              setPlayingMovie(movie.seasons[0].episodes[0]);
                            } else {
                              setPlayingMovie(movie);
                            }
                          }} 
                          className="bg-white text-black w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-300 transition shadow-md"
                        >
                          <FaPlay size={12} className="ml-1" />
                        </button>
                        <button onClick={(e) => handleAddToList(e, movie)} className="border-2 border-neutral-400 text-white w-8 h-8 flex items-center justify-center rounded-full hover:border-white hover:bg-white/20 transition shadow-md">
                          <FaPlus size={12} />
                        </button>
                        <button onClick={(e) => {
                          e.stopPropagation();
                          const currentLiked = JSON.parse(localStorage.getItem('likedMovies')) || [];
                          if (!currentLiked.find(m => m._id === movie._id)) {
                            localStorage.setItem('likedMovies', JSON.stringify([...currentLiked, movie]));
                            alert(`You liked ${movie.title}!`);
                          } else {
                            alert(`${movie.title} is already in your Liked Movies.`);
                          }
                        }} className="border-2 border-neutral-400 text-white w-8 h-8 flex items-center justify-center rounded-full hover:border-white hover:bg-white/20 transition shadow-md">
                          <FaThumbsUp size={12} />
                        </button>
                      </div>
                      <button 
                        onClick={() => setSelectedMovie(movie)}
                        className="border-2 border-neutral-400 text-white p-2 rounded-full hover:border-white transition shadow-md"
                      >
                        <FaChevronDown size={14} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs font-bold mb-2">
                      {movie.ageRating && <span className="border border-neutral-500 px-1 rounded text-neutral-300">{movie.ageRating}</span>}
                      <span className="text-neutral-300">{movie.durationOrSeasons}</span>
                      <span className="border border-neutral-500 px-1 rounded text-[10px] text-neutral-300">HD</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      {movie.genres && movie.genres.slice(0, 3).map((genre, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span>{genre}</span>
                          {idx < Math.min(movie.genres.length, 3) - 1 && <span className="w-1 h-1 bg-neutral-500 rounded-full"></span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>


              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} onPlay={(ep) => setPlayingMovie(ep || selectedMovie)} />
      )}
      
      {playingMovie && (
        <VideoPlayer movie={playingMovie} onClose={() => setPlayingMovie(null)} />
      )}
    </div>
  );
};

export default Row;

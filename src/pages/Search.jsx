import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getDriveDirectLink } from '../components/Row';
import { FaPlay, FaPlus, FaThumbsUp, FaChevronDown } from 'react-icons/fa';

const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [playingMovie, setPlayingMovie] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + '/api/admin/movies');
        setMovies(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter(movie => {
    const searchStr = query.toLowerCase();
    const titleMatch = movie.title?.toLowerCase().includes(searchStr);
    
    // Convert arrays to strings if they are arrays, else just use the string
    const genresStr = Array.isArray(movie.genres) ? movie.genres.join(' ') : (movie.genres || '');
    const genresMatch = genresStr.toLowerCase().includes(searchStr);
    
    const castStr = Array.isArray(movie.cast) ? movie.cast.join(' ') : (movie.cast || '');
    const castMatch = castStr.toLowerCase().includes(searchStr);

    return titleMatch || genresMatch || castMatch;
  });

  const handleAddToList = (e, movie) => {
    e.stopPropagation();
    // Placeholder for My List logic
    alert(`Added ${movie.title} to My List!`);
  };

  return (
    <div className="pt-24 px-4 md:px-12 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-400">
          {query ? (
            <>Search results for: <span className="text-white">"{query}"</span></>
          ) : (
            'Type something to search...'
          )}
        </h1>
      </div>

      {loading ? (
        <div className="text-center mt-20 text-xl text-gray-500">Loading...</div>
      ) : !query ? (
        <div className="text-center mt-20">
          <p className="text-xl text-gray-500">Find your favorite Movies and TV Series.</p>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-xl text-gray-500">No matching results found.</p>
          <p className="text-sm text-gray-600 mt-2">Try different keywords or check spelling.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12">
          {filteredMovies.map(movie => (
            <div 
              key={movie._id} 
              className="relative aspect-video rounded-md cursor-pointer group"
            >
              <img 
                src={getDriveDirectLink(movie.driveImageId)} 
                alt={movie.title}
                className="w-full h-full object-cover rounded-md"
                loading="lazy"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x168?text=No+Image' }}
              />

              {/* Hover Card */}
              <div className="absolute top-0 left-0 w-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 delay-300 z-50 transform group-hover:scale-125 bg-[#141414] rounded-md shadow-2xl origin-center pointer-events-none group-hover:pointer-events-auto border border-neutral-700/50">
                <img 
                  src={getDriveDirectLink(movie.driveImageId)} 
                  alt={movie.title}
                  onClick={() => navigate('/movie/' + movie._id)}
                  className="rounded-t-md object-cover w-full aspect-video"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300x168?text=No+Image' }}
                />
                
                <div className="p-4 bg-[#141414] rounded-b-md text-left">
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
                      onClick={() => navigate('/movie/' + movie._id)}
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
                    {Array.isArray(movie.genres) && movie.genres.slice(0, 3).map((genre, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span>{genre}</span>
                        {idx < Math.min(movie.genres.length, 3) - 1 && <span className="w-1 h-1 bg-neutral-500 rounded-full"></span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      
      
      {playingMovie && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center">
          <button 
            className="absolute top-5 right-5 text-white hover:text-gray-300 z-10 p-2 rounded-full bg-black/50"
            onClick={() => setPlayingMovie(null)}
          >
            Close
          </button>
          <div className="w-full h-full max-w-6xl max-h-[80vh] bg-black">
            <iframe
              src={getDriveDirectLink(playingMovie.driveVideoId || playingMovie.videoFileLink)}
              className="w-full h-full border-none"
              allow="autoplay; fullscreen"
              title="Video Player"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;

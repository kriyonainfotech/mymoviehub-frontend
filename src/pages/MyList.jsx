import { useState, useEffect } from 'react';
import { getDriveDirectLink } from '../components/Row';
import { useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import AdsterraAd from '../components/AdsterraAd';
import { FaPlay, FaTimes, FaThumbsUp, FaChevronDown } from 'react-icons/fa';

const MyList = () => {
  const navigate = useNavigate();
  const [myMovies, setMyMovies] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [playingMovie, setPlayingMovie] = useState(null);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('myList')) || [];
    setMyMovies(list);
    
    const liked = JSON.parse(localStorage.getItem('likedMovies')) || [];
    setLikedMovies(liked);
  }, []);

  const removeFromList = (e, movieId) => {
    e.stopPropagation();
    const currentList = JSON.parse(localStorage.getItem('myList')) || [];
    const updatedList = currentList.filter(m => m._id !== movieId);
    localStorage.setItem('myList', JSON.stringify(updatedList));
    setMyMovies(updatedList);
  };
  
  const removeFromLiked = (e, movieId) => {
    e.stopPropagation();
    const currentLiked = JSON.parse(localStorage.getItem('likedMovies')) || [];
    const updatedLiked = currentLiked.filter(m => m._id !== movieId);
    localStorage.setItem('likedMovies', JSON.stringify(updatedLiked));
    setLikedMovies(updatedLiked);
  };

  return (
    <div className="pt-28 px-4 md:px-12 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-2">My WatchList</h1>
      <p className="text-green-500 font-bold mb-8">Max 32 Allow</p>

      <div className="hidden md:block">
        <AdsterraAd width={728} height={90} adKey="3e52a7de4f64eb578996bc017ab9863c" />
      </div>
      <div className="md:hidden">
        <AdsterraAd width={320} height={50} adKey="b06804870a5a3c679877784e41216b13" />
      </div>
      
      {myMovies.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-xl text-gray-500">Your WatchList is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12">
          {myMovies.map((movie) => (
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
                      <button 
                        onClick={(e) => removeFromList(e, movie._id)}
                        className="border-2 border-neutral-400 text-white w-8 h-8 flex items-center justify-center rounded-full hover:border-white hover:bg-white/20 transition shadow-md"
                        title="Remove from My List"
                      >
                        <FaTimes size={12} />
                      </button>
                      <button onClick={(e) => {
                        e.stopPropagation();
                        const currentLiked = JSON.parse(localStorage.getItem('likedMovies')) || [];
                        if (!currentLiked.find(m => m._id === movie._id)) {
                          localStorage.setItem('likedMovies', JSON.stringify([...currentLiked, movie]));
                          setLikedMovies([...currentLiked, movie]);
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
      


      
      <div className="mt-16">
        <h1 className="text-3xl font-bold text-white mb-8">Liked Movies & TV</h1>
        
        {likedMovies.length === 0 ? (
          <div className="text-center mt-10 mb-20">
            <p className="text-xl text-gray-500">You haven't liked any titles yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12 mb-20">
            {likedMovies.map((movie) => (
              <div key={movie._id} className="relative aspect-video rounded-md cursor-pointer group">
                <img src={getDriveDirectLink(movie.driveImageId)} alt={movie.title} className="w-full h-full object-cover rounded-md" loading="lazy" onError={(e) => { e.target.src = 'https://via.placeholder.com/300x168?text=No+Image' }} />
                
                {/* Hover Card */}
                <div className="absolute top-0 left-0 w-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 delay-300 z-50 transform group-hover:scale-125 bg-[#141414] rounded-md shadow-2xl origin-center pointer-events-none group-hover:pointer-events-auto border border-neutral-700/50">
                  <img src={getDriveDirectLink(movie.driveImageId)} alt={movie.title} onClick={() => navigate('/movie/' + movie._id)} className="rounded-t-md object-cover w-full aspect-video" onError={(e) => { e.target.src = 'https://via.placeholder.com/300x168?text=No+Image' }} />
                  <div className="p-4 bg-[#141414] rounded-b-md text-left">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); if (movie.type === 'tvseries' && movie.seasons?.[0]?.episodes?.[0] && !movie.driveVideoId) { setPlayingMovie(movie.seasons[0].episodes[0]); } else { setPlayingMovie(movie); } }} className="bg-white text-black w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-300 transition shadow-md">
                          <FaPlay size={12} className="ml-1" />
                        </button>
                        <button onClick={(e) => removeFromLiked(e, movie._id)} className="border-2 border-neutral-400 text-white w-8 h-8 flex items-center justify-center rounded-full hover:border-white hover:bg-white/20 transition shadow-md" title="Remove from Liked">
                          <FaTimes size={12} />
                        </button>
                      </div>
                      <button onClick={() => navigate('/movie/' + movie._id)} className="border-2 border-neutral-400 text-white p-2 rounded-full hover:border-white transition shadow-md">
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
      </div>

      
      
      {playingMovie && (
        <VideoPlayer movie={playingMovie} onClose={() => setPlayingMovie(null)} />
      )}
    </div>
  );
};

export default MyList;

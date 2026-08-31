import { useState, useEffect } from 'react';
import { FaPlay, FaPlus, FaThumbsUp, FaChevronDown } from 'react-icons/fa';
import { getDriveDirectLink } from '../components/Row';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import axios from 'axios';
import AdsterraAd from '../components/AdsterraAd';

const formatText = (text) => {
  if (!text) return 'Unknown';
  if (Array.isArray(text)) return text.join(', ');
  if (typeof text !== 'string') text = String(text);
  return text.replace(/([a-z])([A-Z])/g, '$1, $2');
};

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentMovie, setCurrentMovie] = useState(null);
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [playingMovie, setPlayingMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0,0);
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await axios.get(import.meta.env.VITE_API_URL + '/api/admin/movies');
        const found = res.data.find(m => m._id === id);
        if(found) {
          setCurrentMovie(found);
          setSelectedSeasonIndex(0);
          setImageLoading(true);
          
          // Fetch similar
          const filtered = res.data.filter(m => m.type === found.type && m._id !== found._id);
          for (let i = filtered.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
          }
          setSimilarMovies(filtered.slice(0, 10));
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const handleMovieChange = (m) => {
    navigate('/movie/' + m._id);
  };

  if (loading) return <div className='min-h-screen pt-20 text-center text-white bg-[#141414]'>Loading...</div>;
  if (!currentMovie) return <div className='min-h-screen pt-20 text-center text-white bg-[#141414]'>Movie not found</div>;

  return (
    <div className="pt-16 md:pt-24 min-h-screen bg-[#0e0e0e] text-white px-4 md:px-8 max-w-[1400px] mx-auto pb-20 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Hero & Details) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero / Player Placeholder */}
          <div className="relative w-full aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden shadow-2xl group cursor-pointer border border-gray-800"
               onClick={() => {
                  if (currentMovie.type === 'tvseries' && currentMovie.seasons?.[0]?.episodes?.[0]) {
                    setPlayingMovie(currentMovie.seasons[0].episodes[0]);
                  } else {
                    setPlayingMovie(currentMovie);
                  }
               }}>
            <img 
              src={getDriveDirectLink(currentMovie.driveLargeImageId || currentMovie.driveImageId)} 
              alt={currentMovie.title} 
              className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition duration-300" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent opacity-90" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition shadow-2xl mb-4 cursor-pointer">
                <FaPlay size={24} className="ml-2" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg text-center px-4 tracking-tight">{currentMovie.title}</h2>
              {currentMovie.type === 'tvseries' && currentMovie.seasons?.length > 0 && (
                <p className="text-gray-300 mt-2 font-medium tracking-wide">S1 - E1</p>
              )}
            </div>
            <div className="absolute bottom-3 left-0 right-0 text-center text-[11px] text-gray-400">
              Video not playing? Click to switch streaming source
            </div>
          </div>

          {/* Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-1">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white mb-2">{currentMovie.title} {currentMovie.type === 'tvseries' && <span className="text-lg text-gray-400 font-normal ml-1">· S1E1</span>}</h1>
              <div className="flex flex-wrap items-center gap-3 text-neutral-400 text-xs font-semibold tracking-wide uppercase">
                <span>{currentMovie.year}</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                {currentMovie.ageRating && <span className="border border-neutral-600 px-1 rounded text-neutral-300">{currentMovie.ageRating}</span>}
                {currentMovie.durationOrSeasons && <> <span className="w-1 h-1 bg-gray-600 rounded-full"></span> <span>{currentMovie.durationOrSeasons}</span> </>}
                {currentMovie.quality && <> <span className="w-1 h-1 bg-gray-600 rounded-full"></span> <span className="bg-white text-black px-1 rounded">{currentMovie.quality}</span> </>}
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 border border-neutral-700 hover:border-gray-400 text-gray-300 hover:text-white px-4 py-2 rounded-md transition text-sm font-medium bg-[#1a1a1a]">
                <FaPlus size={12} /> My List
              </button>
              <button className="flex items-center gap-2 border border-neutral-700 hover:border-gray-400 text-gray-300 hover:text-white px-4 py-2 rounded-md transition text-sm font-medium bg-[#1a1a1a]">
                <FaThumbsUp size={12} /> Like
              </button>
            </div>
          </div>

          {/* Adsterra 728x90 Banner */}
          <div className="w-full flex justify-center py-2 hidden md:flex">
             <AdsterraAd width={728} height={90} adKey="3e52a7de4f64eb578996bc017ab9863c" />
          </div>
          <div className="w-full flex justify-center py-2 md:hidden">
             <AdsterraAd width={320} height={50} adKey="b06804870a5a3c679877784e41216b13" />
          </div>

          {/* About Section */}
          <div className="bg-[#141414] p-5 md:p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-4">About this {currentMovie.type === 'tvseries' ? 'series' : 'movie'}</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              {currentMovie.description}
            </p>
            <div className="space-y-4 text-sm">
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 border-b border-gray-800/50 pb-3">
                <span className="text-neutral-500 w-20 flex-shrink-0 font-medium">Cast:</span>
                <span className="text-neutral-300 leading-relaxed tracking-wide">{formatText(currentMovie.cast)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 border-b border-gray-800/50 pb-3">
                <span className="text-neutral-500 w-20 flex-shrink-0 font-medium">Director:</span>
                <span className="text-neutral-300 leading-relaxed tracking-wide">{formatText(currentMovie.director)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                <span className="text-neutral-500 w-20 flex-shrink-0 font-medium">Genres:</span>
                <span className="text-neutral-300 leading-relaxed tracking-wide">{formatText(currentMovie.genres)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Ads & Episodes/Similar) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Adsterra Banner (Top Right) */}
          <div className="bg-[#141414] rounded-lg border border-gray-800 p-4 flex flex-col items-center justify-center min-h-[250px]">
             <span className="text-[10px] text-gray-500 mb-2 font-bold tracking-widest uppercase">Advertisement</span>
             <AdsterraAd width={300} height={250} adKey="d2de92205c1828fadc5fc266dc440f74" />
          </div>

          {/* Episodes List (TV Series) */}
          {currentMovie.type === 'tvseries' && currentMovie.seasons?.length > 0 && (
            <div className="bg-[#141414] rounded-lg border border-gray-800 flex flex-col h-[600px]">
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-base font-bold text-white mb-4">Episodes</h3>
                
                {/* Tabs */}
                <div className="flex gap-6 overflow-x-auto scrollbar-hide border-b border-gray-800">
                  {currentMovie.seasons.map((season, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedSeasonIndex(idx)}
                      className={`pb-2 text-sm font-medium whitespace-nowrap transition relative ${selectedSeasonIndex === idx ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      {season.seasonName}
                      {selectedSeasonIndex === idx && (
                        <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#E50914] rounded-t-full"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Episodes Scroll Area */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent p-2 space-y-1">
                {currentMovie.seasons[selectedSeasonIndex]?.episodes?.map((ep, i) => (
                  <div 
                    key={i} 
                    onClick={() => setPlayingMovie(ep)}
                    className={`flex items-center gap-4 p-2 rounded-md cursor-pointer group transition ${playingMovie?._id === ep._id ? 'bg-[#2a2a2a] border border-gray-700' : 'hover:bg-[#1f1f1f] border border-transparent'}`}
                  >
                    <div className="relative w-32 h-20 flex-shrink-0 rounded overflow-hidden bg-neutral-800">
                      <img 
                        src={getDriveDirectLink(ep.driveImageId || currentMovie.driveImageId)} 
                        alt={ep.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                      />
                      <FaPlay className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition drop-shadow-md" size={16} />
                      {playingMovie?._id === ep._id && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-[#E50914] animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <h4 className={`text-sm font-bold truncate transition ${playingMovie?._id === ep._id ? 'text-[#E50914]' : 'text-gray-200 group-hover:text-white'}`}>
                        {ep.title}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1 truncate">
                        E{i + 1} {ep.duration ? `• ${ep.duration}` : ''}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                        {ep.description || `Episode ${i + 1} of ${currentMovie.seasons[selectedSeasonIndex].seasonName}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* More Like This (Movies) */}
          {similarMovies.length > 0 && currentMovie.type !== 'tvseries' && (
            <div className="bg-[#141414] rounded-lg border border-gray-800 p-4">
              <h3 className="text-base font-bold text-white mb-4">More Like This</h3>
              <div className="flex flex-col gap-2">
                {similarMovies.map(sm => (
                  <div key={sm._id} onClick={() => handleMovieChange(sm)} className="flex items-center gap-3 group cursor-pointer hover:bg-[#1f1f1f] p-2 rounded-md transition border border-transparent hover:border-gray-800">
                    <div className="relative w-28 h-16 flex-shrink-0 rounded overflow-hidden">
                      <img src={getDriveDirectLink(sm.driveImageId)} alt={sm.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-200 truncate group-hover:text-white">{sm.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-neutral-400 font-semibold">{sm.year}</span>
                        {sm.ageRating && <span className="text-[10px] border border-gray-700 px-1 rounded text-gray-500">{sm.ageRating}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      
      {playingMovie && (
        <VideoPlayer movie={playingMovie} onClose={() => setPlayingMovie(null)} />
      )}
    </div>
  );
};

export default MovieDetails;

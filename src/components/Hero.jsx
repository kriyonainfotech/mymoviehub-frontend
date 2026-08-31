import { useState } from 'react';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import VideoPlayer from './VideoPlayer';
import { useNavigate } from 'react-router-dom';
import { getDriveDirectLink } from './Row';

const Hero = ({ banner }) => {
  const navigate = useNavigate();
  const [playingMovie, setPlayingMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);

  if (!banner) return <div className="h-20 bg-[#141414]"></div>;

  return (
    <>
      <div className="relative h-[70vh] md:h-[85vh] w-full bg-cover bg-center" style={{ backgroundImage: `url('${getDriveDirectLink(banner.bgImage)}')` }}>
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-[#141414]/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
        
        <div className="absolute bottom-[20%] left-4 md:left-12 max-w-2xl">
          <h1 className="text-5xl md:text-8xl font-black text-white mb-4 tracking-tighter drop-shadow-lg uppercase" style={{ 
            textShadow: '2px 2px 10px rgba(0,0,0,0.8)' 
          }}>
            {banner.title}
          </h1>
          {banner.subtitle && <p className="text-white text-lg md:text-xl font-bold mb-2">{banner.subtitle}</p>}
          <p className="hidden md:block text-gray-300 text-sm md:text-base mb-6 drop-shadow-md">
            {banner.description}
          </p>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => navigate('/movie/' + banner.movie._id)}
              className="flex items-center bg-gray-500/70 text-white px-6 py-2 rounded font-bold hover:bg-gray-500/90 transition"
            >
              <FaInfoCircle className="mr-2" /> More Info
            </button>
          </div>
        </div>
      </div>

      {playingMovie && <VideoPlayer movie={playingMovie} onClose={() => setPlayingMovie(null)} />}
      
      {showModal && banner.movie && (
        <MovieModal 
          movie={banner.movie} 
          onClose={() => setShowModal(false)} 
          onPlay={(ep) => {
            setShowModal(false);
            setPlayingMovie(ep || banner.movie);
          }}
        />
      )}
    </>
  );
};

export default Hero;

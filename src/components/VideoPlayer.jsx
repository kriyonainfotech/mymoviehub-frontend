import { useState, useEffect } from 'react';
import { FaTimes, FaExternalLinkAlt } from 'react-icons/fa';
import { createPortal } from 'react-dom';

const VideoPlayer = ({ movie, onClose }) => {
  const [showAd, setShowAd] = useState(true);

  // We unlock on unmount
  useEffect(() => {
    return () => {
      try {
        if (window.screen.orientation && window.screen.orientation.unlock) {
          window.screen.orientation.unlock();
        }
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen();
        }
      } catch (e) {}
    };
  }, []);

  const handleContinue = async () => {
    setShowAd(false);
    
    // Request fullscreen and rotate EXACTLY on user click so browser allows it
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      if (window.screen.orientation && window.screen.orientation.lock) {
        await window.screen.orientation.lock('landscape');
      }
    } catch (err) {
      console.log('Fullscreen/Orientation lock failed', err);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black text-white">
      {/* Top Close Button Overlay */}
      <div className="absolute top-4 right-6 z-[210]">
        <button 
          onClick={onClose}
          className="bg-black/40 hover:bg-black/90 text-white rounded-full p-3 transition-colors backdrop-blur-sm shadow-lg border border-white/10"
        >
          <FaTimes size={20} />
        </button>
      </div>

      {/* Ad Overlay */}
      {showAd && (
        <div className="absolute inset-0 z-[300] bg-black/95 flex flex-col items-center justify-center p-8 text-center backdrop-blur-md">
          <h2 className="text-4xl text-white font-bold mb-6">Your Video is Ready</h2>
          <p className="text-gray-400 mb-10 max-w-lg text-lg">
            Click the button below to continue watching.
          </p>
          <div className="flex gap-4">
            <a 
              href="https://omg10.com/4/9048335"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleContinue}
              className="bg-[#E50914] hover:bg-red-700 text-white font-bold py-4 px-10 rounded flex items-center gap-3 transition text-lg shadow-xl cursor-pointer"
            >
              Continue to Video <FaExternalLinkAlt />
            </a>
          </div>
        </div>
      )}

      {/* Video Area - Only render iframe AFTER ad is closed so autoplay works with the click */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
        {!showAd && movie?.driveVideoId ? (
          <iframe 
            src={movie.driveVideoId.replace('/view', '/preview') + (movie.driveVideoId.includes('?') ? '&autoplay=1' : '?autoplay=1')} 
            className="border-0 w-full h-full"
            style={{ maxWidth: '177.78vh', maxHeight: '56.25vw' }}
            allow="autoplay; fullscreen"
            allowFullScreen
          ></iframe>
        ) : (!showAd && (
          <div className="flex h-full items-center justify-center flex-col pointer-events-none">
            <div className="text-red-600 text-[200px] font-black leading-none tracking-tighter" style={{ fontFamily: 'Arial', transform: 'scaleY(1.2)' }}>N</div>
            <p className="mt-4 text-gray-400">Playing dummy video for {movie?.title}</p>
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
};

export default VideoPlayer;

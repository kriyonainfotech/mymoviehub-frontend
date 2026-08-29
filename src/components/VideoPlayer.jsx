import { useState, useEffect } from 'react';
import { FaTimes, FaPlay } from 'react-icons/fa';
import { createPortal } from 'react-dom';

const VideoPlayer = ({ movie, onClose }) => {
  const [showAd, setShowAd] = useState(false);
  const [adTimeLeft, setAdTimeLeft] = useState(10);

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

  // Fake Timer for Ads (Testing at 1 minute = 60000ms)
  useEffect(() => {
    const adInterval = setInterval(() => {
      setShowAd(true);
      setAdTimeLeft(10); // 10 seconds ad
    }, 60000); 

    return () => clearInterval(adInterval);
  }, []);

  // Ad timer countdown
  useEffect(() => {
    let timer;
    if (showAd && adTimeLeft > 0) {
      timer = setInterval(() => {
        setAdTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (showAd && adTimeLeft === 0) {
      skipAd(); // Auto skip when time is up
    }
    return () => clearInterval(timer);
  }, [showAd, adTimeLeft]);

  // Inject Monetag Vignette Banner when ad shows
  useEffect(() => {
    if (showAd) {
      const scriptId = 'monetag-vignette';
      if (!document.getElementById(scriptId)) {
        const s = document.createElement('script');
        s.id = scriptId;
        s.dataset.zone = '9048332';
        s.src = 'https://n6wxm.com/vignette.min.js';
        document.body.appendChild(s);
      }
    }
  }, [showAd]);

  const skipAd = () => {
    setShowAd(false);
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

      {/* Video Ad Overlay (YouTube Style) */}
      {showAd && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center">
          {/* The Banner Ad (Fallback if Monetag fails) */}
          <div className="w-full max-w-[300px] h-[250px] md:max-w-[728px] md:h-[90px] bg-[#1a1a1a] border border-gray-600 flex flex-col items-center justify-center rounded overflow-hidden relative shadow-2xl z-[120]">
            <span className="text-gray-400 text-sm mb-2">Advertisement</span>
            <a href="https://omg10.com/4/9048335" target="_blank" rel="noopener noreferrer" className="bg-[#E50914] text-white px-6 py-2 rounded font-bold hover:bg-red-700 transition">
              Click Here to Continue
            </a>
          </div>
          
          {/* Ad Countdown / Skip Button Overlay */}
          <div className="absolute bottom-16 right-8 z-[110]">
            {adTimeLeft > 0 ? (
              <div className="bg-black/70 border border-white/20 text-white px-6 py-3 rounded text-lg font-bold">
                Video will resume in {adTimeLeft}s
              </div>
            ) : (
              <button 
                onClick={skipAd}
                className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded text-lg font-bold flex items-center gap-2 shadow-xl"
              >
                Skip Ad <FaPlay size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Video Area */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
        {movie?.driveVideoId ? (
          <iframe 
            src={movie.driveVideoId.replace('/view', '/preview') + (movie.driveVideoId.includes('?') ? '&autoplay=1' : '?autoplay=1')} 
            className="border-0 w-full h-full"
            style={{ maxWidth: '177.78vh', maxHeight: '56.25vw' }}
            allow="autoplay; fullscreen"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="flex h-full items-center justify-center flex-col pointer-events-none">
            <div className="text-red-600 text-[200px] font-black leading-none tracking-tighter" style={{ fontFamily: 'Arial', transform: 'scaleY(1.2)' }}>N</div>
            <p className="mt-4 text-gray-400">Playing dummy video for {movie?.title}</p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default VideoPlayer;

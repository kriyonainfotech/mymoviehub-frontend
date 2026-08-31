import { useState, useEffect } from 'react';
import { FaTimes, FaPlay } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import AdsterraAd from './AdsterraAd';

const VideoPlayer = ({ movie, onClose }) => {
  const [showAd, setShowAd] = useState(true); // Start with Ad Immediately
  const [adTimeLeft, setAdTimeLeft] = useState(15);
  const [firstAdSkipped, setFirstAdSkipped] = useState(false);

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

  // Interval Timer for Ads (Every 30 minutes)
  useEffect(() => {
    const adInterval = setInterval(() => {
      setShowAd(true);
      setAdTimeLeft(15);
    }, 1800000); 

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

  const skipAd = () => {
    setShowAd(false);
    setFirstAdSkipped(true);
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
          {/* Real Adsterra Banner (300x250) */}
          <div className="relative z-[120]">
            <AdsterraAd 
              width={300} 
              height={250} 
              adKey="d2de92205c1828fadc5fc266dc440f74"
            />
          </div>
          
          {/* Ad Countdown / Skip Button Overlay */}
          <div className="absolute bottom-16 right-8 z-[110]">
            {adTimeLeft > 0 ? (
              <div className="bg-black/70 border border-white/20 text-white px-6 py-3 rounded text-lg font-bold">
                Video will start in {adTimeLeft}s
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
        {movie?.driveVideoId && firstAdSkipped ? (
          <iframe 
            src={movie.driveVideoId.replace('/view', '/preview') + (movie.driveVideoId.includes('?') ? '&autoplay=1' : '?autoplay=1')} 
            className="border-0 w-full h-full"
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

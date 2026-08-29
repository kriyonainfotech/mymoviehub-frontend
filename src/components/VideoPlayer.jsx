import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { createPortal } from 'react-dom';

const API_KEY = "AIzaSyBlC9Q2mcC1yghz1i9-jrVH_lQhdjHQfCs";

const extractDriveId = (url) => {
  if (!url) return null;
  const match = url.match(/\/d\/(.*?)\//);
  return match ? match[1] : url;
};

const VideoPlayer = ({ movie, onClose }) => {
  const videoRef = useRef(null);
  const adVideoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [shownAds, setShownAds] = useState([]);
  const [adTimeLeft, setAdTimeLeft] = useState(10);
  const [videoUrl, setVideoUrl] = useState('');

  // Setup the video URL
  useEffect(() => {
    if (movie?.driveVideoId) {
      const fileId = extractDriveId(movie.driveVideoId);
      if (fileId && fileId.length > 15) {
        setVideoUrl(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${API_KEY}`);
      } else {
        setVideoUrl(movie.driveVideoId); // Fallback
      }
    }
  }, [movie]);

  // Unlock orientation on unmount
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

  // Time update listener for the main video
  const handleTimeUpdate = () => {
    if (!videoRef.current || showAd) return;
    const time = Math.floor(videoRef.current.currentTime);

    // Testing targets: 60s, 120s, 180s
    const adTargets = [60, 120, 180];
    
    for (let target of adTargets) {
      if (time >= target && time < target + 5 && !shownAds.includes(target)) {
        triggerAd(target);
        break;
      }
    }
  };

  const triggerAd = (target) => {
    // Pause main video
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setShownAds(prev => [...prev, target]);
    setShowAd(true);
    setAdTimeLeft(10); // 10 seconds unskippable ad for testing
  };

  const skipAd = () => {
    setShowAd(false);
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log('Autoplay prevented', e));
      setIsPlaying(true);
    }
  };

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

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black text-white flex items-center justify-center">
      {/* Top Close Button Overlay */}
      <div className="absolute top-4 right-6 z-[210]">
        <button 
          onClick={onClose}
          className="bg-black/40 hover:bg-black/90 text-white rounded-full p-3 transition-colors backdrop-blur-sm shadow-lg border border-white/10"
        >
          <FaTimes size={20} />
        </button>
      </div>

      {/* Main Video Player */}
      <div className="relative w-full h-full flex items-center justify-center">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full outline-none"
            controls={!showAd}
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            disablePictureInPicture
            controlsList="nodownload"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="flex h-full items-center justify-center flex-col pointer-events-none">
            <div className="text-red-600 text-[200px] font-black leading-none tracking-tighter" style={{ fontFamily: 'Arial', transform: 'scaleY(1.2)' }}>N</div>
            <p className="mt-4 text-gray-400">Loading video...</p>
          </div>
        )}

        {/* Video Ad Overlay (YouTube Style) */}
        {showAd && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center">
            {/* The Banner Ad */}
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

            {/* Ad Badge */}
            <div className="absolute top-8 left-8 z-[110] bg-yellow-500 text-black px-3 py-1 rounded font-bold text-sm">
              Ad • 1 of 1
            </div>
            
            {/* Clickable Area for Ad */}
            <a 
              href="https://omg10.com/4/9048335"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-[105] opacity-0"
              title="Click to visit sponsor"
            ></a>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default VideoPlayer;

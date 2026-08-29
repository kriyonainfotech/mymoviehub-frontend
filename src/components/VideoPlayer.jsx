import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaPlay, FaPause, FaExpand, FaCompress, FaVolumeUp, FaVolumeMute, FaBackward, FaForward } from 'react-icons/fa';
import { createPortal } from 'react-dom';

const VideoPlayer = ({ movie, onClose }) => {
  const [showAd, setShowAd] = useState(false);
  const [adTimeLeft, setAdTimeLeft] = useState(10);
  
  // Custom Player State
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  // Ad Tracking State (Show ad at 20%, 40%, 60%, 80%)
  const [adsShown, setAdsShown] = useState([]);

  const extractFileId = (url) => {
    if (!url) return null;
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : url; // fallback to full url if not standard
  };

  const fileId = extractFileId(movie?.driveVideoId);
  const videoUrl = fileId ? `https://young-sun-599a.kriyonainfotech.workers.dev/${fileId}` : null;

  // Cleanup on unmount
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

  // Format time (seconds -> MM:SS)
  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // Video Events
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);

      // Trigger ads based on percentage (e.g., 20%, 40%, 60%)
      if (total > 0 && !showAd) {
        const percentage = (current / total) * 100;
        const adPoints = [20, 40, 60, 80];
        
        for (let point of adPoints) {
          // If we passed the point and haven't shown an ad for it yet
          if (percentage >= point && percentage < point + 1 && !adsShown.includes(point)) {
            videoRef.current.pause();
            setIsPlaying(false);
            setShowAd(true);
            setAdTimeLeft(10);
            setAdsShown(prev => [...prev, point]);
            break;
          }
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Controls Visibility
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !showAd) setShowControls(false);
    }, 3000);
  };

  // Play/Pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Seek
  const handleSeek = (e) => {
    const time = (e.target.value / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skipForward = () => {
    if (videoRef.current) videoRef.current.currentTime += 10;
  };
  
  const skipBackward = () => {
    if (videoRef.current) videoRef.current.currentTime -= 10;
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
      try {
        if (window.screen.orientation && window.screen.orientation.lock) {
          window.screen.orientation.lock('landscape');
        }
      } catch (e) {}
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      try {
        if (window.screen.orientation && window.screen.orientation.unlock) {
          window.screen.orientation.unlock();
        }
      } catch (e) {}
    }
  };

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
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return createPortal(
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black text-white flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onClick={handleMouseMove}
    >
      {/* Top Close Button Overlay */}
      {showControls && !showAd && (
        <div className="absolute top-4 right-6 z-[210]">
          <button 
            onClick={onClose}
            className="bg-black/60 hover:bg-black/90 text-white rounded-full p-3 transition-colors backdrop-blur-sm shadow-lg border border-white/20"
          >
            <FaTimes size={20} />
          </button>
        </div>
      )}

      {/* Video Ad Overlay */}
      {showAd && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center">
          <div className="text-white text-xl mb-4 font-bold">Advertisement</div>
          
          <div className="w-full max-w-[300px] h-[250px] md:max-w-[728px] md:h-[90px] bg-[#1a1a1a] border border-gray-600 flex flex-col items-center justify-center rounded overflow-hidden relative shadow-2xl z-[120]">
            <a href="https://www.profitableratecpmnetwork.com/tuxrqgr8q1?key=ef6b0648714ba63c523d681e3229c280" target="_blank" rel="noopener noreferrer" className="bg-[#E50914] text-white px-8 py-3 text-xl rounded font-bold hover:bg-red-700 transition shadow-lg">
              Click Here to Continue
            </a>
          </div>
          
          <div className="absolute bottom-16 right-8 z-[110]">
            {adTimeLeft > 0 ? (
              <div className="bg-black/80 border border-white/30 text-white px-6 py-3 rounded text-lg font-bold">
                Video resumes in {adTimeLeft}s
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

      {/* Video Player */}
      {videoUrl ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={togglePlay}
          />
          
          {/* Custom Controls */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${showControls && !showAd ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            
            {/* Progress Bar */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium text-gray-300">{formatTime(currentTime)}</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#E50914]"
              />
              <span className="text-xs font-medium text-gray-300">{formatTime(duration)}</span>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button onClick={togglePlay} className="hover:text-[#E50914] transition transform hover:scale-110">
                  {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
                </button>
                
                <button onClick={skipBackward} className="hover:text-gray-300 transition" title="Rewind 10s">
                  <FaBackward size={20} />
                </button>
                
                <button onClick={skipForward} className="hover:text-gray-300 transition" title="Forward 10s">
                  <FaForward size={20} />
                </button>

                <div className="flex items-center gap-2 group relative">
                  <button onClick={() => {
                    const newMuted = !isMuted;
                    setIsMuted(newMuted);
                    if (videoRef.current) videoRef.current.muted = newMuted;
                  }} className="hover:text-gray-300 transition">
                    {isMuted || volume === 0 ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
                  </button>
                  <input 
                    type="range" 
                    min="0" max="1" step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setVolume(v);
                      setIsMuted(v === 0);
                      if (videoRef.current) {
                        videoRef.current.volume = v;
                        videoRef.current.muted = v === 0;
                      }
                    }}
                    className="w-0 opacity-0 group-hover:w-20 group-hover:opacity-100 transition-all duration-300 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>
                
                <div className="font-bold text-lg hidden md:block">{movie?.title}</div>
              </div>
              
              <div className="flex items-center gap-4">
                <button onClick={toggleFullscreen} className="hover:text-gray-300 transition transform hover:scale-110">
                  {isFullscreen ? <FaCompress size={24} /> : <FaExpand size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center flex-col pointer-events-none">
          <div className="text-red-600 text-[100px] font-black">Error</div>
          <p className="mt-4 text-gray-400">Invalid Video ID</p>
        </div>
      )}
    </div>,
    document.body
  );
};

export default VideoPlayer;

import { useState, useEffect } from 'react';
import { FaTimes, FaExternalLinkAlt } from 'react-icons/fa';
import { createPortal } from 'react-dom';

const VideoPlayer = ({ movie, onClose }) => {
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

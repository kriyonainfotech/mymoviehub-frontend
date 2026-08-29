const fs = require('fs');
let content = fs.readFileSync('src/components/MovieModal.jsx', 'utf8');

// 1. Add imageLoading state
content = content.replace(
  'const [isAnimating, setIsAnimating] = useState(false);',
  'const [isAnimating, setIsAnimating] = useState(false);\n  const [imageLoading, setImageLoading] = useState(true);'
);

// 2. Add setImageLoading to initialMovie effect
content = content.replace(
  'setSelectedSeasonIndex(0);\n  }, [initialMovie]);',
  'setSelectedSeasonIndex(0);\n    setImageLoading(true);\n  }, [initialMovie]);'
);

// 3. Add setImageLoading to handleMovieChange
content = content.replace(
  'setIsAnimating(true);\n    setTimeout(() => {',
  'setIsAnimating(true);\n    setTimeout(() => {\n      setImageLoading(true);'
);

// 4. Update desktop image
content = content.replace(
  '<img src={getDriveDirectLink(currentMovie.driveLargeImageId || currentMovie.driveImageId)} alt={currentMovie.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition duration-500" />\n                 <div className="absolute inset-0 flex items-center justify-center">',
  `<img 
                   src={getDriveDirectLink(currentMovie.driveLargeImageId || currentMovie.driveImageId)} 
                   alt={currentMovie.title} 
                   className={\`w-full h-full object-cover transition-opacity duration-500 \${imageLoading ? 'opacity-0' : 'opacity-70 group-hover:opacity-50'}\`} 
                   onLoad={() => setImageLoading(false)}
                 />
                 {imageLoading && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
                     <div className="w-10 h-10 border-4 border-[#222] border-t-[#E50914] rounded-full animate-spin mb-3"></div>
                     <span className="text-xs text-gray-400 font-medium tracking-wider">LOADING...</span>
                   </div>
                 )}
                 <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">`
);

// 5. Update desktop play button pointer-events
content = content.replace(
  'className="bg-[#E50914] hover:bg-[#b0060e] shadow-lg rounded-full w-20 h-20 flex items-center justify-center transition transform hover:scale-105"',
  'className="bg-[#E50914] hover:bg-[#b0060e] shadow-lg rounded-full w-20 h-20 flex items-center justify-center transition transform hover:scale-105 pointer-events-auto"'
);

// 6. Update mobile modal padding
content = content.replace(
  '<div className={`relative w-full min-h-screen pb-10 transition-all duration-300 transform ${isAnimating ? \'opacity-0\' : \'opacity-100\'}`}>',
  '<div className={`relative w-full min-h-screen pb-24 transition-all duration-300 transform ${isAnimating ? \'opacity-0\' : \'opacity-100\'}`}>'
);

// 7. Update mobile image
content = content.replace(
  '<img src={getDriveDirectLink(currentMovie.driveLargeImageId || currentMovie.driveImageId)} alt={currentMovie.title} className="w-full h-full object-cover opacity-80" />\n              <div className="absolute inset-0 flex items-center justify-center">',
  `<img 
                src={getDriveDirectLink(currentMovie.driveLargeImageId || currentMovie.driveImageId)} 
                alt={currentMovie.title} 
                className={\`w-full h-full object-cover transition-opacity duration-300 \${imageLoading ? 'opacity-0' : 'opacity-80'}\`} 
                onLoad={() => setImageLoading(false)}
              />
              {imageLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
                  <div className="w-8 h-8 border-4 border-[#222] border-t-[#E50914] rounded-full animate-spin mb-2"></div>
                  <span className="text-[10px] text-gray-400 font-medium tracking-wider">LOADING...</span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">`
);

// 8. Update mobile play button pointer-events
content = content.replace(
  'className="bg-black/50 border border-white/30 rounded-full w-14 h-14 flex items-center justify-center backdrop-blur-sm"',
  'className="bg-black/50 border border-white/30 rounded-full w-14 h-14 flex items-center justify-center backdrop-blur-sm pointer-events-auto"'
);

// 9. Update mobile More Like This grid
content = content.replace(
  /<div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">([\s\S]*?)<\/div>\s*<\/div>\s*\)\}/,
  `<div className="flex gap-4 overflow-x-auto scrollbar-hide px-2 pb-2">
                  {similarMovies.map(sm => (
                    <div key={sm._id} onClick={() => handleMovieChange(sm)} className="flex-shrink-0 w-[140px] md:w-[180px] bg-[#1a1a1a] rounded-xl overflow-hidden cursor-pointer border border-[#2a2a2a]">
                      <div className="relative aspect-[2/3]">
                        <img src={import.meta.env.VITE_API_URL + \`/api/image-proxy?id=\${sm.driveImageId.match(/(?:\\/d\\/|id=)([a-zA-Z0-9_-]+)/)?.[1]}\`} alt={sm.title} className="w-full h-full object-cover" />
                        {sm.durationOrSeasons && (
                          <span className="absolute top-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-yellow-500 flex items-center gap-1">
                            <FaStar size={8} /> {sm.rating || '6.9'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}`
);

// 10. Update Bottom Sheet details (remove Cast/Director, add padding, filter genres)
content = content.replace(
  '<div className="relative bg-[#1a1a1a] w-full rounded-t-2xl p-6 border-t border-[#2a2a2a] pb-10">',
  '<div className="relative bg-[#1a1a1a] w-full max-h-[85vh] overflow-y-auto rounded-t-2xl p-6 border-t border-[#2a2a2a] pb-24">'
);
content = content.replace(
  '{currentMovie.genres?.map((g, i) => (',
  '{currentMovie.genres?.filter(g => g.length < 30).map((g, i) => ('
);
content = content.replace(
  '<div className="mt-6 flex flex-col gap-2 text-xs">\n                    <div className="flex"><span className="text-gray-500 w-20">Cast:</span><span className="text-gray-300 flex-1">{currentMovie.cast?.join(\', \')}</span></div>\n                    <div className="flex"><span className="text-gray-500 w-20">Director:</span><span className="text-gray-300 flex-1">{currentMovie.director || \'Unknown\'}</span></div>\n                  </div>',
  ''
);

fs.writeFileSync('src/components/MovieModal.jsx', content);

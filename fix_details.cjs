const fs = require('fs');
let code = fs.readFileSync('src/pages/MovieDetails.jsx', 'utf8');

// We'll replace the whole return statement
const returnIndex = code.indexOf('return (');
const topPart = code.substring(0, returnIndex);

const newReturn = \eturn (
    <div className="pt-16 md:pt-24 min-h-screen bg-[#141414] text-white px-4 md:px-8 max-w-[1400px] mx-auto pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Hero & Details) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero / Player Placeholder */}
          <div className="relative w-full aspect-video bg-neutral-900 rounded-xl overflow-hidden shadow-2xl group cursor-pointer"
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
              className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition duration-300" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent opacity-80" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg mb-4">
                <FaPlay size={24} className="ml-2" />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg text-center px-4">{currentMovie.title}</h2>
              {currentMovie.type === 'tvseries' && currentMovie.seasons?.length > 0 && (
                <p className="text-gray-300 mt-2 font-medium">S1 - E1</p>
              )}
            </div>
            <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-400">
              Video not playing? Click to switch streaming source
            </div>
          </div>

          {/* Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1a1a] p-4 md:p-6 rounded-xl border border-gray-800">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{currentMovie.title} {currentMovie.type === 'tvseries' && <span className="text-lg text-gray-400">({currentMovie.seasons?.[0]?.seasonName})</span>}</h1>
              <div className="flex flex-wrap items-center gap-3 text-neutral-400 text-xs md:text-sm font-medium">
                <span className="text-green-500 font-bold border border-green-500 px-1 rounded">{currentMovie.year}</span>
                {currentMovie.ageRating && <span className="border border-neutral-600 px-1.5 py-0.5 rounded text-neutral-300">{currentMovie.ageRating}</span>}
                {currentMovie.durationOrSeasons && <span>{currentMovie.durationOrSeasons}</span>}
                {currentMovie.quality && <span className="bg-white text-black px-1.5 py-0.5 rounded">{currentMovie.quality}</span>}
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 border border-neutral-600 hover:border-white text-gray-300 hover:text-white px-4 py-2 rounded-full transition text-sm">
                <FaPlus size={14} /> My List
              </button>
              <button className="flex items-center gap-2 border border-neutral-600 hover:border-white text-gray-300 hover:text-white px-4 py-2 rounded-full transition text-sm">
                <FaThumbsUp size={14} /> Like
              </button>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-[#1a1a1a] p-4 md:p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg md:text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">About this {currentMovie.type === 'tvseries' ? 'series' : 'movie'}</h3>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-6">
              {currentMovie.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div><span className="text-neutral-500 block mb-1">Director</span><span className="text-neutral-200">{currentMovie.director || 'Unknown'}</span></div>
              <div><span className="text-neutral-500 block mb-1">Cast</span><span className="text-neutral-200">{currentMovie.cast || 'Unknown'}</span></div>
              <div><span className="text-neutral-500 block mb-1">Genres</span><span className="text-neutral-200">{currentMovie.genre || 'Various'}</span></div>
            </div>
          </div>

        </div>

        {/* Right Column (Ads & Episodes/Similar) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Adsterra Banner (Top Right) */}
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-4 flex flex-col items-center justify-center min-h-[250px]">
             <span className="text-xs text-gray-600 mb-2 font-bold tracking-widest uppercase">Advertisement</span>
             <a href="https://www.profitableratecpmnetwork.com/tuxrqgr8q1?key=ef6b0648714ba63c523d681e3229c280" target="_blank" rel="noopener noreferrer" className="block w-full text-center">
                <img src="https://i.imgur.com/3Q9Z2y4.png" alt="Ad" className="max-w-full rounded mx-auto" style={{maxHeight: '200px'}} />
                <div className="mt-3 bg-[#E50914] text-white px-4 py-2 rounded text-sm font-bold inline-block hover:bg-red-700 transition">
                  Click here to watch now for free
                </div>
             </a>
          </div>

          {/* Episodes List (TV Series) */}
          {currentMovie.type === 'tvseries' && currentMovie.seasons?.length > 0 && (
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 flex flex-col h-[600px]">
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-lg font-bold text-white mb-4">Episodes</h3>
                
                {/* Tabs */}
                <div className="flex gap-6 overflow-x-auto scrollbar-hide border-b border-gray-800">
                  {currentMovie.seasons.map((season, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedSeasonIndex(idx)}
                      className={\pb-2 text-sm font-medium whitespace-nowrap transition \\}
                    >
                      {season.seasonName}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Episodes Scroll Area */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent p-2">
                {currentMovie.seasons[selectedSeasonIndex]?.episodes?.map((ep, i) => (
                  <div 
                    key={i} 
                    onClick={() => setPlayingMovie(ep)}
                    className={\lex items-center gap-3 p-2 rounded cursor-pointer group transition \\}
                  >
                    <div className="relative w-28 h-16 flex-shrink-0 rounded overflow-hidden bg-neutral-800">
                      <img 
                        src={getDriveDirectLink(ep.driveImageId || currentMovie.driveImageId)} 
                        alt={ep.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                      />
                      <FaPlay className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition drop-shadow-md" size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={\	ext-sm font-bold truncate transition \\}>
                        {ep.title}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1 truncate">
                        E{i + 1} {ep.duration ? \• \\ : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* More Like This (Movies) */}
          {similarMovies.length > 0 && currentMovie.type !== 'tvseries' && (
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-4">
              <h3 className="text-lg font-bold text-white mb-4">More Like This</h3>
              <div className="flex flex-col gap-3">
                {similarMovies.map(sm => (
                  <div key={sm._id} onClick={() => handleMovieChange(sm)} className="flex items-center gap-3 group cursor-pointer hover:bg-[#2a2a2a] p-2 rounded transition">
                    <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden">
                      <img src={getDriveDirectLink(sm.driveImageId)} alt={sm.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-gray-300">{sm.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-green-500 font-bold">{sm.year}</span>
                        {sm.ageRating && <span className="text-[10px] border border-gray-600 px-1 rounded text-gray-400">{sm.ageRating}</span>}
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
\;

fs.writeFileSync('src/pages/MovieDetails.jsx', topPart + newReturn);

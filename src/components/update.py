import re

with open('MovieModal.jsx.backup', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '  return createPortal('
end_marker = '      {/* Lists Bottom Sheet / Modal */}'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

old_jsx = content[start_idx:end_idx]

commented_old = '/* OLD CODE: [2026-08-21]\n' + old_jsx.replace('*/', '') + '\n*/\n'

new_jsx = '''  return createPortal(
    <div id="movie-modal-container" className="fixed inset-0 z-[100] bg-[#000000] overflow-y-auto custom-scrollbar text-white">
      
      {/* Back Button (Mobile) */}
      <button onClick={onClose} className="absolute top-4 left-4 z-[120] bg-black/60 p-3 rounded-full text-white backdrop-blur-md">
        <FaArrowLeft size={16} />
      </button>

      <div className="w-full max-w-3xl mx-auto bg-[#121212] min-h-screen relative pb-10">

        {/* Video Player Area */}
        <div className="relative w-full aspect-video bg-black rounded-b-2xl overflow-hidden shadow-lg border-b border-neutral-800">
           <img src={getDriveDirectLink(currentMovie.driveLargeImageId || currentMovie.driveImageId)} className="w-full h-full object-cover opacity-60" />
           <div className="absolute inset-0 flex flex-col justify-center items-center">
              <button 
                onClick={() => onPlay(currentMovie.type === 'tvseries' ? currentMovie.seasons?.[selectedSeasonIndex]?.episodes?.[0] : currentMovie)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-5 transition shadow-2xl border border-white/20"
              >
                 <FaPlay className="text-white ml-1 text-2xl" />
              </button>
           </div>
        </div>

        {/* Video Troubleshooting Banner */}
        <div className="bg-[#1a1a1a] flex items-center justify-center py-2.5 text-[11px] text-gray-400 font-medium border-b border-neutral-800/50 cursor-pointer mb-4">
          <FaInfoCircle className="mr-1.5 opacity-70"/> Video not playing? Switch streaming source below <FaChevronDown className="ml-1 text-[9px] opacity-70" />
        </div>

        <div className="px-4 md:px-6">
          {/* Title Area */}
          <div className="flex items-end gap-2 mb-5">
            <h1 className="text-2xl sm:text-3xl font-bold truncate leading-none">{currentMovie.title}</h1>
            <span className="text-gray-400 text-xs font-medium cursor-pointer mb-1 hover:text-gray-300">...more</span>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2 mb-6">
            <button className="flex items-center gap-2 bg-[#252525] hover:bg-[#303030] px-4 py-2 rounded-full text-xs font-bold transition flex-shrink-0">
              <FaHeart className="text-gray-300" size={14} /> Support Us
            </button>
            <button className="flex items-center gap-2 bg-[#252525] hover:bg-[#303030] px-4 py-2 rounded-full text-xs font-bold transition flex-shrink-0">
              <FaUsers className="text-gray-300" size={14} /> Watch Party
            </button>
            <button 
              onClick={openListMenu}
              className={lex items-center gap-2  px-4 py-2 rounded-full text-xs font-bold transition flex-shrink-0}
            >
              {isSaved ? <FaCheck size={14} /> : <FaPlus size={14} />} Watchlist
            </button>
            <button className="flex items-center justify-center bg-[#252525] hover:bg-[#303030] w-8 h-8 rounded-full transition flex-shrink-0">
              <FaFlag className="text-gray-300" size={12} />
            </button>
          </div>

          {/* STREAMING SOURCE BLOCK */}
          <div className="bg-[#1c1c1c] border border-neutral-800 rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-[10px] font-black text-gray-400 tracking-wider">STREAMING SOURCE</h3>
              <span className="text-[10px] text-gray-500 flex items-center gap-1 cursor-pointer">Swipe <FaChevronRight size={8} /></span>
            </div>
            <p className="text-[10px] text-gray-500 mb-4">For any queries, join <span className="text-white font-bold cursor-pointer underline decoration-gray-600">Telegram</span> or <span className="text-white font-bold cursor-pointer underline decoration-gray-600">Discord</span>.</p>
            
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {['Orion', 'Redflix', 'Cinezo', 'Hindi New'].map((server, i) => (
                <button key={i} className={px-5 py-2.5 rounded-full text-[11px] font-bold whitespace-nowrap transition }>
                  {server}
                </button>
              ))}
              <div className="px-2 flex items-center justify-center text-gray-500">
                <FaChevronRight size={10} />
              </div>
            </div>
          </div>

          {/* Ads Toggle Block */}
          <div className="bg-[#1c1c1c] border border-neutral-800 rounded-2xl p-4 mb-4 flex justify-between items-center cursor-pointer">
            <div className="flex items-center gap-3">
              <FaBullhorn className="text-red-500 text-lg" />
              <div>
                <p className="text-[13px] font-bold text-[#3b82f6]">Ads</p>
                <p className="text-[10px] text-gray-500 font-medium">Ads are off</p>
              </div>
            </div>
            {/* Toggle mock */}
            <div className="w-10 h-6 bg-white rounded-full p-1 flex items-center justify-end shadow-inner">
              <div className="w-4 h-4 bg-black rounded-full shadow-sm"></div>
            </div>
          </div>

          {/* Ad Banner Block */}
          <div className="w-full aspect-[21/9] sm:aspect-[4/1] bg-neutral-900 rounded-xl mb-6 relative overflow-hidden border border-neutral-800 cursor-pointer">
            <div className="absolute top-1 left-1 bg-black/80 px-1 rounded text-[8px] font-bold text-white z-10">AD</div>
            <img src="https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" />
          </div>

          {/* More Like This / Episodes */}
          <div className="bg-[#1c1c1c] border border-neutral-800 rounded-2xl p-4 md:p-6 mb-6">
            {currentMovie.type === 'tvseries' ? (
              <>
                <h3 className="text-[15px] font-bold mb-4">Episodes</h3>
                
                {/* Seasons Scroll */}
                <div className="flex gap-6 overflow-x-auto scrollbar-hide border-b border-neutral-800 mb-6 pb-2">
                  {currentMovie.seasons?.map((season, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedSeasonIndex(idx)}
                      className={whitespace-nowrap text-sm font-bold pb-2 relative transition }
                    >
                       {season.name || Season }
                       {selectedSeasonIndex === idx && (
                         <div className="absolute bottom-[-9px] left-0 w-full h-0.5 bg-red-600 rounded-t-full"></div>
                       )}
                    </button>
                  ))}
                </div>

                {/* Episode Cards */}
                <div className="flex flex-col gap-4">
                  {currentMovie.seasons?.[selectedSeasonIndex]?.episodes?.map((ep, i) => (
                    <div key={i} onClick={() => onPlay(ep)} className={lex items-center gap-4 p-3 rounded-xl cursor-pointer transition border }>
                       <div className="relative w-28 aspect-video rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                          <img src={getDriveDirectLink(ep.driveImageId || currentMovie.driveImageId)} className="w-full h-full object-cover" />
                          {i === 0 && <div className="absolute inset-0 bg-red-600/20"></div>}
                       </div>
                       <div className="flex-1 min-w-0">
                          <h5 className="text-[13px] font-bold text-white truncate flex items-center gap-2">
                            {i === 0 && <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></div>}
                            {ep.title}
                          </h5>
                          <p className="text-[10px] text-gray-400 mt-1 font-medium">E{i+1} • {ep.duration || '40m'}</p>
                          <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-snug">{ep.description}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h3 className="text-[15px] font-bold mb-4">More Like This</h3>
                <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-2">
                  {similarMovies.map(sm => (
                    <div key={sm._id} onClick={() => handleMovieChange(sm)} className="relative w-28 sm:w-32 flex-shrink-0 cursor-pointer group">
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md">
                        <img src={getDriveDirectLink(sm.driveImageId)} className="w-full h-full object-cover" />
                        <div className="absolute top-1 right-1 bg-[#E50914] text-white px-1.5 py-0.5 rounded text-[8px] font-bold flex items-center gap-0.5 shadow-sm">
                          Save
                        </div>
                        <div className="absolute top-1 left-1 bg-yellow-500 text-black px-1.5 py-0.5 rounded text-[8px] font-bold flex items-center gap-0.5 shadow-sm">
                          <FaStar size={8} /> {sm.rating || '6.6'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
'''

pre = content[:start_idx]
post = content[end_idx:]

if 'FaArrowLeft' not in pre:
    pre = pre.replace('FaPlay, ', 'FaPlay, FaArrowLeft, FaChevronRight, FaBullhorn, ')

with open('MovieModal.jsx', 'w', encoding='utf-8') as f:
    f.write(pre + commented_old + new_jsx + post)

print('Success')

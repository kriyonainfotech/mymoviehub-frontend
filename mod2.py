import os

file_path = "src/components/MovieModal.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

desktopImageOld = """<img src={getDriveDirectLink(currentMovie.driveLargeImageId || currentMovie.driveImageId)} alt={currentMovie.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition duration-500" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={() => {
                        if (currentMovie.type === 'tvseries' && currentMovie.seasons?.[0]?.episodes?.[0] && !currentMovie.driveVideoId) {
                          onPlay(currentMovie.seasons[0].episodes[0]);
                        } else {
                          onPlay(currentMovie);
                        }
                      }} 
                      className="bg-[#E50914] hover:bg-[#b0060e] shadow-lg rounded-full w-20 h-20 flex items-center justify-center transition transform hover:scale-105"
                    >"""

desktopImageNew = """<img 
                   src={getDriveDirectLink(currentMovie.driveLargeImageId || currentMovie.driveImageId)} 
                   alt={currentMovie.title} 
                   className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoading ? 'opacity-0' : 'opacity-70 group-hover:opacity-50'}`} 
                   onLoad={() => setImageLoading(false)}
                 />
                 {imageLoading && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
                     <div className="w-10 h-10 border-4 border-[#222] border-t-[#E50914] rounded-full animate-spin mb-3"></div>
                     <span className="text-xs text-gray-400 font-medium tracking-wider">LOADING...</span>
                   </div>
                 )}
                 <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <button 
                      onClick={() => {
                        if (currentMovie.type === 'tvseries' && currentMovie.seasons?.[0]?.episodes?.[0] && !currentMovie.driveVideoId) {
                          onPlay(currentMovie.seasons[0].episodes[0]);
                        } else {
                          onPlay(currentMovie);
                        }
                      }} 
                      className="bg-[#E50914] hover:bg-[#b0060e] shadow-lg rounded-full w-20 h-20 flex items-center justify-center transition transform hover:scale-105 pointer-events-auto"
                    >"""

mobileImageOld = """<img src={getDriveDirectLink(currentMovie.driveLargeImageId || currentMovie.driveImageId)} alt={currentMovie.title} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={() => {
                    if (currentMovie.type === 'tvseries' && currentMovie.seasons?.[0]?.episodes?.[0] && !currentMovie.driveVideoId) {
                      onPlay(currentMovie.seasons[0].episodes[0]);
                    } else {
                      onPlay(currentMovie);
                    }
                  }} 
                  className="bg-black/50 border border-white/30 rounded-full w-14 h-14 flex items-center justify-center backdrop-blur-sm"
                >"""

mobileImageNew = """<img 
                src={getDriveDirectLink(currentMovie.driveLargeImageId || currentMovie.driveImageId)} 
                alt={currentMovie.title} 
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-80'}`} 
                onLoad={() => setImageLoading(false)}
              />
              {imageLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
                  <div className="w-8 h-8 border-4 border-[#222] border-t-[#E50914] rounded-full animate-spin mb-2"></div>
                  <span className="text-[10px] text-gray-400 font-medium tracking-wider">LOADING...</span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <button 
                  onClick={() => {
                    if (currentMovie.type === 'tvseries' && currentMovie.seasons?.[0]?.episodes?.[0] && !currentMovie.driveVideoId) {
                      onPlay(currentMovie.seasons[0].episodes[0]);
                    } else {
                      onPlay(currentMovie);
                    }
                  }} 
                  className="bg-black/50 border border-white/30 rounded-full w-14 h-14 flex items-center justify-center backdrop-blur-sm pointer-events-auto"
                >"""

content = content.replace(desktopImageOld, desktopImageNew)
content = content.replace(mobileImageOld, mobileImageNew)

pb10Old = "className={`relative w-full min-h-screen pb-10 transition-all duration-300 transform ${isAnimating ? 'opacity-0' : 'opacity-100'}`}"
pb10New = "className={`relative w-full min-h-screen pb-24 transition-all duration-300 transform ${isAnimating ? 'opacity-0' : 'opacity-100'}`}"
content = content.replace(pb10Old, pb10New)

bottomSheetOld = '<div className="relative bg-[#1a1a1a] w-full rounded-t-2xl p-6 border-t border-[#2a2a2a] pb-10">'
bottomSheetNew = '<div className="relative bg-[#1a1a1a] w-full max-h-[85vh] overflow-y-auto rounded-t-2xl p-6 border-t border-[#2a2a2a] pb-24">'
content = content.replace(bottomSheetOld, bottomSheetNew)

genresOld = "{currentMovie.genres?.map((g, i) => ("
genresNew = "{currentMovie.genres?.filter(g => g.length < 30).map((g, i) => ("
content = content.replace(genresOld, genresNew)

castOld = """<div className="mt-6 flex flex-col gap-2 text-xs">
                    <div className="flex"><span className="text-gray-500 w-20">Cast:</span><span className="text-gray-300 flex-1">{currentMovie.cast?.join(', ')}</span></div>
                    <div className="flex"><span className="text-gray-500 w-20">Director:</span><span className="text-gray-300 flex-1">{currentMovie.director || 'Unknown'}</span></div>
                  </div>"""
content = content.replace(castOld, "")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")

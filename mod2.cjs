const fs = require('fs');
let content = fs.readFileSync('src/components/MovieModal.jsx', 'utf8');

const desktopImageOld = \`<img src={getDriveDirectLink(currentMovie.driveLargeImageId || currentMovie.driveImageId)} alt={currentMovie.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition duration-500" />
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
                    >\`;

const desktopImageNew = \`<img 
                   src={getDriveDirectLink(currentMovie.driveLargeImageId || currentMovie.driveImageId)} 
                   alt={currentMovie.title} 
                   className={\\\`w-full h-full object-cover transition-opacity duration-500 \${imageLoading ? 'opacity-0' : 'opacity-70 group-hover:opacity-50'}\\\`} 
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
                    >\`;

content = content.replace(desktopImageOld, desktopImageNew);

const mobileImageOld = \`<img src={getDriveDirectLink(currentMovie.driveLargeImageId || currentMovie.driveImageId)} alt={currentMovie.title} className="w-full h-full object-cover opacity-80" />
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
                >\`;

const mobileImageNew = \`<img 
                src={getDriveDirectLink(currentMovie.driveLargeImageId || currentMovie.driveImageId)} 
                alt={currentMovie.title} 
                className={\\\`w-full h-full object-cover transition-opacity duration-300 \${imageLoading ? 'opacity-0' : 'opacity-80'}\\\`} 
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
                >\`;

content = content.replace(mobileImageOld, mobileImageNew);

const pb10Old = \`<div className={\\\`relative w-full min-h-screen pb-10 transition-all duration-300 transform \${isAnimating ? 'opacity-0' : 'opacity-100'}\\\`}>\`;
const pb10New = \`<div className={\\\`relative w-full min-h-screen pb-24 transition-all duration-300 transform \${isAnimating ? 'opacity-0' : 'opacity-100'}\\\`}>\`;
content = content.replace(pb10Old, pb10New);

fs.writeFileSync('src/components/MovieModal.jsx', content);

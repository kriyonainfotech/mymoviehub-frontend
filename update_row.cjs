const fs = require('fs');
let code = fs.readFileSync('src/components/Row.jsx', 'utf8');

const newHtml = `{/* Base Image and Overlays */}
                <div className="relative w-full h-full">
                  <img 
                    src={isLargeRow ? getDriveDirectLink(movie.driveLargeImageId || movie.driveImageId) : getDriveDirectLink(movie.driveImageId)} 
                    alt={movie.title}
                    onClick={() => setSelectedMovie(movie)}
                    className={\`rounded-md object-cover w-full transition-transform duration-300 \${isLargeRow ? 'h-[225px] md:h-[330px] ml-6' : 'h-[112px] md:h-[157px]'}\`}
                  />
                  
                  {/* Rating Badge */}
                  {movie.rating && (
                    <div className={\`absolute top-2 right-2 bg-black/70 border border-yellow-500/50 text-yellow-500 text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1 z-10 \${isLargeRow ? 'mr-[-24px]' : ''}\`}>
                      <span>★</span>
                      <span>{movie.rating}</span>
                    </div>
                  )}

                  {/* Desktop Hover Overlay (Hidden on sm/md) */}
                  <div className={\`hidden md:flex absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20 flex-col justify-end p-4 rounded-md \${isLargeRow ? 'ml-6' : ''}\`}>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (movie.type === 'tvseries' && movie.seasons?.[0]?.episodes?.[0] && !movie.driveVideoId) {
                          setPlayingMovie(movie.seasons[0].episodes[0]);
                        } else {
                          setPlayingMovie(movie);
                        }
                      }} 
                      className="bg-white text-black w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-300 transition shadow-md mb-2"
                    >
                      <FaPlay size={12} className="ml-1" />
                    </button>
                    <h3 className="text-white font-bold text-sm md:text-base leading-tight truncate">{movie.title}</h3>
                    <p className="text-neutral-300 text-xs md:text-sm mt-1">{movie.year || movie.releaseYear || ''}</p>
                  </div>
                </div>\n`;

// Replace from {/* Base Image */} to the second </div> before </React.Fragment>
code = code.replace(/\{\/\* Base Image \*\/\}[^]+?<\/div>\s*<\/div>\s*<\/React\.Fragment>/m, newHtml + '              </div>\n              </React.Fragment>');
fs.writeFileSync('src/components/Row.jsx', code);
console.log('Success');

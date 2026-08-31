const fs = require('fs');
let code = fs.readFileSync('src/pages/MovieDetails.jsx', 'utf8');

const helper = \
const formatText = (text) => {
  if (!text) return 'Unknown';
  return text.replace(/([a-z])([A-Z])/g, '\\\, \\\');
};
\;

code = code.replace(/const MovieDetails = \(\) => \{/, helper + '\nconst MovieDetails = () => {');

const oldAbout = \<div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div className="flex"><span className="text-neutral-500 w-20 flex-shrink-0">Director:</span><span className="text-neutral-300">{currentMovie.director || 'Unknown'}</span></div>
              <div className="flex"><span className="text-neutral-500 w-20 flex-shrink-0">Cast:</span><span className="text-neutral-300">{currentMovie.cast || 'Unknown'}</span></div>
              <div className="flex"><span className="text-neutral-500 w-20 flex-shrink-0">Genres:</span><span className="text-neutral-300">{currentMovie.genre || 'Various'}</span></div>
            </div>\;

const newAbout = \<div className="space-y-3 text-sm">
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                <span className="text-neutral-500 w-20 flex-shrink-0 font-medium">Cast:</span>
                <span className="text-neutral-300 leading-relaxed">{formatText(currentMovie.cast)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                <span className="text-neutral-500 w-20 flex-shrink-0 font-medium">Director:</span>
                <span className="text-neutral-300 leading-relaxed">{formatText(currentMovie.director)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                <span className="text-neutral-500 w-20 flex-shrink-0 font-medium">Genres:</span>
                <span className="text-neutral-300 leading-relaxed">{formatText(currentMovie.genre)}</span>
              </div>
            </div>\;

code = code.replace(oldAbout, newAbout);

fs.writeFileSync('src/pages/MovieDetails.jsx', code);

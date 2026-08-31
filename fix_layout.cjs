const fs = require('fs');
let code = fs.readFileSync('src/pages/MovieDetails.jsx', 'utf8');

code = code.replace(/<div className="lg:col-span-2 bg-\[#181818\] rounded-xl overflow-hidden shadow-2xl h-max pb-10">/, 
  "{/* Left/Main Column */}\n        <div className={g-[#181818] rounded-xl overflow-hidden shadow-2xl h-max pb-10 }>"
);

fs.writeFileSync('src/pages/MovieDetails.jsx', code);

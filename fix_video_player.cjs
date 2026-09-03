const fs = require('fs');
let code = fs.readFileSync('src/components/VideoPlayer.jsx', 'utf8');

// We add a state \irstAdSkipped\
code = code.replace(/const \[adTimeLeft, setAdTimeLeft\] = useState\(15\);/, 
  "const [adTimeLeft, setAdTimeLeft] = useState(15);\n  const [firstAdSkipped, setFirstAdSkipped] = useState(false);"
);

// We update skipAd
code = code.replace(/const skipAd = \(\) => \{\n    setShowAd\(false\);\n  \};/,
  "const skipAd = () => {\n    setShowAd(false);\n    setFirstAdSkipped(true);\n  };"
);

// In the iframe render, we only render if firstAdSkipped is true
code = code.replace(/\{movie\?\.driveVideoId \? \(/, 
  "{movie?.driveVideoId && firstAdSkipped ? ("
);

fs.writeFileSync('src/components/VideoPlayer.jsx', code);

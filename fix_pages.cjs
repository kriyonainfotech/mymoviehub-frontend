const fs = require('fs');

['src/pages/MyList.jsx', 'src/pages/Search.jsx'].forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/import MovieModal from [^\n]+/, "import { useNavigate } from 'react-router-dom';");
  
  if(file.includes('Search')) {
    code = code.replace(/const Search = \(\) => \{/, "const Search = () => {\n  const navigate = useNavigate();");
  } else {
    code = code.replace(/const MyList = \(\) => \{/, "const MyList = () => {\n  const navigate = useNavigate();");
  }

  code = code.replace(/setSelectedMovie\(movie\)/g, "navigate('/movie/' + movie._id)");
  code = code.replace(/setSelectedMovie\(null\)/g, ""); // Not perfectly clean but handles the modal close
  
  // Remove modal rendering
  code = code.replace(/\{selectedMovie && \([\s\S]*?<\/MovieModal>\s*\)\}/, "");
  // Actually MovieModal might be self closing
  code = code.replace(/\{selectedMovie && \(\s*<MovieModal[^>]+>\s*\)\}/, "");

  fs.writeFileSync(file, code);
});

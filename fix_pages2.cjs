const fs = require('fs');

['src/pages/MyList.jsx', 'src/pages/Search.jsx'].forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/<MovieModal[\s\S]*?\/>/g, "");
  fs.writeFileSync(file, code);
});

const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}
const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('http://127.0.0.1:5001') || content.includes('http://localhost:5001')) {
    
    content = content.replace(/'http:\/\/127\.0\.0\.1:5001(\/api[^']*)'/g, function(match, p1) {
      return 'import.meta.env.VITE_API_URL + \'' + p1 + '\'';
    });
    content = content.replace(/`http:\/\/127\.0\.0\.1:5001(\/api[^`]*)`/g, function(match, p1) {
      return 'import.meta.env.VITE_API_URL + `' + p1 + '`';
    });
    content = content.replace(/'http:\/\/localhost:5001(\/api[^']*)'/g, function(match, p1) {
      return 'import.meta.env.VITE_API_URL + \'' + p1 + '\'';
    });
    content = content.replace(/`http:\/\/localhost:5001(\/api[^`]*)`/g, function(match, p1) {
      return 'import.meta.env.VITE_API_URL + `' + p1 + '`';
    });
    
    fs.writeFileSync(file, content);
    console.log('Updated API URL in ' + file);
  }
});

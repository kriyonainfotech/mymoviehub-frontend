const fs = require('fs');
const oldCode = fs.readFileSync('../old_moviemodal.jsx', 'utf8');
const currCode = fs.readFileSync('src/components/MovieModal.jsx', 'utf8');

const oldPortalStart = oldCode.indexOf('return createPortal(');
const oldPortalEnd = oldCode.lastIndexOf(');');
let oldPortal = oldCode.substring(oldPortalStart + 20, oldPortalEnd);
oldPortal = oldPortal.replace(/<button onClick=\{\(e\)[^<]*?FaThumbsUp[\s\S]*?<\/button>/g, '');

const currPortalStart = currCode.indexOf('return createPortal(');
const currPortalEnd = currCode.lastIndexOf(');');
let currPortal = currCode.substring(currPortalStart + 20, currPortalEnd);

const mergedPortal = '  return createPortal(\\n' +
  '    <>\\n' +
  '      <div className=\"hidden md:block\">\\n' +
  oldPortal.trim().replace(/,\\s*document\\.body\\s*$/, '') + '\\n' +
  '      </div>\\n' +
  '      <div className=\"block md:hidden\">\\n' +
  currPortal.trim().replace(/,\\s*document\\.body\\s*$/, '') + '\\n' +
  '      </div>\\n' +
  '    </>,\\n' +
  '    document.body\\n' +
  '  );\\n';

const newCode = currCode.substring(0, currPortalStart) + mergedPortal + '};\\n\\nexport default MovieModal;\\n';
fs.writeFileSync('src/components/MovieModal.jsx', newCode);
console.log('Merged!');

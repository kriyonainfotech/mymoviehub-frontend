const fs = require('fs');
let code = fs.readFileSync('src/components/Hero.jsx', 'utf8');
code = code.replace("import MovieModal from './MovieModal';", "import { useNavigate } from 'react-router-dom';");
code = code.replace(/const Hero = \(\{ banner \}\) => \{/, "const Hero = ({ banner }) => {\n  const navigate = useNavigate();");
code = code.replace(/onClick=\{.*?setShowModal\(true\).*?\}/s, "onClick={() => navigate('/movie/' + banner.movie._id)}");
code = code.replace(/\{showModal && banner\.movie && \([\s\S]*?\}\)/, "");
fs.writeFileSync('src/components/Hero.jsx', code);

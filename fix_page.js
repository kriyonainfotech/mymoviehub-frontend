const fs = require('fs');
let code = fs.readFileSync('src/pages/MovieDetails.jsx', 'utf8');

// Fix imports
code = code.replace(/import \{ getDriveDirectLink \} from '.\/Row';/, "import { getDriveDirectLink } from '../components/Row';\nimport { useParams, useNavigate } from 'react-router-dom';\nimport VideoPlayer from '../components/VideoPlayer';");
code = code.replace(/import AdsterraAd from '.\/AdsterraAd';/, "import AdsterraAd from '../components/AdsterraAd';");

// Replace modal signature with page signature
code = code.replace(/const MovieModal = \(\{ movie: initialMovie, onClose, onPlay \}\) => \{/, "const MovieDetails = () => {\n  const { id } = useParams();\n  const navigate = useNavigate();\n  const [currentMovie, setCurrentMovie] = useState(null);\n  const [playingMovie, setPlayingMovie] = useState(null);\n  const [loading, setLoading] = useState(true);");

// Remove initialMovie dependencies
code = code.replace(/useEffect\(\(\) => \{\n    setCurrentMovie\(initialMovie\);\n    setSelectedSeasonIndex\(0\);\n    setImageLoading\(true\);\n  \}, \[initialMovie\]\);/, "");

// Fix fetch movie by ID
code = code.replace(/const container = document.getElementById\('movie-modal-container'\);\n    if \(container\) container.scrollTo\(\{ top: 0, behavior: 'smooth' \}\);/, "window.scrollTo(0,0);");
code = code.replace(/useEffect\(\(\) => \{\n    window.scrollTo\(0,0\);\n  \}, \[currentMovie\]\);/, useEffect(() => {
    window.scrollTo(0,0);
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await axios.get(import.meta.env.VITE_API_URL + '/api/admin/movies');
        const found = res.data.find(m => m._id === id);
        if(found) {
          setCurrentMovie(found);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]););

// Remove body overflow hidden
code = code.replace(/document.body.style.overflow = 'hidden';/g, "");
code = code.replace(/return \(\) => \{\n      document.body.style.overflow = 'auto';\n    \};/, "return () => {};");

// Change modal layout to page layout
code = code.replace(/return createPortal\(/, "if (loading) return <div className='min-h-screen pt-20 text-center'>Loading...</div>;\n  if (!currentMovie) return <div className='min-h-screen pt-20 text-center'>Movie not found</div>;\n\n  return (");
code = code.replace(/<div id="movie-modal-container" className="fixed inset-0 z-\[9998\] overflow-y-scroll overflow-x-hidden bg-black\/80 scrollbar-hide md:pt-10 md:pb-20 md:px-4">/g, "<div className='pt-16 md:pt-20 min-h-screen bg-[#141414] text-white px-4 md:px-8 max-w-7xl mx-auto'>");
code = code.replace(/<div className={elative bg-\[#181818\] w-full max-w-4xl mx-auto md:rounded-xl shadow-2xl h-max pb-10 transition-all duration-300 transform \$\{isAnimating \? 'opacity-0 scale-95' : 'opacity-100 scale-100'\}}>/g, "<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>\n<div className='lg:col-span-2'>");
code = code.replace(/\{\/\* Close Button \*\/\}([\s\S]*?)<\/button>/, ""); // Remove close button

// Now replace bottom of modal </div>, document.body);
code = code.replace(/<\/div>,\n    document.body\n  \);/, "</div>\n</div>\n{playingMovie && <VideoPlayer movie={playingMovie} onClose={() => setPlayingMovie(null)} />}\n</div>\n  );");

code = code.replace(/export default MovieModal;/, "export default MovieDetails;");
fs.writeFileSync('src/pages/MovieDetails.jsx', code);

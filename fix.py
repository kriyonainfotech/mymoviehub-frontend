import re

code = open('src/pages/MovieDetails.jsx', 'r', encoding='utf-8').read()

code = code.replace("import { getDriveDirectLink } from './Row';", "import { getDriveDirectLink } from '../components/Row';\nimport { useParams, useNavigate } from 'react-router-dom';\nimport VideoPlayer from '../components/VideoPlayer';")
code = code.replace("import AdsterraAd from './AdsterraAd';", "import AdsterraAd from '../components/AdsterraAd';")

code = re.sub(r'const MovieModal = \(\{ movie: initialMovie, onClose, onPlay \}\) => \{', '''const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentMovie, setCurrentMovie] = useState(null);
  const [playingMovie, setPlayingMovie] = useState(null);
  const [loading, setLoading] = useState(true);''', code)

code = re.sub(r'useEffect\(\(\) => \{\n    setCurrentMovie\(initialMovie\);\n    setSelectedSeasonIndex\(0\);\n    setImageLoading\(true\);\n  \}, \[initialMovie\]\);', '', code)

code = re.sub(r'const container = document.getElementById\(\'movie-modal-container\'\);\n    if \(container\) container.scrollTo\(\{ top: 0, behavior: \'smooth\' \}\);', 'window.scrollTo(0,0);', code)

code = re.sub(r'document.body.style.overflow = \'hidden\';', '', code)
code = re.sub(r'return \(\) => \{\n      document.body.style.overflow = \'auto\';\n    \};', 'return () => {};', code)

code = re.sub(r'useEffect\(\(\) => \{\n    window.scrollTo\(0,0\);\n  \}, \[currentMovie\]\);', '''useEffect(() => {
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
  }, [id]);''', code)

code = re.sub(r'return createPortal\(', '''if (loading) return <div className='min-h-screen pt-20 text-center text-white'>Loading...</div>;
  if (!currentMovie) return <div className='min-h-screen pt-20 text-center text-white'>Movie not found</div>;

  return (''', code)

code = re.sub(r'<div id=\"movie-modal-container\" className=\"fixed inset-0 z-\[9998\] overflow-y-scroll overflow-x-hidden bg-black/80 scrollbar-hide md:pt-10 md:pb-20 md:px-4\">', '<div className="pt-16 md:pt-24 min-h-screen bg-[#141414] text-white px-4 md:px-8 max-w-7xl mx-auto pb-20">', code)
code = re.sub(r'<div className=\{elative bg-\[#181818\] w-full max-w-4xl mx-auto md:rounded-xl shadow-2xl h-max pb-10 transition-all duration-300 transform \$\{isAnimating \? \'opacity-0 scale-95\' : \'opacity-100 scale-100\'\}\}>', '<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">\n<div className="lg:col-span-2 bg-[#181818] rounded-xl overflow-hidden shadow-2xl h-max pb-10">', code)

code = re.sub(r'\{/\* Close Button \*/\}([\s\S]*?)</button>', '', code)
code = re.sub(r'</div>,\n    document.body\n  \);', '</div>\n{playingMovie && <VideoPlayer movie={playingMovie} onClose={() => setPlayingMovie(null)} />}\n</div>\n  );', code)

code = code.replace('export default MovieModal;', 'export default MovieDetails;')

# Rearrange 'More Like This' to be outside the main div (in the right column)
more_like_this = re.search(r'\{/\* More Like This Section \*/\}([\s\S]*?)(?=</div>\n</div>\n\{playingMovie)', code)
if more_like_this:
    mlt_content = more_like_this.group(0)
    code = code.replace(mlt_content, '')
    # Insert it right before the playingMovie
    code = code.replace('{playingMovie &&', '</div>\n<!-- RIGHT COLUMN -->\n<div className="lg:col-span-1">\n' + mlt_content.replace('grid-cols-2 md:grid-cols-3', 'grid-cols-2') + '\n</div>\n{playingMovie &&')
    code = code.replace('<!-- RIGHT COLUMN -->', '')

open('src/pages/MovieDetails.jsx', 'w', encoding='utf-8').write(code)

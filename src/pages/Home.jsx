import { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import Row from '../components/Row';
import NoticeBanner from '../components/NoticeBanner';
import MonetagBanner from '../components/MonetagBanner';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [movies, setMovies] = useState([]);
  const [tvSeries, setTvSeries] = useState([]);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, movRes, banRes] = await Promise.all([
          axios.get(import.meta.env.VITE_API_URL + '/api/admin/categories'),
          axios.get(import.meta.env.VITE_API_URL + '/api/admin/movies'),
          axios.get(import.meta.env.VITE_API_URL + '/api/admin/banners')
        ]);
        setCategories(catRes.data);
        setMovies(movRes.data);
        
        const homeBanner = banRes.data.find(b => (b.pages && b.pages.includes('home')) || b.page === 'home');
        setBanner(homeBanner);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Filter categories that should appear on home page
  const homeCategories = categories.filter(c => c.sections && c.sections.includes('home'));

  return (
    <>
      <Hero banner={banner} />
      
      {/* Important Note Banner */}
      <NoticeBanner />



      {/* Rows */}
      <div className="-mt-4 relative z-10">
        {homeCategories.map((category, index) => {
          // Find movies belonging to this category
          const categoryMovies = movies.filter(m => m.categories.some(c => c._id === category._id));
          if (categoryMovies.length === 0) return null; // Don't show empty categories
          
          return (
            <div key={category._id}>
              <Row 
                title={category.name} 
                isLargeRow={category.isLargeRow}
                movies={categoryMovies} 
              />
              {index === 1 && (
                <MonetagBanner />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Home;

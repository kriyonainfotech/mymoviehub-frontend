import { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import Row from '../components/Row';
import NoticeBanner from '../components/NoticeBanner';
import AdsterraAd from '../components/AdsterraAd';

const TvSeries = () => {
  const [categories, setCategories] = useState([]);
  const [movies, setMovies] = useState([]);
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
        setMovies(movRes.data.filter(m => m.type === 'tvseries'));
        
        const seriesBanner = banRes.data.find(b => (b.pages && b.pages.includes('tvseries')) || b.page === 'tvseries');
        setBanner(seriesBanner);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const seriesCategories = categories.filter(c => c.sections && c.sections.includes('tvseries'));

  return (
    <>
      <Hero banner={banner} />
      
      {/* Important Note Banner */}
      <NoticeBanner />

      <div className="hidden md:block">
        <AdsterraAd width={728} height={90} adKey="3e52a7de4f64eb578996bc017ab9863c" />
      </div>
      <div className="md:hidden">
        <AdsterraAd width={320} height={50} adKey="b06804870a5a3c679877784e41216b13" />
      </div>

      {/* Rows */}
      <div className="-mt-4 relative z-10">
        {seriesCategories.map((category, index) => {
          const categoryMovies = movies.filter(m => m.categories.some(c => c._id === category._id));
          if (categoryMovies.length === 0) return null;
          
          return (
            <Row 
              key={category._id} 
              title={category.name} 
              isLargeRow={category.isLargeRow}
              movies={categoryMovies} 
            />
          );
        })}
      </div>
    </>
  );
};

export default TvSeries;

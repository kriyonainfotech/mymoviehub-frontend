import { useEffect, useRef } from 'react';

const MonetagBanner = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Prevent multiple injections
    if (containerRef.current && containerRef.current.children.length === 0) {
      const script = document.createElement('script');
      script.dataset.zone = '9048332';
      script.src = 'https://n6wxm.com/vignette.min.js';
      
      // We append it to this specific container to try to render it inline
      containerRef.current.appendChild(script);
    }
  }, []);

  return <div ref={containerRef} className="w-full flex justify-center my-8 min-h-[90px]" />;
};

export default MonetagBanner;

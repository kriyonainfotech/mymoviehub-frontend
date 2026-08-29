import { useEffect, useRef } from 'react';

const AdsterraNative = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && containerRef.current.children.length === 1) { // 1 because the div is already there
      const script = document.createElement('script');
      script.async = true;
      script.dataset.cfasync = 'false';
      script.src = 'https://pl25257052.profitableratecpmnetwork.com/2fb8c19bbc949bb6169d1d46afb69088/invoke.js';
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full flex justify-center my-6" ref={containerRef}>
      <div id="container-2fb8c19bbc949bb6169d1d46afb69088"></div>
    </div>
  );
};

export default AdsterraNative;

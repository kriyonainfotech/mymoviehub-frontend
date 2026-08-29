import { useEffect, useRef } from 'react';

const AdsterraAd = ({ width, height, adKey }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Only inject once
    if (containerRef.current && containerRef.current.children.length === 0) {
      // 1. Set global options for this specific ad (may have race condition if many load instantly, but usually fine)
      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.innerHTML = `
        atOptions = {
          'key' : '${adKey}',
          'format' : 'iframe',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `;
      
      // 2. Load the invoke script
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `https://www.highrevenueformat.com/${adKey}/invoke.js`;
      
      containerRef.current.appendChild(confScript);
      containerRef.current.appendChild(invokeScript);
    }
  }, [adKey, width, height]);

  return (
    <div className="w-full flex justify-center items-center my-4 overflow-hidden">
      <div ref={containerRef} style={{ width: `${width}px`, height: `${height}px`, minWidth: `${width}px`, minHeight: `${height}px` }} />
    </div>
  );
};

export default AdsterraAd;

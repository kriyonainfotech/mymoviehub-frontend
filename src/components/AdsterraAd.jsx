import React from 'react';

const AdsterraAd = ({ width, height, adKey }) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '${adKey}',
            'format' : 'iframe',
            'height' : ${height},
            'width' : ${width},
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highrevenueformat.com/${adKey}/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="w-full flex justify-center items-center my-4">
      <iframe
        srcDoc={htmlContent}
        width={width}
        height={height}
        frameBorder="0"
        scrolling="no"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        style={{ border: 'none', overflow: 'hidden' }}
      ></iframe>
    </div>
  );
};

export default AdsterraAd;

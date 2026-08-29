import { useEffect } from 'react';

const SocialBar = () => {
  useEffect(() => {
    const scriptId = 'adsterra-social-bar';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://pl25263799.profitableratecpmnetwork.com/7c/d5/1f/7cd51f3740e66c29531e70b5e90d1dfb.js';
      document.body.appendChild(script);
    }
  }, []);

  return null;
};

export default SocialBar;

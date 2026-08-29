import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      setError('Failed to log in with Google.');
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full object-cover opacity-20 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/93da5c27-be66-427c-8b72-5cb39d275279/94eb5ad7-10d8-4cca-bf45-ac52e0a052c0/IN-en-20240226-popsignuptwoweeks-perspective_alpha_website_small.jpg')] bg-cover bg-center" />
      <div className="absolute top-0 left-0 w-full h-full bg-black/60" />

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md bg-black/80 p-12 rounded-lg border border-gray-800 shadow-2xl">
        <h1 className="text-[#E50914] text-4xl font-black mb-8 text-center uppercase tracking-wider drop-shadow-md">
          MY MOVIE HUB
        </h1>

        {error && <div className="bg-red-500/20 border-l-4 border-red-500 p-3 mb-6 text-sm">{error}</div>}

        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold mb-2">Sign In</h2>
          <button 
            onClick={handleGoogleLogin}
            className="bg-white text-black font-bold py-3 px-4 rounded flex items-center justify-center gap-3 hover:bg-gray-200 transition"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

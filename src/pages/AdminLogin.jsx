import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const { loginWithEmail, signupWithEmail, staticAdminLogin } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      // Static bypass
      if ((email.trim() === 'admin' || email.trim() === 'admin@gmail.com') && password === 'admin') {
        staticAdminLogin();
        navigate('/admin');
        return;
      }
      
      await loginWithEmail(email.trim(), password);
      if (email.trim().toLowerCase() === 'mymoviehub@admin.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid admin credentials.');
    }
  };

  const handleAdminSignup = async (e) => {
    e.preventDefault();
    try {
      setError('');
      if (email.trim().toLowerCase() !== 'mymoviehub@admin.com') {
         setError('Only mymoviehub@admin.com can be registered as admin.');
         return;
      }
      await signupWithEmail(email.trim(), password);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError('Error creating admin: ' + err.message);
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

        <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <input
            type="text"
            placeholder="Admin Email"
            className="bg-[#333] text-white px-4 py-3 rounded outline-none focus:bg-[#444] transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-[#333] text-white px-4 py-3 rounded outline-none focus:bg-[#444] transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit"
            className="bg-[#E50914] text-white font-bold py-3 rounded mt-4 hover:bg-red-700 transition"
          >
            Sign In to Admin Panel
          </button>
          
          <button 
            type="button"
            onClick={handleAdminSignup}
            className="bg-gray-700 text-white font-bold py-3 rounded mt-2 hover:bg-gray-600 transition"
          >
            Create Admin Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

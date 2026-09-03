import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isStaticAdmin = localStorage.getItem('isStaticAdmin') === 'true';
    
    if (isStaticAdmin) {
      setCurrentUser({ email: 'mymoviehub@admin.com', uid: 'static-admin' });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // Sync user to backend if it's a normal Google user
      if (user && user.email !== 'mymoviehub@admin.com') {
        try {
          const res = await axios.post(import.meta.env.VITE_API_URL + '/api/admin/users/sync', {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          });
          
          if (res.data && res.data.isBlocked) {
            alert('Your account has been restricted by Admin.');
            firebaseSignOut(auth);
            setCurrentUser(null);
            window.location.href = '/login';
          }
        } catch (err) {
          console.error('Error syncing user', err);
        }
      }
      
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const loginWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    localStorage.removeItem('isStaticAdmin');
    await firebaseSignOut(auth);
    window.location.href = '/login';
  };

  const signupWithEmail = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const staticAdminLogin = () => {
    localStorage.setItem('isStaticAdmin', 'true');
    setCurrentUser({ email: 'mymoviehub@admin.com', uid: 'static-admin' });
  };

  const value = {
    currentUser,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    staticAdminLogin,
    logout,
    isAdmin: currentUser?.email === 'mymoviehub@admin.com'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBOxJm4ZZ5maUSmhCFys09SDt6x9TiL6eU",
  authDomain: "mymoviehub-f01ec.firebaseapp.com",
  projectId: "mymoviehub-f01ec",
  storageBucket: "mymoviehub-f01ec.firebasestorage.app",
  messagingSenderId: "407612820702",
  appId: "1:407612820702:web:4bb31b42e79c5100fb864f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };

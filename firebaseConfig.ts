import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyC-1B6x1dsqwvaznUO9-tYK6WPw6c12U1I',
  authDomain: 'mixr-f7c54.firebaseapp.com',
  projectId: 'mixr-f7c54',
  storageBucket: 'mixr-f7c54.appspot.com',
  messagingSenderId: '862004870446',
  appId: '1:862004870446:web:3c7bde5d128f97cf2b8ebf',
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // ✅ Simpler and stable
const db = getFirestore(app);

export { app, auth, db };

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';
import { auth } from '../firebaseConfig';

type AuthContextType = {
  user: User | null;
  loading: boolean; // ✅ Add this line to track loading state
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true, // Default to true while waiting for auth state
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Track if auth is in progress

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('✅ Authenticated:', user.uid);
        setUser(user);
        setLoading(false); // Auth completed
      } else {
        signInAnonymously(auth)
          .then((res) => {
            console.log('✅ Logged in anonymously');
            setUser(res.user);
            setLoading(false); // Auth completed
          })
          .catch((err) => {
            console.error('❌ Auth error:', err);
            setLoading(false); // Auth completed
          });
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

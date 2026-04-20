import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../shared/api/firebase/config';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string;

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    if (ADMIN_EMAIL && result.user.email !== ADMIN_EMAIL) {
      await signOut(auth);
      throw new Error('Unauthorized: Only admin access is allowed.');
    }
  };

  const logout = () => signOut(auth);

  const isAdmin = !!user && (!ADMIN_EMAIL || user.email === ADMIN_EMAIL);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

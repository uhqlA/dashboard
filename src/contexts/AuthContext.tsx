import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check for existing session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Validate token expiration if needed
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse user data', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock authentication - replace with actual API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Demo credentials validation
      const validCredentials = [
        { email: 'admin@kenya-env.go.ke', password: 'demo123', role: 'National Admin', name: 'National Administrator' },
        { email: 'county.admin@kenya-env.go.ke', password: 'demo123', role: 'County Admin', name: 'County Administrator' },
        { email: 'monitor@kenya-env.go.ke', password: 'demo123', role: 'Monitor', name: 'Environmental Monitor' }
      ];
      
      const userCredential = validCredentials.find(cred => cred.email === email && cred.password === password);
      
      if (!userCredential) {
        throw new Error('Invalid email or password');
      }
      
      const userData: User = {
        name: userCredential.name,
        email: userCredential.email,
        role: userCredential.role,
        lastLogin: new Date().toISOString(),
        token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9)
      };
      
      // Store user data and token
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear user data
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

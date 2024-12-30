import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react';
import { api } from '../services/api';

// Define the user interface
interface User {
  id: string;
  username: string;
  email: string;
}

// Define the authentication context type
interface AuthContextType {
  user: User | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
  loading: boolean;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State for user and loading
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Login function
  const login = useCallback(
    async (credentials: { username: string; password: string }) => {
      setLoading(true);
      try {
        // Make API call to login
        const response = await api.post('/login', credentials);
        const data = response.data;

        // Check if there is a jwt token from the backend
        if (data && data.token) {
          // Store the token in local storage
          localStorage.setItem('token', data.token);
        }
        // Update user state with user info from backend, if it exists
        if (data && data.user) {
          setUser(data.user);
        }

        console.log('Login successful');
      } catch (error: any) {
        console.error('Login failed:', error);
        // Handle specific error cases for better ux, e.g. user not found or incorrect credentials.
        alert('Login failed. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Logout function
  const logout = useCallback(() => {
    // Clear user and remove token from local storage
    setUser(null);
    localStorage.removeItem('token');
    console.log('Logout successful');
  }, []);

  // Function to check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem('token');
  }, []);

  // Provider value
  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading,
  };

  // Provide context to all children components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  // Throw error if used outside of the context scope
  if (!context) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
};
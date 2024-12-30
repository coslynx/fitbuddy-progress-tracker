import { useContext } from 'react';
import { useAuthContext, AuthContextType } from '../context/AuthContext';

/**
 * Custom React hook for authentication functionality.
 *
 * @returns {AuthContextType} An object containing user, login, logout, isAuthenticated, and loading properties.
 * @throws {Error} If used outside of the AuthProvider context.
 */
const useAuth = (): AuthContextType => {
  const context = useAuthContext();
    
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
};

export default useAuth;
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from './Button';

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  // Use the useAuth hook to get the authentication state and functions
  const { isAuthenticated, logout, loading } = useAuth();

  // Validate hook response
  if (typeof isAuthenticated !== 'function') {
    console.error('Header: isAuthenticated must be a function.');
    return null;
  }

    if (typeof logout !== 'function') {
        console.error('Header: logout must be a function.');
      return null;
    }
    if(typeof loading !== 'boolean'){
        console.error('Header: loading prop must be a boolean.');
      return null;
    }


  return (
    <header className="bg-background p-4 flex justify-between items-center shadow-md">
      {/* Logo/Brand - clickable link to home page */}
      <Link to="/" className="text-2xl font-bold text-primary">
        Fitness Tracker
      </Link>

      {/* Navigation/Auth Controls */}
      <div className="flex items-center">
        {/* Conditional rendering based on authentication state */}
        {isAuthenticated() ? (
          // If user is authenticated, show logout button
          <Button
            text="Logout"
            variant="secondary"
            onClick={logout}
            disabled={loading}
          />
        ) : (
            <>
            {/* If user is not authenticated, show Login button */}
              <Link to="/" className='mr-2'>Login</Link>
          <Button
            text="Login"
            variant="primary"
              onClick={() => {
                  // Add empty function so the typescript compiler doesn't complain, this button is purely for visual purposes
              }}
          />
            </>
        )}
      </div>
    </header>
  );
};

export default Header;
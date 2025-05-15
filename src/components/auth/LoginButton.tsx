import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';

export const LoginButton: React.FC = () => {
  const { user, signInWithGoogle, signOut } = useAuth();

  const handleAuth = async () => {
    try {
      if (user) {
        await signOut();
      } else {
        await signInWithGoogle();
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <Button
      onClick={handleAuth}
      variant="outline"
      className="flex items-center gap-2"
    >
      {user ? (
        <>
          <img
            src={user.photoURL || ''}
            alt={user.displayName || 'User'}
            className="w-6 h-6 rounded-full"
          />
          Sign Out
        </>
      ) : (
        <>
          <img
            src="/google-icon.svg"
            alt="Google"
            className="w-6 h-6"
          />
          Sign in with Google
        </>
      )}
    </Button>
  );
}; 
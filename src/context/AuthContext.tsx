import React, { createContext, ReactNode, useMemo, useState } from 'react';
import { signIn as amplifySignIn, type SignInInput } from 'aws-amplify/auth';

interface AuthContextProps {
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authProps = useMemo(() => ({ isAuthenticated, signIn, signOut }), []); 

  const signIn = async (email: string, password: string) => {
    try {
      const { isSignedIn, nextStep }  = await amplifySignIn({ username: email, password} as SignInInput);
      console.log('Inicio de sesión exitoso:', isSignedIn);
      console.log('El siguiente paso es', nextStep);
      if (isSignedIn) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const signOut = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={authProps}>
      {children}
    </AuthContext.Provider>
  );
};
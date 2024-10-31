import React, { createContext, ReactNode, useMemo, useState } from 'react';
import { 
  signIn as amplifySignIn,
  fetchUserAttributes as amplifyFetchUserAttributes,
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  signOut as amplifySignOut,
  type SignInInput 
} from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import awsconfig from '../aws-exports';
import { Alert } from 'react-native';

interface AuthContextProps {
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (userInfo: { correo: string; password: string; nombres: string; apellidos: string; telefono: string }) => Promise<string>;
  confirmSignUp: (username: string, confirmationCode: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchUserAttributes: () => Promise<{ userUuid: string, userName: string }>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps>({ 
    isAuthenticated: false,
    signIn: async (email: string, password: string) => new Promise<boolean>(() => false),
    signUp: (userInfo: { correo: string; password: string; nombres: string; apellidos: string; telefono: string } ) => new Promise<string>(() => ''),
    confirmSignUp: async (username: string, confirmationCode: string) => { return; },
    signOut: async () => { return; },
    fetchUserAttributes: () => new Promise<{ userUuid: string, userName: string }>(() => {})
});

Amplify.configure(awsconfig);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = async (email: string, password: string) : Promise<boolean> => {
    try {
      // Llamada al método de AWS Cognito para iniciar sesión
      console.log('AQUI amplifySignIn', amplifySignIn);
      const { isSignedIn, nextStep }  = await amplifySignIn({ username: email, password} as SignInInput);
      console.log('Inicio de sesión exitoso:', isSignedIn);
      console.log('El siguiente paso es', nextStep);

      if (isSignedIn) {
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    } catch (error) {
      console.debug('Error al iniciar sesión:', error);
      if (error instanceof Error && error.name === "UserAlreadyAuthenticatedException") {
        return Promise.resolve(true);
      } else {
        Alert.alert('Error', 'Correo o contraseña incorrectos');
        return Promise.resolve(false);
      }
    }
  };

  const signUp = async (userInfo: { 
    correo: string;
    password: string;
    nombres: string;
    apellidos: string,
    telefono: string 
  }) : Promise<string> => {
    try {
      // Llamada al método de AWS Cognito para crear usuario
      const { userId, nextStep }  = await amplifySignUp({
          username: userInfo.correo,
          password: userInfo.password,
          options: {
              userAttributes: {
                  email: userInfo.correo,
                  given_name: userInfo.nombres,
                  family_name: userInfo.apellidos,
                  phone_number: "+57" + userInfo.telefono,
              }
          }
      });
      console.log('Se creó el usuario', userId);
      console.log('El siguiente paso es', nextStep);
      return Promise.resolve(userId || '');
    } catch (error) {
      console.debug('Error al registrar el usuario:', error);
      return Promise.resolve('');
    }
  };

  const confirmSignUp = async (username: string, confirmationCode: string) : Promise<void> => {
    try {
      const { nextStep } = await amplifyConfirmSignUp({ username, confirmationCode });
      console.log('Estado del registro del usuario: ', nextStep);
      return Promise.resolve();
    } catch (error) {
      console.debug("Error confirmando el código:", error);
      Alert.alert("Error", "Error confirmando el código.");
      return Promise.resolve();
    }
  };

  const fetchUserAttributes = async () : Promise<{ userUuid: string; userName: string; }> => {
    const userAttributeToReturn = { userUuid: '', userName: '' }
    try {
      const userAttribute = await amplifyFetchUserAttributes();
      console.log('Los atributos del usuario son: ', userAttribute);
      setIsAuthenticated(true);
      return Promise.resolve({...userAttributeToReturn, userUuid: userAttribute.sub || '', userName: userAttribute.given_name || ''});
    } catch (error) {
      console.error('Error al obtener los atributos del usuario:', error);
      return Promise.resolve(userAttributeToReturn);
    }
  };

  const signOut = async () : Promise<void> => {
    try {
      await amplifySignOut();
      console.log('Se realizó sign out exitosamente');
      setIsAuthenticated(false);
      return Promise.resolve();
    } catch (error) {
      console.log('Error al cerrar la sesión: ', error);
      return Promise.resolve();
    }
  };

  const authProps = useMemo(() => ({ isAuthenticated, signIn, signUp, confirmSignUp, signOut, fetchUserAttributes }), [isAuthenticated]);

  return (
    <AuthContext.Provider value={authProps}>
      {children}
    </AuthContext.Provider>
  );
};
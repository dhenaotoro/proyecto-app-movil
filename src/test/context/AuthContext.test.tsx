import { cleanup, waitFor, render, userEvent } from '@testing-library/react-native';
import React, { useContext } from 'react';
import { it, test, describe } from '@jest/globals';
import {
    signIn as amplifySignIn,
    signUp as amplifySignUp,
    confirmSignUp as amplifyConfirmSignUp,
    fetchUserAttributes as amplifyFetchUserAttributes,
    signOut as amplifySignOut,
} from 'aws-amplify/auth';
import { Alert, Button, Text } from "react-native";
import { AuthContext, AuthProvider } from '../../context/AuthContext';

jest.mock('aws-amplify/auth', () => ({
    Amplify: {
        configure: jest.fn()
    },
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    confirmSignUp: jest.fn(),
    fetchUserAttributes: jest.fn()
}));

describe('AuthContext', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    const TestComponent = () : React.JSX.Element => {
        // Utiliza el contexto de autenticación en un componente ficticio para realizar pruebas
        const { signIn, signUp, confirmSignUp, signOut, fetchUserAttributes, isAuthenticated } = useContext(AuthContext);
    
        return (
            <>
                {isAuthenticated ? <Text>Logged In</Text> : <Text>Logged Out</Text>}
                {/* Botones ficticios para pruebas */}
                <Button title="Sign In" onPress={async () => signIn('test@email.com', 'test')} />
                <Button title="Sign Up" onPress={() =>
                    signUp({
                        correo: 'test@email.com',
                        password: 'password',
                        nombres: 'Test',
                        apellidos: 'User',
                        telefono: '123456789',
                    })
                }
                />
                <Button title="Confirm Sign Up" onPress={() => confirmSignUp('test@email.com', '123456')} />
                <Button title="Sign Out" onPress={ signOut } />
                <Button title="Fetch User Attributes" onPress={ fetchUserAttributes } />
            </>
        );
    };
    
    const renderWithAuthProvider = () =>
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
    
    test('should sign in successfully', async () => {
        const user = userEvent.setup();
        (amplifySignIn as jest.Mock).mockResolvedValueOnce({ isSignedIn: true });
    
        const { getByText } = renderWithAuthProvider();
    
        await user.press(getByText('Sign In'));
    
        await waitFor(() => {
          expect(amplifySignIn).toHaveBeenCalledWith({ username: 'test@email.com', password: 'test' });
        });
    
        await waitFor(() => {
            expect(getByText('Sign In')).toBeTruthy();
        });
    }, 10000);
    
    it('should handle sign in failure when credentials are invalid', async () => {
        const user = userEvent.setup();
        (amplifySignIn as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));
        const alertSpy = jest.spyOn(Alert, 'alert');
    
        const { getByText } = renderWithAuthProvider();
        
        await user.press(getByText('Sign In'));
    
        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Error', 'Correo o contraseña incorrectos');
        });
    }, 10000);

    it('should handle sign in failure when Cognito reponds isSignedIn as false', async () => {
      const user = userEvent.setup();
      (amplifySignIn as jest.Mock).mockResolvedValueOnce({ isSignedIn: false, nextStep: 'Register' });
      
      const { getByText } = renderWithAuthProvider();
    
      await user.press(getByText('Sign In'));
  
      await waitFor(() => {
        expect(amplifySignIn).toHaveBeenCalledWith({ username: 'test@email.com', password: 'test' });
      });
  
      await waitFor(() => {
          expect(getByText('Sign In')).toBeTruthy();
      });
    });

    it('should handle sign in failure when user is already signed in', async () => {
        const user = userEvent.setup();
        (amplifySignIn as jest.Mock).mockRejectedValueOnce(Object.assign(new Error('User already signed in'), { name: 'UserAlreadyAuthenticatedException' }));
    
        const { getByText } = renderWithAuthProvider();
        
        await user.press(getByText('Sign In'));
    
        await waitFor(() => {
            expect(amplifySignIn).toHaveBeenCalled();
        });
    });
    
    it('should sign up successfully', async () => {
        const user = userEvent.setup();
        (amplifySignUp as jest.Mock).mockResolvedValueOnce({ userId: 'user-123', nextStep: 'verify' });
    
        const { getByText } = renderWithAuthProvider();
        
        await user.press(getByText('Sign Up'));
    
        await waitFor(() => {
          expect(amplifySignUp).toHaveBeenCalledWith({
            username: 'test@email.com',
            password: 'password',
            options: {
              userAttributes: {
                email: 'test@email.com',
                given_name: 'Test',
                family_name: 'User',
                phone_number: '+57123456789',
              },
            },
          });
        });
    });

    it('should handle sign up in failure', async () => {
        const user = userEvent.setup();
        (amplifySignUp as jest.Mock).mockRejectedValueOnce(new Error('Invalid request'));
    
        const { getByText } = renderWithAuthProvider();
        
        await user.press(getByText('Sign Up'));
    
        await waitFor(() => {
          expect(amplifySignUp).toHaveBeenCalledWith({
            username: 'test@email.com',
            password: 'password',
            options: {
              userAttributes: {
                email: 'test@email.com',
                given_name: 'Test',
                family_name: 'User',
                phone_number: '+57123456789',
              },
            },
          });
        });
    });
    
    it('should confirm sign up successfully', async () => {
        const user = userEvent.setup();
        (amplifyConfirmSignUp as jest.Mock).mockResolvedValueOnce({ nextStep: 'signIn' });
    
        const { getByText } = renderWithAuthProvider();
        
        await user.press(getByText('Confirm Sign Up'));
    
        await waitFor(() => {
          expect(amplifyConfirmSignUp).toHaveBeenCalledWith({ username: 'test@email.com', confirmationCode: '123456' });
        });
    });

    it('should handle confirm sign up in failure', async () => {
        const user = userEvent.setup();
        (amplifyConfirmSignUp as jest.Mock).mockRejectedValueOnce(new Error('Invalid confirmation code'));
        const alertSpy = jest.spyOn(Alert, 'alert');

        const { getByText } = renderWithAuthProvider();
        
        await user.press(getByText('Confirm Sign Up'));
    
        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Error', 'Error confirmando el código.');
        });
    });
    
    it('should fetch user attributes successfully', async () => {
        const user = userEvent.setup();
        (amplifyFetchUserAttributes as jest.Mock).mockResolvedValueOnce({
          sub: 'uuid-123',
          given_name: 'Test',
        });
    
        const { getByText } = renderWithAuthProvider();
        
        await user.press(getByText('Fetch User Attributes'));
    
        await waitFor(() => {
          expect(amplifyFetchUserAttributes).toHaveBeenCalled();
        });
    });

    it('should handle fetch user attributes in failure', async () => {
        const user = userEvent.setup();
        (amplifyFetchUserAttributes as jest.Mock).mockRejectedValueOnce(new Error('Internal server error'));
    
        const { getByText } = renderWithAuthProvider();
        
        await user.press(getByText('Fetch User Attributes'));
    
        await waitFor(() => {
          expect(amplifyFetchUserAttributes).toHaveBeenCalled();
        });
    });
    
    it('should sign out successfully', async () => {
        const user = userEvent.setup();
        (amplifySignOut as jest.Mock).mockResolvedValueOnce(undefined);
    
        const { getByText } = renderWithAuthProvider();
        
        await user.press(getByText('Sign Out'));
    
        await waitFor(() => {
          expect(amplifySignOut).toHaveBeenCalled();
        });
    
        await waitFor(() => {
          expect(getByText('Logged Out')).toBeTruthy();
        });
    });

    it('should handle sign out in failure', async () => {
        const user = userEvent.setup();
        (amplifySignOut as jest.Mock).mockRejectedValueOnce(new Error('Internal server error'));
    
        const { getByText } = renderWithAuthProvider();
        
        await user.press(getByText('Sign Out'));
    
        await waitFor(() => {
          expect(amplifySignOut).toHaveBeenCalled();
        });
    });
});
import { cleanup, waitFor, render, screen, userEvent } from '@testing-library/react-native';
import React from 'react';
import { it, describe } from '@jest/globals';
import { Login } from '../../../screens/Auth/Login';
import { signIn } from 'aws-amplify/auth';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Alert } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/RootNavigator';

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'), // Esto mantiene el resto del módulo intacto
    useNavigation: jest.fn()
}));
jest.mock('aws-amplify/auth', () => ({
    Amplify: {
        configure: jest.fn()
    },
    signIn: jest.fn()
}));

describe('Login', () => {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    const renderComponent = () => {
        return render(
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen name="Login" component={Login} initialParams={{ userId: '' }}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    };

    it('should show an introductory text', () => {
        renderComponent();
    
        expect(screen.getByRole('text', { name: 'Bienvenido(a), inicia sesión con tu correo y contraseña.'})).toBeDefined();
    });

    it('should show input texts for email and password', () => {
        renderComponent();
    
        expect(screen.getByLabelText('Correo')).toBeDefined();
        expect(screen.getByLabelText('Contraseña')).toBeDefined();
    });

    it('should show a text link to change password', () => {
        renderComponent();
    
        expect(screen.getByRole('text', { name: 'Olvidaste tu contraseña?'})).toBeDefined();
    });

    it('should show a button to login', () => {
        renderComponent();
    
        expect(screen.getByLabelText('loginButton')).toBeDefined();
    });

    it('should show a text link to register a new user', () => {
        renderComponent();
    
        expect(screen.getByRole('text', { name: 'No tienes cuenta? Regístrate'})).toBeDefined();
    });

    it('should navigate to the Register screen when clicking on the Register text link', async () => {
        const user = userEvent.setup();

        const mockNavigate = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({
            navigate: mockNavigate,
            goBack: jest.fn()
        });
        renderComponent();
    
        await user.press(screen.getByRole('text', { name: 'No tienes cuenta? Regístrate'}));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('Register');
        });
    });

    it('should call the handlePress method when clicking the Ingresar button', async () => {
        const user = userEvent.setup();

        const mockNavigate = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({
            navigate: mockNavigate,
            goBack: jest.fn()
        });
        (signIn as jest.Mock).mockReturnValue({
            isSignedIn: true,
            nextStep: 'COMPLETED'
        });
        renderComponent();
    
        await user.type(screen.getByLabelText('Correo'), 'test@email.com');
        await user.type(screen.getByLabelText('Contraseña'), 'T345sdad');

        await user.press(screen.getByLabelText('loginButton'));

        await waitFor(() => {
            expect(signIn).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('ListarPQRs', {'userUuid': '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45'});
        });
    });

    it('should show an Alert when signIn fails', async () => {
        const user = userEvent.setup();

        (signIn as jest.Mock).mockRejectedValue({});
        const alertFn = jest.spyOn(Alert, 'alert');

        renderComponent();
    
        await user.type(screen.getByLabelText('Correo'), 'test@email.com');
        await user.type(screen.getByLabelText('Contraseña'), 'T345sdad');

        await user.press(screen.getByLabelText('loginButton'));

        await waitFor(() => {
            expect(signIn).toHaveBeenCalled();
            expect(alertFn).toHaveBeenCalled();
        });
    });

    it('should show navigate to the list of PQRs when user is already signed', async () => {
        const user = userEvent.setup();

        (signIn as jest.Mock).mockRejectedValue(Object.assign(new Error("There is already a signed in user."), { name: "UserAlreadyAuthenticatedException" }));
        const mockNavigate = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({
            navigate: mockNavigate,
            goBack: jest.fn()
        });
        renderComponent();
    
        await user.type(screen.getByLabelText('Correo'), 'test@email.com');
        await user.type(screen.getByLabelText('Contraseña'), 'T345sdad');

        await waitFor(() => {user.press(screen.getByLabelText('loginButton'))});

        await waitFor(() => {
            expect(signIn).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('ListarPQRs', {'userUuid': '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45'});
        });
    });
});
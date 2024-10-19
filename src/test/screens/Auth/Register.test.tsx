import { render, screen, userEvent } from '@testing-library/react-native';
import 'react-native';
import React from 'react';
import { it, describe } from '@jest/globals';
import { UserEventInstance } from '@testing-library/react-native/build/user-event/setup';
import { Login } from '../../../screens/Auth/Login';
import { signUp } from 'aws-amplify/auth';
import { useNavigation } from '@react-navigation/native';
import { Alert } from "react-native";

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'), // Esto mantiene el resto del módulo intacto
    useNavigation: jest.fn()
}));
jest.mock('aws-amplify/auth', () => ({
    signUp: jest.fn()
}));

describe('Register', () => {
    let user: UserEventInstance;

    beforeEach(() => {
        user = userEvent.setup();
    });

    it('should show an introductory text', () => {
        render(<Login />);
    
        expect(screen.getByRole('text', { name: 'Bienvenido(a), inicia sesión con tu correo y contraseña.'})).toBeDefined();
    });

    it('should show input texts for email and password', () => {
        render(<Login />);
    
        expect(screen.getByLabelText('Correo')).toBeDefined();
        expect(screen.getByLabelText('Contraseña')).toBeDefined();
    });

    it('should show a text link to change password', () => {
        render(<Login />);
    
        expect(screen.getByRole('text', { name: 'Olvidaste tu contraseña?'})).toBeDefined();
    });

    it('should show a button to login', () => {
        render(<Login />);
    
        expect(screen.getByLabelText('loginButton')).toBeDefined();
    });

    it('should show a text link to register a new user', () => {
        render(<Login />);
    
        expect(screen.getByRole('text', { name: 'No tienes cuenta? Regístrate'})).toBeDefined();
    });

    it('should call the handlePress method when clicking the Ingresar button', async () => {
        const mockNavigate = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({
            navigate: mockNavigate,
            goBack: jest.fn()
        });
        (signUp as jest.Mock).mockReturnValue({
            isSignedIn: true,
            nextStep: 'COMPLETED'
        });
        render(<Login />);
    
        await user.type(screen.getByLabelText('Correo'), 'test@email.com');
        await user.type(screen.getByLabelText('Contraseña'), 'T345sdad');

        await user.press(screen.getByLabelText('loginButton'));

        expect(signUp).toHaveBeenCalledWith({ username: 'test@email.com', password: 'T345sdad'});
        expect(mockNavigate).toHaveBeenCalledWith('ListarPQRs');
    });

    it('should show an Alert when signIn fails', async () => {
        const mockNavigate = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({
            navigate: mockNavigate,
            goBack: jest.fn()
        });
        (signUp as jest.Mock).mockRejectedValue({});
        const alertFn = jest.spyOn(Alert, 'alert');

        render(<Login />);
    
        await user.type(screen.getByLabelText('Correo'), 'test@email.com');
        await user.type(screen.getByLabelText('Contraseña'), 'T345sdad');

        await user.press(screen.getByLabelText('loginButton'));

        expect(signUp).toHaveBeenCalledWith({ username: 'test@email.com', password: 'T345sdad'});
        expect(alertFn).toHaveBeenCalled();
    });
});
import { render, screen, userEvent } from '@testing-library/react-native';
import 'react-native';
import React from 'react';
import { it, describe } from '@jest/globals';
import { UserEventInstance } from '@testing-library/react-native/build/user-event/setup';
import { Login } from '../../../screens/Auth/Login';

jest.mock('@react-navigation/native');
jest.mock('aws-amplify');

describe('InputText', () => {
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
});
import { render, screen, userEvent } from '@testing-library/react-native';
import 'react-native';
import React from 'react';
import { it, describe } from '@jest/globals';
import { UserEventInstance } from '@testing-library/react-native/build/user-event/setup';
import { Register } from '../../../screens/Auth/Register';
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
        render(<Register />);
    
        expect(screen.getByRole('text', { name: 'Gestiona tus PQRs rápidamente, registrate ya!'})).toBeDefined();
    });

    it('should show input forms', () => {
        render(<Register />);
    
        expect(screen.getByTestId('Register.Documento')).toBeDefined();
    });

    it('should show a text link to see the privacy politic', () => {
        render(<Register />);
    
        expect(screen.getByRole('text', { name: 'Acepto la política de privacidad y aviso de privacidad de datos'})).toBeDefined();
    });

    it('should show a button to Register', () => {
        render(<Register />);
    
        expect(screen.getByTestId('Register.Button')).toBeDefined();
    });

    it('should show a text link to go back to Login page', () => {
        render(<Register />);
    
        expect(screen.getByRole('text', { name: 'Cancelar'})).toBeDefined();
    });

    it('should call the handlePress method when clicking the Confirmar button', async () => {
        const mockNavigate = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({
            navigate: mockNavigate,
            goBack: jest.fn()
        });
        (signUp as jest.Mock).mockReturnValue({
            isSignUpComplete: true,
            userId: "ffff-ffff-fffff-ffff-ffff",
            nextStep: 'CONFIRMATION_CODE'
        });
        render(<Register />);
    
        await user.type(screen.getByTestId('Register.Nombres'), 'Nombres');
        await user.type(screen.getByTestId('Register.Apellidos'), 'Apellidos');
        await user.type(screen.getByTestId('Register.Telefono'), '3105679034');
        await user.type(screen.getByTestId('Register.Direccion'), 'Casa 5 Manzana 54');
        await user.type(screen.getByTestId('Register.Correo'), 'test@email.com');
        await user.type(screen.getByTestId('Register.Password'), 'T3chd@2345');
        await user.type(screen.getByTestId('Register.PasswordRepeated'), 'T3chd@2345');


        await user.press(screen.getByTestId('Register.Button'));

        expect(signUp).toHaveBeenCalledWith({
            username: 'test@email.com',
            password: 'T3chd@2345',
            options: {
                userAttributes: {
                    email: 'test@email.com',
                    given_name: 'Nombres',
                    family_name: 'Apellidos',
                    phone_number: '+573105679034',
                }
            }
        });
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

        render(<Register />);
    
        await user.type(screen.getByTestId('Register.Nombres'), 'Nombres');
        await user.type(screen.getByTestId('Register.Apellidos'), 'Apellidos');
        await user.type(screen.getByTestId('Register.Telefono'), '3105679034');
        await user.type(screen.getByTestId('Register.Direccion'), 'Casa 5 Manzana 54');
        await user.type(screen.getByTestId('Register.Correo'), 'test@email.com');
        await user.type(screen.getByTestId('Register.Password'), 'T3chd@2345');
        await user.type(screen.getByTestId('Register.PasswordRepeated'), 'T3chd@2345');


        await user.press(screen.getByTestId('Register.Button'));

        expect(signUp).toHaveBeenCalledWith({
            username: 'test@email.com',
            password: 'T3chd@2345',
            options: {
                userAttributes: {
                    email: 'test@email.com',
                    given_name: 'Nombres',
                    family_name: 'Apellidos',
                    phone_number: '+573105679034',
                }
            }
        });
        expect(alertFn).toHaveBeenCalled();
    });
});
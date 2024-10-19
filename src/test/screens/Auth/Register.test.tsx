import { cleanup, waitFor, render, screen, userEvent } from '@testing-library/react-native';
import 'react-native';
import React from 'react';
import { it, describe } from '@jest/globals';
import { Register } from '../../../screens/Auth/Register';
import { signUp } from 'aws-amplify/auth';
import { useNavigation } from '@react-navigation/native';
import { Alert } from "react-native";
import { registerUser } from "../../../services/api";

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'), // Esto mantiene el resto del módulo intacto
    useNavigation: jest.fn()
}));
jest.mock('aws-amplify/auth', () => ({
    signUp: jest.fn()
}));
jest.mock('../../../services/api', () => ({
    registerUser: jest.fn()
}));

describe('Register', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('should show an introductory text ', () => {
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

    it('should go to the Login when clicking on Cancelar link', async () => {
        const mockNavigate = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({
            navigate: mockNavigate,
            goBack: jest.fn()
        });

        render(<Register />);

        await userEvent.press(screen.getByRole('text', { name: 'Cancelar'}));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('Login');
        });
    });

    it('should call the handlePress method when clicking the Confirmar button', async () => {
        const user = userEvent.setup();
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
        (registerUser as jest.Mock).mockReturnValue({
            code: 201,
            message: 'Usuario creado correctamente'
        });
        render(<Register />);
    
        await user.type(screen.getByTestId('Register.Documento'), '1088245679');
        await user.type(screen.getByTestId('Register.Nombres'), 'Nombres');
        await user.type(screen.getByTestId('Register.Apellidos'), 'Apellidos');
        await user.type(screen.getByTestId('Register.Telefono'), '3105679034');
        await user.type(screen.getByTestId('Register.Direccion'), 'Casa 5 Manzana 54');
        await user.type(screen.getByTestId('Register.Correo'), 'test@email.com');
        await user.type(screen.getByTestId('Register.Password'), 'T3chd@2345');
        await user.type(screen.getByTestId('Register.PasswordRepeated'), 'T3chd@2345');

        await waitFor(() => {
            user.press(screen.getByTestId('Register.Button'));
        });
        
        await waitFor(() => {
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

            expect(registerUser).toHaveBeenCalledWith({
                uuid: 'ffff-ffff-fffff-ffff-ffff',
                nombre: 'Nombres',
                apellido: 'Apellidos',
                email: 'test@email.com',
                telefono: '+573105679034',
                front: 'cliente',
                direccion: 'Casa 5 Manzana 54',
                numero_documento: '1088245679',
                tipo_documento: 'Cedula Ciudadania',
                aceptada_politica_privacidad_datos: false
            });

            expect(mockNavigate).toHaveBeenCalledWith('ActivationCode', { email: 'test@email.com'});
        });

        expect(screen.getByRole('text', { name: 'Confirmar' })).toBeDefined();
    });

    it('should show an Alert when signIn fails', async () => {
        const user = userEvent.setup();
        const mockNavigate = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({
            navigate: mockNavigate,
            goBack: jest.fn()
        });
        (signUp as jest.Mock).mockRejectedValue({});
        const alertFn = jest.spyOn(Alert, 'alert');

        render(<Register />);
    
        await user.type(screen.getByTestId('Register.Documento'), '1088245679');
        await user.type(screen.getByTestId('Register.Nombres'), 'Nombres');
        await user.type(screen.getByTestId('Register.Apellidos'), 'Apellidos');
        await user.type(screen.getByTestId('Register.Telefono'), '3105679034');
        await user.type(screen.getByTestId('Register.Direccion'), 'Casa 5 Manzana 54');
        await user.type(screen.getByTestId('Register.Correo'), 'test@email.com');
        await user.type(screen.getByTestId('Register.Password'), 'T3chd@2347');
        await user.type(screen.getByTestId('Register.PasswordRepeated'), 'T3chd@2347');

        await waitFor(() => {
            user.press(screen.getByTestId('Register.Button'));
        });

        await waitFor(() => {
            expect(signUp).toHaveBeenCalledWith({
                username: 'test@email.com',
                password: 'T3chd@2347',
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

    it('should show an Alert when getStatusPassword method fails', async () => {
        const user = userEvent.setup();

        const alertFn = jest.spyOn(Alert, 'alert');
        render(<Register />);
        
        await user.type(screen.getByTestId('Register.Documento'), '1088245679');
        await user.type(screen.getByTestId('Register.Nombres'), 'Nombres');
        await user.type(screen.getByTestId('Register.Apellidos'), 'Apellidos');
        await user.type(screen.getByTestId('Register.Telefono'), '3105679034');
        await user.type(screen.getByTestId('Register.Direccion'), 'Casa 5 Manzana 54');
        await user.type(screen.getByTestId('Register.Correo'), 'test@email.com');
        await user.type(screen.getByTestId('Register.Password'), 'T3ch');
        await user.type(screen.getByTestId('Register.PasswordRepeated'), 'T3ch');

        await waitFor(() => {
            user.press(screen.getByTestId('Register.Button'));
        });

        await waitFor(() => {
            expect(alertFn).toHaveBeenCalled();
        });
    });
});
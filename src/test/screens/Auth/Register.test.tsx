import { cleanup, waitFor, render, screen, userEvent } from '@testing-library/react-native';
import React from 'react';
import { it, describe } from '@jest/globals';
import { Register } from '../../../screens/Auth/Register';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Alert } from "react-native";
import { registerUser } from "../../../services/Api";
import { MockAuthProvider, mockSignUp } from '../../context/MockProvider';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/RootNavigator';

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'), // Esto mantiene el resto del módulo intacto
    useNavigation: jest.fn()
}));
jest.mock('../../../services/Api', () => ({
    registerUser: jest.fn()
}));

describe('Register', () => {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    const renderComponent = () => {
        return render(
            <NavigationContainer>
                <MockAuthProvider>
                    <Stack.Navigator initialRouteName="Register">
                        <Stack.Screen name="Register" component={Register}/>
                    </Stack.Navigator>
                </MockAuthProvider>
            </NavigationContainer>
        );
    };

    it('should show an introductory text ', () => {
        renderComponent();
    
        expect(screen.getByRole('text', { name: 'Gestiona tus PQRs rápidamente, registrate ya!'})).toBeDefined();
    });

    it('should show input forms', () => {
        renderComponent();
    
        expect(screen.getByTestId('Register.Documento')).toBeDefined();
    });

    it('should show a text link to see the privacy politic', () => {
        renderComponent();
    
        expect(screen.getByTestId('Register.PoliticsLink')).toBeDefined();
        expect(screen.getByTestId('Register.PrivacyLink')).toBeDefined();
    });

    it('should show a button to Register', () => {
        renderComponent();
    
        expect(screen.getByTestId('Register.Button')).toBeDefined();
    });

    it('should show a text link to go back to Login page', () => {
        renderComponent();
    
        expect(screen.getByRole('text', { name: 'Cancelar'})).toBeDefined();
    });

    it('should go to the Login when clicking on Cancelar link', async () => {
        const mockNavigate = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({
            navigate: mockNavigate,
            goBack: jest.fn()
        });

        renderComponent();

        await userEvent.press(screen.getByRole('text', { name: 'Cancelar'}));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('Login');
        });
    });

    it(`should go to the Politics section when clicking on 'política de privacidad' link`, async () => {
        const mockNavigate = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({
            navigate: mockNavigate,
            goBack: jest.fn()
        });

        renderComponent();

        await userEvent.press(screen.getByTestId('Register.PoliticsLink'));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('Politics');
        });
    });

    it(`should go to the Politics section when clicking on 'aviso de privacidad de datos' link`, async () => {
        const mockNavigate = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({
            navigate: mockNavigate,
            goBack: jest.fn()
        });

        renderComponent();

        await userEvent.press(screen.getByTestId('Register.PrivacyLink'));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('Politics');
        });
    });

    it('should call the handlePress method when clicking the Confirmar button', async () => {
        const user = userEvent.setup();
        const mockNavigate = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({
            navigate: mockNavigate,
            goBack: jest.fn()
        });
        mockSignUp.mockResolvedValue('ffff-ffff-fffff-ffff-ffff');
        (registerUser as jest.Mock).mockReturnValue({
            code: 201,
            message: 'Usuario creado correctamente'
        });
        renderComponent();
    
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
            expect(mockSignUp).toHaveBeenCalled();

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
                aceptada_politica_aviso_privacidad: false
            });

            expect(mockNavigate).toHaveBeenCalledWith('ActivationCode', { email: 'test@email.com'});
        });

        expect(screen.getByRole('text', { name: 'Confirmar' })).toBeDefined();
    });

    it('should show an Alert when registerUser endpoint fails', async () => {
        const user = userEvent.setup();
        const mockNavigate = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({
            navigate: mockNavigate,
            goBack: jest.fn()
        });
        mockSignUp.mockResolvedValue('ffff-ffff-ffff-ffff');
        (registerUser as jest.Mock).mockRejectedValue({});
        const alertFn = jest.spyOn(Alert, 'alert');

        renderComponent();
    
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
            expect(mockSignUp).toHaveBeenCalled();
            expect(registerUser).toHaveBeenCalled();
            expect(alertFn).toHaveBeenCalled();
        });
    });

    it('should show an Alert when getStatusPassword method fails', async () => {
        const user = userEvent.setup();

        const alertFn = jest.spyOn(Alert, 'alert');
        renderComponent();
        
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
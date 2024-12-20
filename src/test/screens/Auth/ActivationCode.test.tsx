import { cleanup, waitFor, render, screen, userEvent } from '@testing-library/react-native';
import React from 'react';
import { it, describe } from '@jest/globals';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { ActivationCode } from '../../../screens/Auth/ActivationCode';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { MockAuthProvider, mockConfirmSignUp } from '../../context/MockProvider';

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'), // Esto mantiene el resto del módulo intacto
    useNavigation: jest.fn(),
    useRoute: jest.fn()
}));

describe('Activation Code', () => {
    const Stack = createNativeStackNavigator<RootStackParamList>();

    beforeEach(() => {
        // Mock de useRoute para proporcionar el parámetro `email`
        const mockRouteParams = {
            params: {
                email: 'test@email.com'
            }
        };
        (useRoute as jest.Mock).mockReturnValue(mockRouteParams);
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    const renderComponent = () => {
        return render(
            <NavigationContainer>
                <MockAuthProvider>
                    <Stack.Navigator initialRouteName="ActivationCode">
                        <Stack.Screen name="ActivationCode" component={ActivationCode}/>
                    </Stack.Navigator>
                </MockAuthProvider>
            </NavigationContainer>
        )
    };

    it('should show an introductory text has more than 3 characters', () => {
        renderComponent();
    
        expect(screen.getByRole('text', { name: 'Se envió correo de confirmación al correo t**t@email.com con el código de activación. Por favor verificalo en tu bandeja de entrada y registralo aquí abajo.'})).toBeDefined();
    });

    it('should show an introductory text when email has less than 3 characters', () => {
        // Mock de useRoute para proporcionar el parámetro `email`
        const mockRouteParams = {
            params: {
                email: 'fe@email.com'
            }
        };
        (useRoute as jest.Mock).mockReturnValue(mockRouteParams);

        renderComponent();
    
        expect(screen.getByRole('text', { name: 'Se envió correo de confirmación al correo f***@email.com con el código de activación. Por favor verificalo en tu bandeja de entrada y registralo aquí abajo.'})).toBeDefined();
    });

    it('should show an introductory text when email is empty', () => {
        // Mock de useRoute para proporcionar el parámetro `email`
        const mockRouteParams = {
            params: {
                email: ''
            }
        };
        (useRoute as jest.Mock).mockReturnValue(mockRouteParams);

        renderComponent();
    
        expect(screen.getByRole('text', { name: 'Se envió correo de confirmación al correo ***@***.com con el código de activación. Por favor verificalo en tu bandeja de entrada y registralo aquí abajo.'})).toBeDefined();
    });

    it('should show input text for activation code', () => {
        renderComponent();
    
        expect(screen.getByTestId('ActivationCode.CodigoActivacion')).toBeDefined();
    });

    it('should show a button to ActivationCode', () => {
        renderComponent();
    
        expect(screen.getByTestId('ActivationCode.Button')).toBeDefined();
    });

    it('should call the handlePress method when clicking the Continuar button', async () => {
        const user = userEvent.setup();
        const mockNavigate = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({
            navigate: mockNavigate,
            goBack: jest.fn()
        });
        mockConfirmSignUp.mockReturnValue({
            isSignedIn: true,
            nextStep: 'COMPLETED'
        });
        renderComponent();
    
        await user.type(screen.getByTestId('ActivationCode.CodigoActivacion'), '12456900');
        await user.press(screen.getByTestId('ActivationCode.Button'));

        await waitFor(() => {
            expect(mockConfirmSignUp).toHaveBeenCalledWith('test@email.com', '12456900');
            expect(mockNavigate).toHaveBeenCalledWith('Login');
        });
    });
});
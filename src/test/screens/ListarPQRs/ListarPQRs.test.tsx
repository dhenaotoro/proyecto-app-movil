import React from 'react';
import { waitFor, render, screen, userEvent } from '@testing-library/react-native';
import { it, describe, beforeEach } from '@jest/globals';
import ListarPQRs from '../../../screens/ListarPQRs/ListarPQRs';
import { UserEventInstance } from '@testing-library/react-native/build/user-event/setup';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { useNavigation, NavigationContainer } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'), // Esto mantiene el resto del módulo intacto
  useNavigation: jest.fn()
}));

jest.mock('../../../services/api', () => ({
  fetchPqrs: jest
    .fn()
    .mockImplementationOnce(() => new Promise(() => {})) // Simulates a pending promise for loading state
    .mockResolvedValue([
        { status: 'Abierto', id: '000000001', channel: 'Email' },
        { status: 'Cerrado', id: '000000002', channel: 'Phone' },
        { status: 'Cerrado', id: '000000003', channel: 'Voice' }
    ])
}));

describe('ListarPQRs', () => {
    let user: UserEventInstance;
    const Stack = createNativeStackNavigator<RootStackParamList>();

    beforeEach(() => {
        user = userEvent.setup();
    });
    const renderComponent = () => {
        return render(
            <NavigationContainer>
                <Stack.Navigator initialRouteName="ListarPQRs">
                    <Stack.Screen name="ListarPQRs" component={ListarPQRs} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    };
    it('should show the welcome message and username', async () => {
        renderComponent(); // Use the new render function
        await waitFor(() => expect(screen.getByText('Bienvenido')).toBeDefined());
        await waitFor(() => expect(screen.getByText('IVAN')).toBeDefined());
    });
    it('should show the PQRs header', async () => {
        renderComponent(); // Use the new render function
        await waitFor(() => expect(screen.getByText('PQRs')).toBeDefined());
    });
    it('should display the PQRs table with statuses and codes', async() => {
        renderComponent(); // Use the new render function

        await waitFor(() => expect(screen.getByText('Abierto')).toBeDefined());
        await waitFor(() => expect(screen.getByText('000000001')).toBeDefined());

        const closedTexts = screen.getAllByText('Cerrado');
        await waitFor(() => expect(closedTexts).toHaveLength(2));
        await waitFor(() => expect(screen.getByText('000000002')).toBeDefined());
    });
    it('should show the register PQR button', async() => {
        renderComponent(); // Use the new render function
        await waitFor(() => expect(screen.getByText('Registra tu PQR')).toBeDefined());
    });
    it('should trigger an action when register button is pressed', async () => {
        const mockNavigate = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({
            navigate: mockNavigate,
            goBack: jest.fn()
        });

        renderComponent(); // Use the new render function
        const registerButton = screen.getByText('Registra tu PQR');
        await user.press(registerButton);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('CrearPQRs'));
    });
});
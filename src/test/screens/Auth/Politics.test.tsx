import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { cleanup, render, screen, userEvent, waitFor } from '@testing-library/react-native';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { Politics } from '../../../screens/Auth/Politics';

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'), // Esto mantiene el resto del módulo intacto
    useNavigation: jest.fn()
}));

describe('Politics', () => {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });
    
    const renderComponent = () => {
        return render(
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Politics">
                    <Stack.Screen name="Politics" component={Politics}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    };

    it('should show a title', () => {
        renderComponent();
    
        expect(screen.getByRole('text', { name: 'Política y aviso de privacidad'})).toBeDefined();
    });

    it('should show a title', () => {
        renderComponent();
    
        expect(screen.getByTestId('Politics.Introduction')).toBeDefined();
    });

    it('should navigate to the Register screen when clicking on the Regresar button', async () => {
        const user = userEvent.setup();

        const mockNavigate = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({
            navigate: mockNavigate,
            goBack: jest.fn()
        });
        renderComponent();
    
        await user.press(screen.getByTestId('Politics.Button'));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('Register');
        });
    });
});
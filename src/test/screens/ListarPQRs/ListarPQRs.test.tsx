import { render, screen, userEvent } from '@testing-library/react-native';
import { it, describe, beforeEach } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native'; // Import NavigationContainer
import ListarPQRs from '../../../screens/ListarPQRs/ListarPQRs';
import { UserEventInstance } from '@testing-library/react-native/build/user-event/setup';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import CrearPQRs from '../../../screens/CrearPQRs/CrearPQRs';

describe('ListarPQRs', () => {
    let user: UserEventInstance;
    const Stack = createNativeStackNavigator<RootStackParamList>();

    beforeEach(() => {
        user = userEvent.setup();
    });
    const renderComponent = () => {
        return render(
            <NavigationContainer>
                <ListarPQRs />
                <Stack.Navigator initialRouteName="ListarPQRs">
                    <Stack.Screen name="ListarPQRs" component={ListarPQRs} />
                    <Stack.Screen name="CrearPQRs" component={CrearPQRs} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    };
    it('should show the welcome message and username', () => {
        renderComponent(); // Use the new render function
        expect(screen.getByText('Bienvenido')).toBeDefined();
        expect(screen.getByText('IVAN')).toBeDefined();
    });
    it('should show the PQRs header', () => {
        renderComponent(); // Use the new render function
        expect(screen.getByText('PQRs')).toBeDefined();
    });
    it('should display the PQRs table with statuses and codes', () => {
        renderComponent(); // Use the new render function
        expect(screen.getByText('Abierto')).toBeDefined();
        expect(screen.getByText('000000001')).toBeDefined();
        const closedTexts = screen.getAllByText('Cerrado');
        expect(closedTexts).toHaveLength(2);
        expect(screen.getByText('000000002')).toBeDefined();
    });
    it('should show the register PQR button', () => {
        renderComponent(); // Use the new render function
        expect(screen.getByText('Registra tu PQR')).toBeDefined();
    });
    it('should trigger an action when register button is pressed', async () => {
        renderComponent(); // Use the new render function
        const registerButton = screen.getByText('Registra tu PQR');
        await user.press(registerButton);
    });
});
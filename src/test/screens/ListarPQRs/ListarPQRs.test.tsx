import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import ListarPQRs from '../../../screens/ListarPQRs/ListarPQRs';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { fetchPqrs } from '../../../services/Api';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

jest.mock('../../../services/Api', () => ({
  fetchPqrs: jest.fn(),
}));

describe('ListarPQRs', () => {
  const Stack = createNativeStackNavigator();

  const renderComponent = (initialParams = { userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', name: 'Ivan Dario' }) => {
    return render(
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ListarPQRs">
          <Stack.Screen name="ListarPQRs" component={ListarPQRs} initialParams={initialParams} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the welcome message and username', async () => {
    fetchPqrs.mockResolvedValueOnce({ code: 200, data: [], message: 'Success' });
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Bienvenido')).toBeTruthy();
      expect(screen.getByText('Ivan Dario')).toBeTruthy();
    });
  });

  it('should display fetched PQR data in the table', async () => {
    const mockData = [
      { id: '1', status: 'Abierto', channel: 'App móvil' },
      { id: '2', status: 'Cerrado', channel: 'App web' },
    ];
    fetchPqrs.mockResolvedValueOnce({ code: 200, data: mockData, message: 'Success' });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Abierto')).toBeTruthy();
      expect(screen.getByText('1')).toBeTruthy();
      expect(screen.getByText('App móvil')).toBeTruthy();
    });

    await waitFor(() => {
      expect(screen.getByText('Cerrado')).toBeTruthy();
      expect(screen.getByText('2')).toBeTruthy();
      expect(screen.getByText('App web')).toBeTruthy();
    });
  });

  it('should show a message when no PQRs are found', async () => {
    fetchPqrs.mockResolvedValueOnce({ code: 200, data: [], message: 'Success' });

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('No hay PQR solicitados, por favor crear tu primer PQR usando la opción de Registra tu PQR')
      ).toBeTruthy();
    });
  });

  it('should navigate to CrearPQRs when the register button is pressed', async () => {
    const mockNavigate = jest.fn();
    useNavigation.mockReturnValue({ navigate: mockNavigate });

    fetchPqrs.mockResolvedValueOnce({ code: 200, data: [], message: 'Success' });

    renderComponent();

    const registerButton = await screen.findByText('Registra tu PQR');
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('CrearPQRs', { userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', name: 'Ivan Dario' });
    });
  });

});

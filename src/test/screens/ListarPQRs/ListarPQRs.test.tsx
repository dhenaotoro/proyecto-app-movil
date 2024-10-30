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

  const renderComponent = (initialParams = { userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', userName: 'Ivan Dario', executeList: true }) => {
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
    const mockNavigate = jest.fn();
    const mockSetParams = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate, setParams: mockSetParams });

    (fetchPqrs as jest.Mock).mockResolvedValueOnce({ code: 200, data: [], message: 'Success' });
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Bienvenido')).toBeTruthy();
      expect(screen.getByText('IVAN DARIO')).toBeTruthy();
    });
  });

  it('should display fetched PQR data in the table', async () => {
    const mockData = [
      { id: '1', status: 'Abierto', channel: 'App móvil' },
      { id: '2', status: 'Cerrado', channel: 'App web' },
    ];
    (fetchPqrs as jest.Mock).mockResolvedValueOnce({ code: 200, data: mockData, message: 'Success' });

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
    (fetchPqrs as jest.Mock).mockResolvedValueOnce({ code: 200, data: [], message: 'Success' });

    renderComponent({ userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', userName: 'Ivan Dario', executeList: false });

    await waitFor(() => {
      expect(
        screen.getByText('No hay PQR solicitados, por favor crear tu primer PQR usando la opción de Registra tu PQR.')
      ).toBeTruthy();
    });
  });

  it('should navigate to CrearPQRs when the register button is pressed', async () => {
    const mockNavigate = jest.fn();
    const mockSetParams = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate, setParams: mockSetParams });

    (fetchPqrs as jest.Mock).mockResolvedValueOnce({ code: 200, data: [], message: 'Success' });

    renderComponent();

    const registerButton = await screen.findByText('Registra tu PQR');
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('CrearPQRs', { userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', userName: 'Ivan Dario' });
    });
  });

  it('should navigate to Chatbot when the BOT button is pressed', async () => {
    const mockNavigate = jest.fn();
    const mockSetParams = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate, setParams: mockSetParams });
    (fetchPqrs as jest.Mock).mockResolvedValueOnce({ code: 200, data: [], message: 'Success' });

    renderComponent();

    const chatbotButton = await screen.findByText('BOT');
    fireEvent.press(chatbotButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Chatbot', { userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', userName: 'Ivan Dario' });
    });
  });

  it('should show a message when fetchPqrs returns an http code 400', async () => {
    (fetchPqrs as jest.Mock).mockResolvedValueOnce({ code: 400, data: [], message: 'Failure' });

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('No hay PQR solicitados, por favor crear tu primer PQR usando la opción de Registra tu PQR.')
      ).toBeTruthy();
    });
  });

  it('should show a message when fetchPqrs returns an http code 500 without message', async () => {
    (fetchPqrs as jest.Mock).mockResolvedValueOnce({ code: 500, data: [], message: undefined });

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('No hay PQR solicitados, por favor crear tu primer PQR usando la opción de Registra tu PQR.')
      ).toBeTruthy();
    });
  });

  it('should show a message when fetchPqrs is not called because executeList is false', async () => {
    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('No hay PQR solicitados, por favor crear tu primer PQR usando la opción de Registra tu PQR.')
      ).toBeTruthy();
    });
  });

  it('should show a message when fetchPqrs throws an exception', async () => {
    (fetchPqrs as jest.Mock).mockRejectedValueOnce(new Error('Error en la solicitud al backend'));

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('No hay PQR solicitados, por favor crear tu primer PQR usando la opción de Registra tu PQR.')
      ).toBeTruthy();
    });
  });
});

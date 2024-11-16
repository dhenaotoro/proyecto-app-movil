import React from 'react';
import { render, waitFor, userEvent } from '@testing-library/react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { TouchableOpacity, Text } from 'react-native';
import { useMenuModal, MenuModalProvider } from '../../context/MenuModalContext';
import { MockAuthProvider, mockSignOut, mockFetchUserAttributes } from './MockProvider';
import { it, describe } from '@jest/globals';
import { getUserById } from '../../services/Api';

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'), // Esto mantiene el resto del módulo intacto
    useNavigation: jest.fn()
}));

jest.mock('../../services/Api', () => ({
  getUserById: jest.fn(),
}));

describe('MenuModalContext', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Configura un componente de prueba para probar el contexto
  const TestComponent = () => {
    const { openMenu, closeMenu } = useMenuModal();

    return (
      <>
        <TouchableOpacity onPress={openMenu} testID="open-menu-button">
          <Text>Open Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={closeMenu} testID="close-menu-button">
          <Text>Close Menu</Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderWithProviders = (children: React.ReactNode) =>
    render(
      <NavigationContainer>
        <MockAuthProvider>
          <MenuModalProvider>{children}</MenuModalProvider>
        </MockAuthProvider>
      </NavigationContainer>
    );

  it('should properly render its children components', () => {
    const { getByText } = renderWithProviders(<Text>Test Child</Text>);

    expect(getByText('Test Child')).toBeTruthy();
  });

  it('should open modal when pressing Open Menu button', async () => {
    const user = userEvent.setup();
    const { getByTestId, queryByTestId } = renderWithProviders(<TestComponent />);

    await waitFor(() => user.press(getByTestId('open-menu-button')));

    await waitFor(() => {
        expect(queryByTestId('Modal.Container')).toBeTruthy();
        expect(queryByTestId('Modal.CloseButton')).toBeTruthy();
        expect(queryByTestId('Modal.DatosPersonales')).toBeTruthy();
        expect(queryByTestId('Modal.Alertas')).toBeTruthy();
        expect(queryByTestId('Modal.CierreSesion')).toBeTruthy();
    });
  });

  it('shoud close the modal when pressing Close Menu button', async () => {
    const user = userEvent.setup();
    const { getByTestId, queryByTestId } = renderWithProviders(<TestComponent />);
    
    await waitFor(() => user.press(getByTestId('open-menu-button')));

    await waitFor(() => {
        expect(queryByTestId('Modal.Container')).toBeTruthy();
    });
    
    await waitFor(() => user.press(getByTestId('Modal.CloseButton')));

    await waitFor(() => {
      expect(queryByTestId('Modal.Container')).toBeNull();
    });
  });

  test('should call signOut method and navigate to Login screen by pressing "Cierre sesión" button', async () => {
    const user = userEvent.setup();
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({
        navigate: mockNavigate,
        goBack: jest.fn()
    });
    mockSignOut.mockResolvedValue({
        isSigned: true
    });
    const { getByTestId } = renderWithProviders(<TestComponent />);

    // Abre el menú y presiona el botón de cierre de sesión
    await waitFor(() => user.press(getByTestId('open-menu-button')));

    await waitFor(() => {
        expect(getByTestId('Modal.Container')).toBeTruthy();
    });

    await waitFor(() => user.press(getByTestId('Modal.CierreSesion')));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('Login');
    });
  });

  test('should navigate to the DatosPersonales screen', async () => {
    const data = {
      uuid: 'ffff-fffff-fffff-ffff',
      nombre: 'John',
      apellido: 'Doe',
      email: 'john.doe@example.com',
      telefono: '123456789',
      front: 'cliente',
      aceptada_politica_aviso_privacidad: true,
      direccion: 'Transversal',
      habilitar_sms: true,
      habilitar_correo: true,
      habilitar_llamada: true
    }
    const user = userEvent.setup();
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({
        navigate: mockNavigate,
        goBack: jest.fn()
    });
    mockFetchUserAttributes.mockResolvedValue({ userUuid: 'ffff-fffff-fffff-ffff', userName: 'Jhon Doe' });
    (getUserById as jest.Mock).mockReturnValue({ code: 200, data, message: 'ok', ok: true});

    const { getByTestId } = renderWithProviders(<TestComponent />);

    // Abre el menú y presiona el botón de cierre de sesión
    await waitFor(() => user.press(getByTestId('open-menu-button')));

    await waitFor(() => {
        expect(getByTestId('Modal.Container')).toBeTruthy();
    });

    await waitFor(() => user.press(getByTestId('Modal.DatosPersonales')));

    await waitFor(() => {
      expect(mockFetchUserAttributes).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(getUserById).toHaveBeenCalledWith('ffff-fffff-fffff-ffff');
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('DatosPersonales', { userUuid: 'ffff-fffff-fffff-ffff', userName: 'Jhon Doe', email: 'john.doe@example.com', telefono: '123456789', direccion: 'Transversal' });
    });
  });
});
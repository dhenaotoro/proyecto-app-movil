import { cleanup, render, screen, userEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { it, describe, beforeEach } from '@jest/globals';
import { UserEventInstance } from '@testing-library/react-native/build/user-event/setup';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DatosPersonales from '../../../screens/Settings/DatosPersonales';
import { Alert } from 'react-native';
import { updateUser } from '../../../services/Api';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

jest.mock('../../../services/Api', () => ({
  updateUser: jest.fn(),
}));

describe('DatosPersonales', () => {
    let user: UserEventInstance;
    const Stack = createNativeStackNavigator();
    const renderComponent = (initialParams = { userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', userName: 'John Doe', email: 'john.doe@example.com', telefono: '123456789', direccion: 'Transversal' }) => {
        return render(
          <NavigationContainer>
            <Stack.Navigator initialRouteName="DatosPersonales">
              <Stack.Screen name="DatosPersonales" component={DatosPersonales} initialParams={initialParams} />
            </Stack.Navigator>
          </NavigationContainer>
        );
      };
    

    beforeEach(() => {
        user = userEvent.setup();
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('should display Correo Text Input', () => {
        renderComponent();
        
        expect(screen.getByTestId('DatosPersonales.Correo')).toBeTruthy();
    });

    it('should display Telefono Text Input', () => {
      renderComponent();
      
      expect(screen.getByTestId('DatosPersonales.Telefono')).toBeTruthy();
    });

    it('should display Direccion Text Input', () => {
      renderComponent();
      
      expect(screen.getByTestId('DatosPersonales.Direccion')).toBeTruthy();
    });

    it('should call the updateUser method to update user cellphone number and address, show an alert, and navigate to ListarPQRs page', async () => {
      const expectedUserData = {
        telefono: '+57324567898',
        direccion: 'Transversal 56D #34-67'
      };

      const alertSpy = jest.spyOn(Alert, 'alert');
      
      (updateUser as jest.Mock).mockResolvedValueOnce({ message: 'Datos de usuario actualizados correctamente.' });

      const mockNavigate = jest.fn();
      (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

      renderComponent();

      const telefonoInput = screen.getByTestId('DatosPersonales.Telefono');
      await user.clear(telefonoInput);
      await user.type(telefonoInput, '324567898');
      
      const direccionInput = screen.getByTestId('DatosPersonales.Direccion')
      await user.clear(direccionInput);
      await user.type(direccionInput, 'Transversal 56D #34-67');

      const saveButton = screen.getByTestId('DatosPersonales.Button');
      await user.press(saveButton);

      await waitFor(() => {
        expect(updateUser).toHaveBeenCalledWith('74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', expectedUserData);
      });
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('ListarPQRs', { userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', userName: 'John Doe', executeList: false });
      });
      await waitFor(() => {
        expect(alertSpy).toHaveBeenLastCalledWith('Guardado', 'Datos de usuario actualizados correctamente.');
      });
    });

    it('should show an alert when updateUser throws an exception', async () => {
      const expectedUserData = {
        telefono: '+57324567898',
        direccion: 'Transversal 56D #34-67'
      };

      const alertSpy = jest.spyOn(Alert, 'alert');
      
      (updateUser as jest.Mock).mockRejectedValueOnce(new Error('Error en la solicitud al backend'));

      renderComponent();

      const telefonoInput = screen.getByTestId('DatosPersonales.Telefono');
      await user.clear(telefonoInput);
      await user.type(telefonoInput, '324567898');
      
      const direccionInput = screen.getByTestId('DatosPersonales.Direccion')
      await user.clear(direccionInput);
      await user.type(direccionInput, 'Transversal 56D #34-67');

      const saveButton = screen.getByTestId('DatosPersonales.Button');
      await user.press(saveButton);

      await waitFor(() => {
        expect(updateUser).toHaveBeenCalledWith('74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', expectedUserData);
      });
      await waitFor(() => {
        expect(alertSpy).toHaveBeenLastCalledWith('Error', 'Hubo un problema al guardar el telefono o la direccion del usuario.');
      });
    });

    it('should show an alert when cellphone number is empty', async () => {
      const alertSpy = jest.spyOn(Alert, 'alert');

      renderComponent();

      const telefonoInput = screen.getByTestId('DatosPersonales.Telefono');
      await user.clear(telefonoInput);
      await user.type(telefonoInput, '');

      const saveButton = screen.getByTestId('DatosPersonales.Button');
      await user.press(saveButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenLastCalledWith('Error', 'Por favor, completa todos los campos obligatorios marcados con *.');
      });
    });
});
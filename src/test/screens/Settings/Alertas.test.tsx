import { cleanup, render, screen, userEvent, waitFor, fireEvent } from '@testing-library/react-native';
import React from 'react';
import { it, describe, beforeEach } from '@jest/globals';
import { UserEventInstance } from '@testing-library/react-native/build/user-event/setup';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { updateUserChannels } from '../../../services/Api';
import Alertas from '../../../screens/Settings/Alertas';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

jest.mock('../../../services/Api', () => ({
  updateUserChannels: jest.fn(),
}));

describe('Alertas', () => {
    let user: UserEventInstance;
    const Stack = createNativeStackNavigator();
    const renderComponent = (initialParams = { userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', userName: 'John Doe', enableSms: true, enableEmail: true, enableCalls: true }) => {
        return render(
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Alertas">
              <Stack.Screen name="Alertas" component={Alertas} initialParams={initialParams} />
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

    it('should display SMS Checkbox', () => {
        renderComponent();
        
        expect(screen.getByTestId('Alertas.SmsCheckbox')).toBeTruthy();
    });

    it('should display Email Checkbox', () => {
      renderComponent();
      
      expect(screen.getByTestId('Alertas.EmailCheckbox')).toBeTruthy();
    });

    it('should display Calls Checkbox', () => {
      renderComponent();
      
      expect(screen.getByTestId('Alertas.CallCheckbox')).toBeTruthy();
    });

    it('should call the updateUserChannels method to update communication channels of the user, show an alert, and navigate to ListarPQRs page', async () => {
      const expectedUserChannelsData = {
        habilitar_sms: false,
        habilitar_correo: false,
        habilitar_llamada: false
      };

      const alertSpy = jest.spyOn(Alert, 'alert');
      
      (updateUserChannels as jest.Mock).mockResolvedValueOnce({ message: 'Canales del usuario actualizados correctamente.' });

      const mockNavigate = jest.fn();
      (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

      renderComponent();

      await waitFor(() => 
        fireEvent(screen.getByTestId('Alertas.SmsCheckbox'), 'onValueChange', false) // Simula desmarcar el checkbox de SMS
      );
      
      await waitFor(() => 
        fireEvent(screen.getByTestId('Alertas.EmailCheckbox'), 'onValueChange', false) // Simula desmarcar el checkbox de Correos
      );

      await waitFor(() => 
        fireEvent(screen.getByTestId('Alertas.CallCheckbox'), 'onValueChange', false) // Simula desmarcar el checkbox de Llamadas
      );

      const saveButton = screen.getByTestId('Alertas.Button');
      await user.press(saveButton);

      await waitFor(() => {
        expect(updateUserChannels).toHaveBeenCalledWith('74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', expectedUserChannelsData);
      });
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('ListarPQRs', { userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', userName: 'John Doe', executeList: false });
      });
      await waitFor(() => {
        expect(alertSpy).toHaveBeenLastCalledWith('Guardado', 'Canales del usuario actualizados correctamente.');
      });
    });

    it('should show an alert when updateUserChannels throws an exception', async () => {
      const expectedUserChannelsData = {
        habilitar_sms: false,
        habilitar_correo: false,
        habilitar_llamada: false
      };

      const alertSpy = jest.spyOn(Alert, 'alert');
      
      (updateUserChannels as jest.Mock).mockRejectedValueOnce(new Error('Error en la solicitud al backend'));

      renderComponent();

      await waitFor(() => 
        fireEvent(screen.getByTestId('Alertas.SmsCheckbox'), 'onValueChange', false) // Simula desmarcar el checkbox de SMS
      );
      
      await waitFor(() => 
        fireEvent(screen.getByTestId('Alertas.EmailCheckbox'), 'onValueChange', false) // Simula desmarcar el checkbox de Correos
      );

      await waitFor(() => 
        fireEvent(screen.getByTestId('Alertas.CallCheckbox'), 'onValueChange', false) // Simula desmarcar el checkbox de Llamadas
      );

      const saveButton = screen.getByTestId('Alertas.Button');
      await user.press(saveButton);

      await waitFor(() => {
        expect(updateUserChannels).toHaveBeenCalledWith('74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', expectedUserChannelsData);
      });
      await waitFor(() => {
        expect(alertSpy).toHaveBeenLastCalledWith('Error', 'Hubo un problema al guardar los canales de comunicación del usuario.');
      });
    });
});
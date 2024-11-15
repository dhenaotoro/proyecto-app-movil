import { cleanup, render, screen, userEvent } from '@testing-library/react-native';
import React from 'react';
import { it, describe, beforeEach } from '@jest/globals';
import { UserEventInstance } from '@testing-library/react-native/build/user-event/setup';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DatosPersonales from '../../../screens/Settings/DatosPersonales';

describe('DatosPersonales', () => {
    let user: UserEventInstance;
    const Stack = createNativeStackNavigator();
    const renderComponent = (initialParams = { userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', email: 'john.doe@example.com', telefono: '123456789', direccion: 'Transversal' }) => {
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
});
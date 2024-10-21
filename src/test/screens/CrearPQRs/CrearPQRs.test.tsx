import { render, screen, userEvent } from '@testing-library/react-native';
import 'react-native';
import React from 'react';
import { it, describe, beforeEach } from '@jest/globals';
import CrearPQRs from '../../../screens/CrearPQRs/CrearPQRs';
import { UserEventInstance } from '@testing-library/react-native/build/user-event/setup';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

describe('CrearPQRs', () => {
    let user: UserEventInstance;
    const Stack = createNativeStackNavigator();
    const renderComponent = (initialParams = { userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', name: 'Ivan Dario' }) => {
        return render(
          <NavigationContainer>
            <Stack.Navigator initialRouteName="CrearPQRs">
              <Stack.Screen name="CrearPQRs" component={CrearPQRs} initialParams={initialParams} />
            </Stack.Navigator>
          </NavigationContainer>
        );
      };
    

    beforeEach(() => {
        user = userEvent.setup();
    });

    it('should display the app title', () => {
        renderComponent();
        expect(screen.getByText('ABCall')).toBeDefined();
    });

    it('should display the subtitle', () => {
        renderComponent();
        expect(screen.getByText('Gestiona tus PQRs rápidamente, regístrate ya!')).toBeDefined();
    });

    it('should display the request type label and dropdown', () => {
        renderComponent();
        expect(screen.getByText('Tipo de solicitud *')).toBeDefined();
        const requestTypeDropdown = screen.getByTestId('request-type-dropdown'); 
        expect(requestTypeDropdown).toBeDefined();
    });

    it('should display the description label and text area', () => {
        renderComponent();
        expect(screen.getByText('Descripción *')).toBeDefined();
        const descriptionArea = screen.getByTestId('description-textarea'); 
        expect(descriptionArea).toBeDefined();
    });

    it('should display the acquisition date label and calendar dropdown', () => {
        renderComponent();
        expect(screen.getByText('Fecha de adquisición *')).toBeDefined();
    });

    it('should display the transaction number label and input', () => {
        renderComponent();
        expect(screen.getByText('Número de transacción *')).toBeDefined();
        const transactionInput = screen.getByTestId('transaction-input'); 
        expect(transactionInput).toBeDefined();
    });

    it('should display the problem impact label and dropdown', () => {
        renderComponent();
        expect(screen.getByText('Impacto del problema')).toBeDefined();
        const impactDropdown = screen.getByTestId('problem-impact-dropdown');
        expect(impactDropdown).toBeDefined();
    });

    it('should display the solution impact label and dropdown', () => {
        renderComponent();
        expect(screen.getByText('Impacto de solución')).toBeDefined();
        const solutionImpactDropdown = screen.getByTestId('solution-impact-dropdown'); 
        expect(solutionImpactDropdown).toBeDefined();
    });

    it('should display the personal data consent checkbox', () => {
        renderComponent();
        const consentCheckbox = screen.getByRole('checkbox'); 
        expect(consentCheckbox).toBeDefined();
        expect(screen.getByText('Acepto el uso de datos personales')).toBeDefined();
    });

    it('should display the save button', () => {
        renderComponent();
        const saveButton = screen.getByText('Guardar');
        expect(saveButton).toBeDefined();
    });

    it('should validate required fields when saving', async () => {
        renderComponent();
        const saveButton = screen.getByText('Guardar');
        await user.press(saveButton);
        
    });
});
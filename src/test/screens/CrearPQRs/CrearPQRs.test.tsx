import { fireEvent, cleanup, render, screen, userEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { it, describe, beforeEach } from '@jest/globals';
import CrearPQRs from '../../../screens/CrearPQRs/CrearPQRs';
import { UserEventInstance } from '@testing-library/react-native/build/user-event/setup';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerPqr } from '../../../services/Api';
import { Alert } from 'react-native';

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(),
}));
  
jest.mock('../../../services/Api', () => ({
    registerPqr: jest.fn(),
}));

describe('CrearPQRs', () => {
    let user: UserEventInstance;
    const Stack = createNativeStackNavigator();
    const renderComponent = (initialParams = { userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', userName: 'Ivan Dario' }) => {
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

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('should display the subtitle', () => {
        renderComponent();
        expect(screen.getByText('Gestiona tus PQRs rápidamente, regístrate ya!')).toBeTruthy();
    });

    it('should display Tipo Solicitud dropdown', () => {
        renderComponent();

        const requestTypeDropdown = screen.getByTestId('CrearPQRs.TipoSolicitud'); 
        expect(requestTypeDropdown).toBeTruthy();
    });

    it('should display Descripcion Text Area', () => {
        renderComponent();
        
        const requestTypeDropdown = screen.getByTestId('CrearPQRs.Descripcion'); 
        expect(requestTypeDropdown).toBeTruthy();
    });

    it('should display Fecha Adquisicion dropdown', () => {
        renderComponent();
        
        const requestTypeDropdown = screen.getByTestId('CrearPQRs.FechaAdquisicion'); 
        expect(requestTypeDropdown).toBeTruthy();
    });

    it('should display Numero Transaccion number input', () => {
        renderComponent();
        
        const requestTypeDropdown = screen.getByTestId('CrearPQRs.NumeroTransaccion'); 
        expect(requestTypeDropdown).toBeTruthy();
    });

    it('should display Impacto del problema dropdown', () => {
        renderComponent();
        
        const requestTypeDropdown = screen.getByTestId('CrearPQRs.ImpactoProblema'); 
        expect(requestTypeDropdown).toBeTruthy();
    });

    it('should display Impacto de la solución dropdown', () => {
        renderComponent();
        
        const requestTypeDropdown = screen.getByTestId('CrearPQRs.ImpactoSolucion'); 
        expect(requestTypeDropdown).toBeTruthy();
    });

    it('should display the personal data consent checkbox', () => {
        renderComponent();
        
        expect(screen.getByRole('checkbox')).toBeTruthy();
        expect(screen.getByText('Acepto el uso de datos personales.')).toBeTruthy();
    });

    it('should display the save button', () => {
        renderComponent();

        const saveButton = screen.getByTestId('CrearPQRs.Button');
        expect(saveButton).toBeTruthy();
    });

    it('should show an alert when checkbox for accepting Acepto el uso de datos personales clause is not checked', async () => {
        const alertSpy = jest.spyOn(Alert, 'alert');
        renderComponent();

        await user.type(screen.getByTestId('CrearPQRs.Descripcion'), 'Test');
        await user.type(screen.getByTestId('CrearPQRs.NumeroTransaccion'), '1234');

        const saveButton = screen.getByTestId('CrearPQRs.Button');
        await user.press(saveButton);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Error', 'Por favor, completa todos los campos obligatorios marcados con *');
        });
    });

    it('should show an alert when registerPqr throws an exception', async () => {
        const expectedPQRData = {
            uuidUsuario: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45',
            tipoSolicitud: 'Queja',
            descripcion: 'Test',
            numeroTransaccion: '1234',
            impactoProblema: 'Alto',
            impactoSolucion: 'Aclaración del servicio',
            canal: 'App móvil',
        };
        const newDate = new Date('2025-02-01');

        const alertSpy = jest.spyOn(Alert, 'alert');

        (registerPqr as jest.Mock).mockRejectedValueOnce(new Error('Error en la solicitud al backend'));
        renderComponent();

        await waitFor(() => 
            fireEvent(screen.getByTestId('CrearPQRs.TipoSolicitud'), 'onValueChange', 'Queja') // Simula seleccionar una nueva opcion
        );
        await user.type(screen.getByTestId('CrearPQRs.Descripcion'), 'Test');
        await user.type(screen.getByTestId('CrearPQRs.NumeroTransaccion'), '1234');
        await waitFor(() => 
            fireEvent(screen.getByTestId('CrearPQRs.Checkbox'), 'onValueChange', true) // Simula seleccionar una nueva opcion
        );
        await waitFor(() => 
            fireEvent(screen.getByTestId('CrearPQRs.FechaAdquisicion'), 'onChange', { nativeEvent: { timestamp: newDate.getTime() }, }) // Simula seleccionar una nueva opcion
        );
        await waitFor(() => 
            fireEvent(screen.getByTestId('CrearPQRs.ImpactoProblema'), 'onValueChange', 'Alto') // Simula seleccionar una nueva opcion
        );
        await waitFor(() => 
            fireEvent(screen.getByTestId('CrearPQRs.ImpactoSolucion'), 'onValueChange', 'Aclaración del servicio') // Simula seleccionar una nueva opcion
        );

        const saveButton = screen.getByTestId('CrearPQRs.Button');
        await user.press(saveButton);

        await waitFor(() => {
            expect(registerPqr).toHaveBeenCalledWith(expectedPQRData);
        });
        await waitFor(() => {
            expect(alertSpy).toHaveBeenLastCalledWith('Error', 'Hubo un problema al guardar el PQR');
        });
    });

    it('should call registerPqr method to create PQRs, show an alert, and navigate to ListarPQRs page', async () => {
        const expectedPQRData = {
            uuidUsuario: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45',
            tipoSolicitud: 'Petición',
            descripcion: 'Test',
            numeroTransaccion: '1234',
            impactoProblema: 'Bajo',
            impactoSolucion: 'Compensación de dinero',
            canal: 'App móvil',
        };

        const alertSpy = jest.spyOn(Alert, 'alert');
        
        (registerPqr as jest.Mock).mockResolvedValueOnce({ message: 'PQR creado correctamente.' });

        const mockNavigate = jest.fn();
        (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

        renderComponent();

        await user.type(screen.getByTestId('CrearPQRs.Descripcion'), 'Test');
        await user.type(screen.getByTestId('CrearPQRs.NumeroTransaccion'), '1234');

        await waitFor(() => 
            fireEvent(screen.getByTestId('CrearPQRs.Checkbox'), 'onValueChange', true) // Simula seleccionar una nueva opcion
        );

        const saveButton = screen.getByTestId('CrearPQRs.Button');
        await user.press(saveButton);

        await waitFor(() => {
            expect(registerPqr).toHaveBeenCalledWith(expectedPQRData);
        });
        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Guardado', 'PQR creado correctamente.');
        });
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('ListarPQRs', { userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45', userName: 'Ivan Dario', executeList: true });
        });
    });
});
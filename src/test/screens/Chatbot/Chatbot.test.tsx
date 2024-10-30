import { fireEvent, render, screen, userEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { it, describe, beforeEach } from '@jest/globals';
import { UserEventInstance } from '@testing-library/react-native/build/user-event/setup';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerPqr } from '../../../services/Api';
import { Chatbot } from '../../../screens/Chatbot/Chatbot';
  
jest.mock('../../../services/Api', () => ({
    registerPqr: jest.fn(),
}));

describe('Chatbot', () => {
    let user: UserEventInstance;
    const Stack = createNativeStackNavigator();
    const renderComponent = (initialParams = { userUuid: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45' }) => {
        return render(
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Chatbot">
              <Stack.Screen name="Chatbot" component={Chatbot} initialParams={initialParams} />
            </Stack.Navigator>
          </NavigationContainer>
        );
      };
    

    beforeEach(() => {
        user = userEvent.setup();
    });

    it('should display the Chatbot content', () => {
        renderComponent();
        expect(screen.getByTestId('Chatbot.Content')).toBeTruthy();
    });

    it('should display Mensaje a enviar input', () => {
        renderComponent();
        expect(screen.getByTestId('Chatbot.EnviarMensaje')).toBeTruthy();
    });

    it('should display the Tipo Solicitud options in place', () => {
        renderComponent();
        expect(screen.getByTestId('Chatbot.Option.Petición')).toBeTruthy();
        expect(screen.getByTestId('Chatbot.Option.Queja')).toBeTruthy();
        expect(screen.getByTestId('Chatbot.Option.Reclamo')).toBeTruthy();
    });

    describe('Petición', () => {
        it('should display the second step when choosing Petición as first option', async () => {
            renderComponent();
            await user.press(screen.getByTestId('Chatbot.Option.Petición'));

            expect(screen.getByRole('text', { name: 'Por favor describe la petición que quieres comunicarme.' })).toBeTruthy();
        });

        it('should display the third step when choosing Petición as first option', async () => {
            renderComponent();
            await user.press(screen.getByTestId('Chatbot.Option.Petición'));

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), 'Se reporta un producto en mal estado');

            await user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton'));

            expect(screen.getByRole('text', { name: 'Se reporta un producto en mal estado' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Por favor define una fecha de adquisición en formato YYYY-MM-DD.' })).toBeTruthy();
        });
    });

    /*it('should show an alert when checkbox for accepting Acepto el uso de datos personales clause is not checked', async () => {
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
    });*/
});
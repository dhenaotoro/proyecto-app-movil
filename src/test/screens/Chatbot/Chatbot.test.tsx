import { render, cleanup, screen, userEvent, waitFor } from '@testing-library/react-native';
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

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
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

            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: 'Se reporta un producto en mal estado' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Por favor define una fecha de adquisición en formato YYYY-MM-DD.' })).toBeTruthy();
        });

        it('should display the fourth step when choosing Petición as first option', async () => {
            renderComponent();
            await user.press(screen.getByTestId('Chatbot.Option.Petición'));

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), 'Se reporta un producto en mal estado');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: 'Se reporta un producto en mal estado' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Por favor define una fecha de adquisición en formato YYYY-MM-DD.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '2024-09-11');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '2024-09-11' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Si lo recuerdas, digita el número de orden de la transacción.' })).toBeTruthy();
        });

        it('should display the fifth step when choosing Petición as first option', async () => {
            renderComponent();
            await user.press(screen.getByTestId('Chatbot.Option.Petición'));

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), 'Se reporta un producto en mal estado');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: 'Se reporta un producto en mal estado' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Por favor define una fecha de adquisición en formato YYYY-MM-DD.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '2024-09-11');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '2024-09-11' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Si lo recuerdas, digita el número de orden de la transacción.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '123456789');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '123456789' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Aceptas el consentimiento informado para uso de datos personales.' })).toBeTruthy();
            expect(screen.getByTestId('Chatbot.Option.Si')).toBeTruthy();
            expect(screen.getByTestId('Chatbot.Option.No')).toBeTruthy();
        });

        it('should display the sixth step when choosing Petición as first option and call the registerPqr method', async () => {
            const expectedPQRData = {
                uuidUsuario: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45',
                tipoSolicitud: 'Petición',
                descripcion: 'Se reporta un producto en mal estado',
                numeroTransaccion: '1234567890',
                impactoProblema: 'Alto',
                impactoSolucion: 'Compensación de dinero',
                canal: 'Chatbot',
            };

            (registerPqr as jest.Mock).mockResolvedValueOnce({ code: 200, message: 'PQR creado correctamente.' });
            renderComponent();

            await user.press(screen.getByTestId('Chatbot.Option.Petición'));

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), 'Se reporta un producto en mal estado');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: 'Se reporta un producto en mal estado' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Por favor define una fecha de adquisición en formato YYYY-MM-DD.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '2024-09-11');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '2024-09-11' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Si lo recuerdas, digita el número de orden de la transacción.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '1234567890');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '1234567890' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Aceptas el consentimiento informado para uso de datos personales.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.Si'));

            await waitFor(() => {
                expect(registerPqr).toHaveBeenCalledWith(expectedPQRData);
            });

            await waitFor(() => {
                expect(screen.getByRole('text', { name: 'Gracias por preferir nuestro canal de chat, vuelve pronto.' })).toBeTruthy();
            });
        });

        it('should display the sixth step when choosing Petición as first option and finish up the steps when user chooses No in the privacy policy', async () => {
            const expectedPQRData = {
                uuidUsuario: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45',
                tipoSolicitud: 'Petición',
                descripcion: 'Se reporta un producto en mal estado',
                numeroTransaccion: '1234567890',
                impactoProblema: 'Alto',
                impactoSolucion: 'Compensación de dinero',
                canal: 'Chatbot',
            };

            (registerPqr as jest.Mock).mockResolvedValue({ code: 200, message: 'PQR creado correctamente.' });
            renderComponent();

            await user.press(screen.getByTestId('Chatbot.Option.Petición'));

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), 'Se reporta un producto en mal estado');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: 'Se reporta un producto en mal estado' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Por favor define una fecha de adquisición en formato YYYY-MM-DD.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '2024-09-11');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '2024-09-11' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Si lo recuerdas, digita el número de orden de la transacción.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '1234567890');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '1234567890' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Aceptas el consentimiento informado para uso de datos personales.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.No'));

            await waitFor(() => {
                expect(screen.getByRole('text', { name: 'No estas de acuerdo con el tratamiento de información por esta razón no se podrá realizar la solicitud como se espera, cualquier duda sobre el tratamiento de datos por favor consultar el siguiente enlace.' })).toBeTruthy();
            });
        });

        it('should display the sixth step when choosing Petición as first option and show a failure message when the registerPqr method fails', async () => {
            const expectedPQRData = {
                uuidUsuario: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45',
                tipoSolicitud: 'Petición',
                descripcion: 'Se reporta un producto en mal estado',
                numeroTransaccion: '1234567890',
                impactoProblema: 'Alto',
                impactoSolucion: 'Compensación de dinero',
                canal: 'Chatbot',
            };
            
            (registerPqr as jest.Mock).mockResolvedValue({ code: 400, message: 'Error en la petición' });
            
            renderComponent();

            await user.press(screen.getByTestId('Chatbot.Option.Petición'));

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), 'Se reporta un producto en mal estado');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: 'Se reporta un producto en mal estado' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Por favor define una fecha de adquisición en formato YYYY-MM-DD.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '2024-09-11');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '2024-09-11' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Si lo recuerdas, digita el número de orden de la transacción.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '1234567890');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '1234567890' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Aceptas el consentimiento informado para uso de datos personales.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.Si'));

            await waitFor(() => {
                expect(registerPqr).toHaveBeenCalledWith(expectedPQRData);
            });

            await waitFor(() => {
                expect(screen.getByRole('text', { name: 'Hubo una dificultad al momento de crear la solicitud. Por favor intenta en 5 minutos.' })).toBeTruthy();
            });
        });

        it('should display the sixth step when choosing Petición as first option and raise a failure when registerPqr has an exception', async () => {
            const expectedPQRData = {
                uuidUsuario: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45',
                tipoSolicitud: 'Petición',
                descripcion: 'Se reporta un producto en mal estado',
                numeroTransaccion: '1234567890',
                impactoProblema: 'Alto',
                impactoSolucion: 'Compensación de dinero',
                canal: 'Chatbot',
            };
            
            (registerPqr as jest.Mock).mockResolvedValue(new Error('Error parsing the response'));
            
            renderComponent();

            await user.press(screen.getByTestId('Chatbot.Option.Petición'));

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), 'Se reporta un producto en mal estado');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: 'Se reporta un producto en mal estado' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Por favor define una fecha de adquisición en formato YYYY-MM-DD.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '2024-09-11');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '2024-09-11' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Si lo recuerdas, digita el número de orden de la transacción.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '1234567890');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '1234567890' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Aceptas el consentimiento informado para uso de datos personales.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.Si'));

            await waitFor(() => {
                expect(registerPqr).toHaveBeenCalledWith(expectedPQRData);
            });
        });
    });

    describe('Queja', () => {
        it('should display the second step when choosing Queja as first option', async () => {
            renderComponent();
            await user.press(screen.getByTestId('Chatbot.Option.Queja'));

            expect(screen.getByRole('text', { name: 'Por favor describe la queja que quieres comunicarme.' })).toBeTruthy();
        });

        it('should display the third step when choosing Queja as first option', async () => {
            renderComponent();
            await user.press(screen.getByTestId('Chatbot.Option.Queja'));

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), 'Se reporta un producto en mal estado');

            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: 'Se reporta un producto en mal estado' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Por favor define una fecha de adquisición en formato YYYY-MM-DD.' })).toBeTruthy();
        });

        it('should display the fourth step when choosing Queja as first option', async () => {
            renderComponent();
            await user.press(screen.getByTestId('Chatbot.Option.Queja'));

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), 'Se reporta un producto en mal estado');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: 'Se reporta un producto en mal estado' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Por favor define una fecha de adquisición en formato YYYY-MM-DD.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '2024-09-11');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '2024-09-11' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Si lo recuerdas, digita el número de orden de la transacción.' })).toBeTruthy();
        });

        it('should display the fifth step when choosing Queja as first option', async () => {
            renderComponent();
            await user.press(screen.getByTestId('Chatbot.Option.Queja'));

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), 'Se reporta un producto en mal estado');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: 'Se reporta un producto en mal estado' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Por favor define una fecha de adquisición en formato YYYY-MM-DD.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '2024-09-11');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '2024-09-11' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Si lo recuerdas, digita el número de orden de la transacción.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '123456789');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '123456789' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Aceptas el consentimiento informado para uso de datos personales.' })).toBeTruthy();
            expect(screen.getByTestId('Chatbot.Option.Si')).toBeTruthy();
            expect(screen.getByTestId('Chatbot.Option.No')).toBeTruthy();
        });

        it('should display the sixth step when choosing Queja as first option and call the registerPqr method', async () => {
            const expectedPQRData = {
                uuidUsuario: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45',
                tipoSolicitud: 'Queja',
                descripcion: 'Se reporta un producto en mal estado',
                numeroTransaccion: '1234567890',
                impactoProblema: 'Alto',
                impactoSolucion: 'Compensación de dinero',
                canal: 'Chatbot',
            };

            (registerPqr as jest.Mock).mockResolvedValueOnce({ code: 200, message: 'PQR creado correctamente.' });
            renderComponent();

            await user.press(screen.getByTestId('Chatbot.Option.Queja'));

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), 'Se reporta un producto en mal estado');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: 'Se reporta un producto en mal estado' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Por favor define una fecha de adquisición en formato YYYY-MM-DD.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '2024-09-11');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '2024-09-11' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Si lo recuerdas, digita el número de orden de la transacción.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '1234567890');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '1234567890' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Aceptas el consentimiento informado para uso de datos personales.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.Si'));

            await waitFor(() => {
                expect(registerPqr).toHaveBeenCalledWith(expectedPQRData);
            });

            await waitFor(() => {
                expect(screen.getByRole('text', { name: 'Gracias por preferir nuestro canal de chat, vuelve pronto.' })).toBeTruthy();
            });
        });

        it('should display the sixth step when choosing Queja as first option and finish up the steps when user chooses No in the privacy policy', async () => {
            const expectedPQRData = {
                uuidUsuario: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45',
                tipoSolicitud: 'Queja',
                descripcion: 'Se reporta un producto en mal estado',
                numeroTransaccion: '1234567890',
                impactoProblema: 'Alto',
                impactoSolucion: 'Compensación de dinero',
                canal: 'Chatbot',
            };

            (registerPqr as jest.Mock).mockResolvedValue({ code: 200, message: 'PQR creado correctamente.' });
            renderComponent();

            await user.press(screen.getByTestId('Chatbot.Option.Queja'));

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), 'Se reporta un producto en mal estado');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: 'Se reporta un producto en mal estado' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Por favor define una fecha de adquisición en formato YYYY-MM-DD.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '2024-09-11');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '2024-09-11' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Si lo recuerdas, digita el número de orden de la transacción.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '1234567890');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '1234567890' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Aceptas el consentimiento informado para uso de datos personales.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.No'));

            await waitFor(() => {
                expect(screen.getByRole('text', { name: 'No estas de acuerdo con el tratamiento de información por esta razón no se podrá realizar la solicitud como se espera, cualquier duda sobre el tratamiento de datos por favor consultar el siguiente enlace.' })).toBeTruthy();
            });
        });

        it('should display the sixth step when choosing Queja as first option and show a failure message when the registerPqr method fails', async () => {
            const expectedPQRData = {
                uuidUsuario: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45',
                tipoSolicitud: 'Queja',
                descripcion: 'Se reporta un producto en mal estado',
                numeroTransaccion: '1234567890',
                impactoProblema: 'Alto',
                impactoSolucion: 'Compensación de dinero',
                canal: 'Chatbot',
            };
            
            (registerPqr as jest.Mock).mockResolvedValue({ code: 400, message: 'Error en la petición' });
            
            renderComponent();

            await user.press(screen.getByTestId('Chatbot.Option.Queja'));

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), 'Se reporta un producto en mal estado');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: 'Se reporta un producto en mal estado' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Por favor define una fecha de adquisición en formato YYYY-MM-DD.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '2024-09-11');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '2024-09-11' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Si lo recuerdas, digita el número de orden de la transacción.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '1234567890');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '1234567890' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Aceptas el consentimiento informado para uso de datos personales.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.Si'));

            await waitFor(() => {
                expect(registerPqr).toHaveBeenCalledWith(expectedPQRData);
            });

            await waitFor(() => {
                expect(screen.getByRole('text', { name: 'Hubo una dificultad al momento de crear la solicitud. Por favor intenta en 5 minutos.' })).toBeTruthy();
            });
        });

        it('should display the sixth step when choosing Queja as first option and raise a failure when registerPqr has an exception', async () => {
            const expectedPQRData = {
                uuidUsuario: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45',
                tipoSolicitud: 'Queja',
                descripcion: 'Se reporta un producto en mal estado',
                numeroTransaccion: '1234567890',
                impactoProblema: 'Alto',
                impactoSolucion: 'Compensación de dinero',
                canal: 'Chatbot',
            };
            
            (registerPqr as jest.Mock).mockResolvedValue(new Error('Error parsing the response'));
            
            renderComponent();

            await user.press(screen.getByTestId('Chatbot.Option.Queja'));

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), 'Se reporta un producto en mal estado');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: 'Se reporta un producto en mal estado' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Por favor define una fecha de adquisición en formato YYYY-MM-DD.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '2024-09-11');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '2024-09-11' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Si lo recuerdas, digita el número de orden de la transacción.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '1234567890');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '1234567890' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Aceptas el consentimiento informado para uso de datos personales.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.Si'));

            await waitFor(() => {
                expect(registerPqr).toHaveBeenCalledWith(expectedPQRData);
            });
        });
    });

    describe('Reclamo', () => {
        it('should display the second step when choosing Reclamo as first option', async () => {
            renderComponent();
            await user.press(screen.getByTestId('Chatbot.Option.Reclamo'));

            expect(screen.getByRole('text', { name: 'Elige el tipo de reclamo a informar.' })).toBeTruthy();
        });

        it('should display the third step when choosing Reclamo as first option and Compensacion de dinero as Impacto de solucion', async () => {
            renderComponent();
            await user.press(screen.getByTestId('Chatbot.Option.Reclamo'));

            expect(screen.getByRole('text', { name: 'Elige el tipo de reclamo a informar.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.Compensación de dinero'));

            expect(screen.getByRole('text', { name: 'Por favor describe la razón de la compensación que requieres comunicarme.' })).toBeTruthy();
        });

        it('should display the third step when choosing Reclamo as first option and Cambio de producto as Impacto de solucion', async () => {
            renderComponent();
            await user.press(screen.getByTestId('Chatbot.Option.Reclamo'));

            expect(screen.getByRole('text', { name: 'Elige el tipo de reclamo a informar.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.Cambio de producto'));

            expect(screen.getByRole('text', { name: 'Por favor indica textualmente que producto deseas tener.' })).toBeTruthy();
        });

        it('should display the third step when choosing Reclamo as first option and Aclaración del servicio as Impacto de solucion', async () => {
            renderComponent();
            await user.press(screen.getByTestId('Chatbot.Option.Reclamo'));

            expect(screen.getByRole('text', { name: 'Elige el tipo de reclamo a informar.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.Aclaración del servicio'));

            expect(screen.getByRole('text', { name: 'Por favor describe el servicio, producto o transacción que requieres aclarar.' })).toBeTruthy();
        });

        it('should display the third step when choosing Reclamo as first option and Modificación de una cita as Impacto de solucion', async () => {
            renderComponent();
            await user.press(screen.getByTestId('Chatbot.Option.Reclamo'));

            expect(screen.getByRole('text', { name: 'Elige el tipo de reclamo a informar.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.Modificación de una cita'));

            expect(screen.getByRole('text', { name: 'Por favor define una fecha requerida de la cita en formato YYYY-MM-DD HH:MM:SS' })).toBeTruthy();
        });

        it('should display the fourth step when choosing Reclamo as first option', async () => {
            renderComponent();
            await user.press(screen.getByTestId('Chatbot.Option.Reclamo'));

            expect(screen.getByRole('text', { name: 'Elige el tipo de reclamo a informar.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.Compensación de dinero'));

            expect(screen.getByRole('text', { name: 'Por favor describe la razón de la compensación que requieres comunicarme.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), 'Se reporta un producto en mal estado y quiero sea compensado');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: 'Se reporta un producto en mal estado y quiero sea compensado' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Por favor define una fecha de adquisición en formato YYYY-MM-DD.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '2024-09-11');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '2024-09-11' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Si lo recuerdas, digita el número de orden de la transacción.' })).toBeTruthy();
        });

        it('should display the fifth step when choosing Reclamo as first option', async () => {
            renderComponent();
            await user.press(screen.getByTestId('Chatbot.Option.Reclamo'));

            expect(screen.getByRole('text', { name: 'Elige el tipo de reclamo a informar.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.Compensación de dinero'));

            expect(screen.getByRole('text', { name: 'Por favor describe la razón de la compensación que requieres comunicarme.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), 'Se reporta un producto en mal estado y quiero sea compensado');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: 'Se reporta un producto en mal estado y quiero sea compensado' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Por favor define una fecha de adquisición en formato YYYY-MM-DD.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '2024-09-11');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '2024-09-11' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Si lo recuerdas, digita el número de orden de la transacción.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '123456789');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '123456789' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Aceptas el consentimiento informado para uso de datos personales.' })).toBeTruthy();
            expect(screen.getByTestId('Chatbot.Option.Si')).toBeTruthy();
            expect(screen.getByTestId('Chatbot.Option.No')).toBeTruthy();
        });

        it('should display the sixth step when choosing Reclamo as first option and call the registerPqr method', async () => {
            const expectedPQRData = {
                uuidUsuario: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45',
                tipoSolicitud: 'Reclamo',
                descripcion: 'Se reporta un producto en mal estado y quiero sea compensado',
                numeroTransaccion: '1234567890',
                impactoProblema: 'Alto',
                impactoSolucion: 'Compensación de dinero',
                canal: 'Chatbot',
            };

            (registerPqr as jest.Mock).mockResolvedValueOnce({ code: 200, message: 'PQR creado correctamente.' });
            renderComponent();

            await user.press(screen.getByTestId('Chatbot.Option.Reclamo'));

            expect(screen.getByRole('text', { name: 'Elige el tipo de reclamo a informar.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.Compensación de dinero'));

            expect(screen.getByRole('text', { name: 'Por favor describe la razón de la compensación que requieres comunicarme.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), 'Se reporta un producto en mal estado y quiero sea compensado');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: 'Se reporta un producto en mal estado y quiero sea compensado' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Por favor define una fecha de adquisición en formato YYYY-MM-DD.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '2024-09-11');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '2024-09-11' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Si lo recuerdas, digita el número de orden de la transacción.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '123456789');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '123456789' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Aceptas el consentimiento informado para uso de datos personales.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.Si'));

            await waitFor(() => {
                expect(registerPqr).toHaveBeenCalledWith(expectedPQRData);
            });

            await waitFor(() => {
                expect(screen.getByRole('text', { name: 'Gracias por preferir nuestro canal de chat, vuelve pronto.' })).toBeTruthy();
            });
        });

        it('should display the sixth step when choosing Reclamo as first option and finish up the steps when user chooses No in the privacy policy', async () => {
            renderComponent();

            await user.press(screen.getByTestId('Chatbot.Option.Reclamo'));

            expect(screen.getByRole('text', { name: 'Elige el tipo de reclamo a informar.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.Compensación de dinero'));

            expect(screen.getByRole('text', { name: 'Por favor describe la razón de la compensación que requieres comunicarme.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), 'Se reporta un producto en mal estado y quiero sea compensado');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: 'Se reporta un producto en mal estado y quiero sea compensado' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Por favor define una fecha de adquisición en formato YYYY-MM-DD.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '2024-09-11');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '2024-09-11' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Si lo recuerdas, digita el número de orden de la transacción.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '123456789');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '123456789' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Aceptas el consentimiento informado para uso de datos personales.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.No'));

            await waitFor(() => {
                expect(screen.getByRole('text', { name: 'No estas de acuerdo con el tratamiento de información por esta razón no se podrá realizar la solicitud como se espera, cualquier duda sobre el tratamiento de datos por favor consultar el siguiente enlace.' })).toBeTruthy();
            });
        });

        it('should display the sixth step when choosing Reclamo as first option and show a failure message when the registerPqr method fails', async () => {
            const expectedPQRData = {
                uuidUsuario: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45',
                tipoSolicitud: 'Reclamo',
                descripcion: 'Se reporta un producto en mal estado y quiero sea compensado',
                numeroTransaccion: '1234567890',
                impactoProblema: 'Alto',
                impactoSolucion: 'Compensación de dinero',
                canal: 'Chatbot',
            };
            
            (registerPqr as jest.Mock).mockResolvedValue({ code: 400, message: 'Error en la petición' });
            
            renderComponent();

            await user.press(screen.getByTestId('Chatbot.Option.Reclamo'));

            expect(screen.getByRole('text', { name: 'Elige el tipo de reclamo a informar.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.Compensación de dinero'));

            expect(screen.getByRole('text', { name: 'Por favor describe la razón de la compensación que requieres comunicarme.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), 'Se reporta un producto en mal estado y quiero sea compensado');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: 'Se reporta un producto en mal estado y quiero sea compensado' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Por favor define una fecha de adquisición en formato YYYY-MM-DD.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '2024-09-11');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '2024-09-11' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Si lo recuerdas, digita el número de orden de la transacción.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '123456789');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '123456789' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Aceptas el consentimiento informado para uso de datos personales.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.Si'));

            await waitFor(() => {
                expect(registerPqr).toHaveBeenCalledWith(expectedPQRData);
            });

            await waitFor(() => {
                expect(screen.getByRole('text', { name: 'Hubo una dificultad al momento de crear la solicitud. Por favor intenta en 5 minutos.' })).toBeTruthy();
            });
        });

        it('should display the sixth step when choosing Reclamo as first option and raise a failure when registerPqr has an exception', async () => {
            const expectedPQRData = {
                uuidUsuario: '74a8d4c8-2071-7011-b1d9-f82e4e5b5b45',
                tipoSolicitud: 'Reclamo',
                descripcion: 'Se reporta un producto en mal estado y quiero sea compensado',
                numeroTransaccion: '1234567890',
                impactoProblema: 'Alto',
                impactoSolucion: 'Compensación de dinero',
                canal: 'Chatbot',
            };
            
            (registerPqr as jest.Mock).mockResolvedValue(new Error('Error parsing the response'));
            
            renderComponent();

            await user.press(screen.getByTestId('Chatbot.Option.Reclamo'));

            expect(screen.getByRole('text', { name: 'Elige el tipo de reclamo a informar.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.Compensación de dinero'));

            expect(screen.getByRole('text', { name: 'Por favor describe la razón de la compensación que requieres comunicarme.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), 'Se reporta un producto en mal estado y quiero sea compensado');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: 'Se reporta un producto en mal estado y quiero sea compensado' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Por favor define una fecha de adquisición en formato YYYY-MM-DD.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '2024-09-11');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '2024-09-11' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Si lo recuerdas, digita el número de orden de la transacción.' })).toBeTruthy();

            await user.type(screen.getByTestId('Chatbot.EnviarMensaje'), '123456789');
            await waitFor(() => user.press(screen.getByTestId('Chatbot.EnviarMensaje.IconButton')));

            expect(screen.getByRole('text', { name: '123456789' })).toBeTruthy();
            expect(screen.getByRole('text', { name: 'Aceptas el consentimiento informado para uso de datos personales.' })).toBeTruthy();

            await user.press(screen.getByTestId('Chatbot.Option.Si'));

            await waitFor(() => {
                expect(registerPqr).toHaveBeenCalledWith(expectedPQRData);
            });
        });
    });
});
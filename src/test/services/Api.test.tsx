import { registerUser, fetchPqrs } from '../../services/api'; // assuming your file is named userService.ts
import { REACT_NATIVE_APP_BACKEND_URL } from '@env';
import fetchMock from 'jest-fetch-mock';

const expectedEnv = REACT_NATIVE_APP_BACKEND_URL;
fetchMock.enableMocks();

describe('Api', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterAll(() => {
    fetchMock.mockRestore();
  });

  describe('registerUser', () => {
    it('should call the correct endpoint and return result on success', async () => {
        const mockUserData = {
            uuid: 'ffff-fffff-fffff-ffff',
            nombre: 'Juan',
            apellido: 'Perez',
            email: 'test@test.com',
            telefono: '1234567890',
            front: 'web',
            direccion: 'Transversal 52',
            numero_documento: '987654321',
            tipo_documento: 'Cedula Ciudadania',
            aceptada_politica_aviso_privacidad: true,
        };

        const mockResponse = { id: 'ffff-fffff-fffff-ffff', message: 'User created successfully' };
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

        console.log('AQUI PASO 1')
        const result = await registerUser(mockUserData);

        expect(fetchMock).toHaveBeenCalledWith(`${expectedEnv}/api/user/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mockUserData),
        });
        expect(result).toEqual(mockResponse);
    });

    it('should throw an error when the backend returns an error response', async () => {
        const mockUserData = {
            uuid: 'ffff-fffff-fffff-ffff',
            nombre: 'Juan',
            apellido: 'Perez',
            email: 'test@test.com',
            telefono: '1234567890',
            front: 'web',
            direccion: 'Transversal 52',
            numero_documento: '987654321',
            tipo_documento: 'Cedula Ciudadania',
            aceptada_politica_aviso_privacidad: true,
        };

        fetchMock.mockRejectOnce(new Error('Error al crear el usuario en el backend'));

        await expect(registerUser(mockUserData)).rejects.toThrow('Error al crear el usuario en el backend');
    });

    it('should call the correct endpoint and return result with error', async () => {
        const mockUserData = {
            uuid: 'ffff-fffff-fffff-ffff',
            nombre: 'Juan',
            apellido: 'Perez',
            email: 'test@test.com',
            telefono: '1234567890',
            front: 'web',
            direccion: 'Transversal 52',
            numero_documento: '987654321',
            tipo_documento: 'Cedula Ciudadania',
            aceptada_politica_aviso_privacidad: true,
        };

        fetchMock.mockResponseOnce('', { status: 400 });
        
        await expect(registerUser(mockUserData)).rejects.toThrow('Error al crear el usuario en el backend');
    });
  });

  describe('fetchPqrs', () => {
    it('should return PQR data for the given username', async () => {
      const username = 'IVAN';
      const expectedData = [
        { id: '000000001', status: 'Abierto', channel: 'App móvil' },
        { id: '000000002', status: 'Cerrado', channel: 'Chatbot' },
        { id: '000000003', status: 'Cerrado', channel: 'Llamada' },
      ];

      const result = await fetchPqrs(username);

      expect(result).toEqual(expectedData);
    });

    it('should return an empty array if no PQRs are found for the user', async () => {
      const username = 'DANIEL';
      const expectedData : { id: string, status: string, channel: string } [] = [];

      const result = await fetchPqrs(username);

      expect(result).toEqual(expectedData);
    });

    it('should return an empty array if the username is not in the mock data', async () => {
      const username = 'UNKNOWN_USER';
      const expectedData : { id: string, status: string, channel: string } [] = [];

      const result = await fetchPqrs(username);

      expect(result).toEqual(expectedData);
    });
  });
});
// assuming your file is named userService.ts
import { REACT_NATIVE_APP_BACKEND_URL } from '@env';
import fetchMock from 'jest-fetch-mock';
import { fetchPqrs, registerUser } from '../../services/Api';

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
        const mockResponse = [{ channel: 'voice', id: 'ffff-fffff-fffff-ffff', status: 'Abierto' }];
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

        const result = await fetchPqrs('ffff-fffff-fffff-ffff');

        expect(fetchMock).toHaveBeenCalledWith(`${expectedEnv}/api/pqr/findAll?uuid=ffff-fffff-fffff-ffff`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        expect(result).toEqual(mockResponse);
    });

    it('should return an empty array if no PQRs are found for the user', async () => {
      fetchMock.mockResponseOnce(JSON.stringify([]));
      const result = await fetchPqrs('ffff-fffff-fffff-ffff');

      expect(result).toEqual([]);
    });
  });
});
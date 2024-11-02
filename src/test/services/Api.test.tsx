// assuming your file is named userService.ts
import { REACT_NATIVE_APP_BACKEND_URL } from '@env';
import fetchMock from 'jest-fetch-mock';
import { fetchPqrs, registerPqr, registerUser } from '../../services/Api';

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

      const mockResponse = { code: 200, data: { id: 'ffff-fffff-fffff-ffff', message: 'User created successfully'}, message: 'ok'};
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await registerUser(mockUserData);

      expect(fetchMock).toHaveBeenCalledWith(`${expectedEnv}/api/user/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockUserData),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when returning a generic error', async () => {
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

      fetchMock.mockRejectOnce(new Error('Error en la biblioteca de fetch'));

      await expect(registerUser(mockUserData)).rejects.toThrow('Error en la biblioteca de fetch');
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

      const mockResponse = { code: 400, data: '', message: 'Resource not found' };
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 400 });
      
      await expect(registerUser(mockUserData)).rejects.toThrow('Error al crear el usuario en el backend');
    });
  });

  describe('fetchPqrs', () => {
    it('should return PQR data for the given username', async () => {
      const mockResponse = { code: 200, data: [{ channel: 'voice', id: 'ffff-fffff-fffff-ffff', status: 'Abierto' }], message: 'ok', ok: true};
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await fetchPqrs('ffff-fffff-fffff-ffff');

      expect(fetchMock).toHaveBeenCalledWith(`${expectedEnv}/api/pqr/findByUuid?uuid=ffff-fffff-fffff-ffff`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when returning a generic error', async () => {
      fetchMock.mockRejectOnce(new Error('Error en la biblioteca de fetch'));

      await expect(fetchPqrs('ffff-fffff-fffff-ffff')).rejects.toThrow('Error en la biblioteca de fetch');
    });

    it('should return an empty array if no PQRs are found for the user', async () => {
      const mockResponse = { code: 200, data: [], message: 'ok', ok: true};
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await fetchPqrs('ffff-fffff-fffff-ffff');

      expect(result).toEqual(mockResponse);
    });
  });

  describe('registerPqr', () => {
    it('should call the correct endpoint and return result on success', async () => {
      const mockUserData = {
        uuidUsuario: 'ffff-fffff-fffff-ffff',
        tipoSolicitud: 'Petición',
        descripcion: 'Sucede que',
        numeroTransaccion: '1234567890',
        impactoProblema: 'Moderado',
        impactoSolucion: 'Retorno producto',
        canal: 'Móvil'
      };

      const mockResponse = { code: 200, data: { id: 'ffff-fffff-fffff-ffff', message: 'PQR created successfully'}, message: 'ok'};
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await registerPqr(mockUserData);

      expect(fetchMock).toHaveBeenCalledWith(`${expectedEnv}/api/pqr/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockUserData),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when returning a generic error', async () => {
      const mockUserData = {
        uuidUsuario: 'ffff-fffff-fffff-ffff',
        tipoSolicitud: 'Petición',
        descripcion: 'Sucede que',
        numeroTransaccion: '1234567890',
        impactoProblema: 'Moderado',
        impactoSolucion: 'Retorno producto',
        canal: 'Móvil'
      };

      fetchMock.mockRejectOnce(new Error('Error en la biblioteca de fetch'));

      await expect(registerPqr(mockUserData)).rejects.toThrow('Error en la biblioteca de fetch');
    });

    it('should call the correct endpoint and return result with error', async () => {
      const mockUserData = {
        uuidUsuario: 'ffff-fffff-fffff-ffff',
        tipoSolicitud: 'Petición',
        descripcion: 'Sucede que',
        numeroTransaccion: '1234567890',
        impactoProblema: 'Moderado',
        impactoSolucion: 'Retorno producto',
        canal: 'Móvil'
      };

      const mockResponse = { code: 400, data: '', message: 'Resource not found' };
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 400 });
      
      await expect(registerPqr(mockUserData)).rejects.toThrow('Error al crear el pqr en el backend');
    });
  });
});
import { REACT_NATIVE_APP_BACKEND_URL } from '@env';

//The env var is remapped to another const or let variable in order to properly load the value from .env file when launching unit tests with Jest and they are transformed by Babel-jest
const expectedEnv = REACT_NATIVE_APP_BACKEND_URL;
const urlUserBase = `${expectedEnv}/api/user`;
const urlPqrBase = `${expectedEnv}/api/pqr`;

export async function registerUser(userData: { 
  uuid: string | undefined,
  nombre: string,
  apellido: string,
  email: string,
  telefono: string,
  front: string,
  direccion: string,
  numero_documento: string,
  tipo_documento: string,
  aceptada_politica_aviso_privacidad: boolean
}): Promise<{ code: number, data: any, message: string }> {
  const url = `${urlUserBase}/create`;
  console.log('Url to connect: ', url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error("Error al crear el usuario en el backend");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.debug("Error en la solicitud al backend:", error);
    throw error;
  }
};

export const fetchPqrs = async (username: string) : Promise<{ code: number, data: any, message: string }> => {
  const url = `${urlPqrBase}/findAll?uuid=${username}`;
  console.log('Url to connect: ', url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.debug("Error en la solicitud al backend:", error);
    throw error;
  }
};

export async function registerPqr(pqrData: {
  uuidUsuario: string | undefined,
  tipoSolicitud: string,
  descripcion: string,
  numeroTransaccion: string,
  impactoProblema: string,
  impactoSolucion: string,
  canal: string
}): Promise<{ code: number, data: any, message: string }> {
  const url = `${urlPqrBase}/create`;
  console.log('Url to connect: ', url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pqrData),
    });
    
    if (!response.ok) {
      throw new Error("Error al crear el pqr en el backend");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.debug("Error en la solicitud al backend:", error);
    throw error;
  }
};
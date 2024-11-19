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
  const url = `${urlPqrBase}/findByUuid?uuid=${username}`;
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
  console.log('Data to send: ', pqrData);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pqrData),
    });
    
    console.log('response', response);
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

export const getUserById = async (uuidUsuario: string): Promise<{ code: number, data: any, message: string }> => {
  const url = `${urlUserBase}/getUserById?uuid=${uuidUsuario}`;
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
}

export async function updateUser(uuidUsuario: string, userData: { telefono: string, direccion: string }): Promise<{ code: number, data: any, message: string }> {
  const url = `${urlUserBase}/update?uuid=${uuidUsuario}`;
  console.log('Url to connect: ', url);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error("Error al actualizar el usuario en el backend");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.debug("Error en la solicitud al backend:", error);
    throw error;
  }
};

export async function updateUserChannels(uuidUsuario: string, userData: { habilitar_sms: boolean, habilitar_correo: boolean, habilitar_llamada: boolean }): Promise<{ code: number, data: any, message: string }> {
  const url = `${urlUserBase}/updateChannels?uuid=${uuidUsuario}`;
  console.log('Url to connect: ', url);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error("Error al actualizar los canales de comunicacion del usuario en el backend");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.debug("Error en la solicitud al backend:", error);
    throw error;
  }
};

export async function saveSurvey(surveyData: { 
  uuid: string,
  nombre_encuesta: string,
  nivel_percepcion: string,
  recomendar_servicio: string,
  opinion: string
}): Promise<{ code: number, data: any, message: string }> {
  const url = `${urlUserBase}/saveSurvey`; // Ensure this matches your backend endpoint
  console.log('Url to connect: ', url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(surveyData),
    });

    if (!response.ok) {
      throw new Error("Error al guardar la encuesta en el backend");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.debug("Error en la solicitud al backend:", error);
    throw error;
  }
};

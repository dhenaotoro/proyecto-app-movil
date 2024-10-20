//import axios from 'axios';
//import { REACT_NATIVE_APP_BACKEND_URL} from '@env';

//const urlUserBase = `${REACT_NATIVE_APP_BACKEND_URL}/api/user`;
const urlUserBase = 'https://hkslfdwjt2.execute-api.us-east-1.amazonaws.com/dev/api/user';

export async function registerUser(userData: { uuid: string | undefined; nombre: string; apellido: string; email: string; telefono: string; front: string; direccion: string;  numero_documento: string; tipo_documento: string; aceptada_politica_privacidad_datos: boolean}) {
  const url = `${urlUserBase}/create`;

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
    console.error("Error en la solicitud al backend:", error);
    throw error;
  }
};

export const fetchPqrs = async (username: string) : Promise<{ id: string, status: string, channel: string}[]> => {
  // Simulated backend response
  console.log("Mock fetchUserData called for:", username);
  const mockData: { [key: string]: { id: string, status: string, channel: string}[]} = {
    'IVAN': [
      { id: '000000001', status: 'Abierto', channel: 'App móvil' },
      { id: '000000002', status: 'Cerrado', channel: 'Chatbot' },
      { id: '000000003', status: 'Cerrado', channel: 'Llamada' }
    ],
    'DANIEL': [] // No PQRs for this user
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData[username] || []);
    }, 1000);
  });
};
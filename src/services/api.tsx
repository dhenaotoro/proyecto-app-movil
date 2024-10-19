import axios from 'axios';
import { REACT_NATIVE_APP_BACKEND_URL} from '@env';

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
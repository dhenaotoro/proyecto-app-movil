import axios from 'axios';

const urlUserBase = `${process.env.REACT_NATIVE_APP_BACKEND_URL}/api/user`;

export async function registerUser(userData: { uuid: string | undefined; nombre: string; apellido: string; email: string; telefono: string; front: string; address: string; identification: string; identificationType: string; }) {
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
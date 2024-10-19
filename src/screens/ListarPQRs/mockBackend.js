// mockBackend.js
export const fetchUserData = async (username) => {
    // Simulated backend response
    console.log("Mock fetchUserData called for:", username);
    const mockData = {
      "IVAN": [
        { id: "000000001", status: "Abierto", channel: "App móvil" },
        { id: "000000002", status: "Cerrado", channel: "Chatbot" },
        { id: "000000003", status: "Cerrado", channel: "Llamada" }
      ],
      "DANIEL": [] // No PQRs for this user
    };
  
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData[username] || []);
      }, 1000);
    });
  };
  
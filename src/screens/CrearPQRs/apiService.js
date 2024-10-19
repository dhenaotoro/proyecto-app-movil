// apiService.js
export const sendPQRData = async (pqrData) => {
    // Simulate a POST request
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (pqrData) {
          resolve({ message: 'PQR successfully submitted' });
        } else {
          reject(new Error('Failed to submit PQR'));
        }
      }, 1000);
    });
  };
  
import axios from 'axios';

const API_URL = 'https://aws-lambda.com/api';

const registerUser = () => {
    return axios.post(`${API_URL}/registerUser>`, {});
};

export default {
    registerUser
};
import axios from 'axios';

const API_URL = 'https://aws-lambda.com/api';

const login = (email: string, password: string) => {
    return axios.post(`${API_URL}/login`, { email, password });
};

export default {
    login
};
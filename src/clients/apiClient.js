const axios = require('axios');
const dotenv = require('dotenv');
const { login } = require('../utils/tokenUtils');

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;
const AUTH_REQUIRED = process.env.AUTH_REQUIRED === 'true';

let authToken = null;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const setAuthToken = (token) => {
  authToken = token;
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const get = async (endpoint, config = {}) => {
  if (AUTH_REQUIRED && !authToken) {
    const token = await login();
    setAuthToken(token);
  }
  return apiClient.get(endpoint, config);
};

const post = async (endpoint, data, config = {}) => {
  if (AUTH_REQUIRED && !authToken) {
    const token = await login();
    setAuthToken(token);
  }
  return apiClient.post(endpoint, data, config);
};

const put = async (endpoint, data, config = {}) => {
  if (AUTH_REQUIRED && !authToken) {
    const token = await login();
    setAuthToken(token);
  }
  return apiClient.put(endpoint, data, config);
};

const del = async (endpoint, config = {}) => {
  if (AUTH_REQUIRED && !authToken) {
    const token = await login();
    setAuthToken(token);
  }
  return apiClient.delete(endpoint, config);
};

module.exports = { get, post, put, del };
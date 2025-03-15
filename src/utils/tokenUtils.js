const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const login = async () => {
  const response = await axios.post(`${process.env.API_BASE_URL}${process.env.AUTH_ENDPOINT}`, {
    username: process.env.AUTH_USERNAME,
    password: process.env.AUTH_PASSWORD,
  });
  return response.data.token;
};

module.exports = { login };
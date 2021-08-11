import axiosBase from 'axios';

const BASE_URL = `http://${location.hostname}:8125`;
const axios = axiosBase.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'  
});

export {
  axios,
  BASE_URL,
};

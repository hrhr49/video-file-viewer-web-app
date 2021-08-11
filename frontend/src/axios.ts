import axiosBase from 'axios';
import {
  PORT
} from '../../common/config';

const BASE_URL = `http://${location.hostname}:${PORT}`;
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

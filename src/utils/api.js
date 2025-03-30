import axios from 'axios';
import { mailServiceUrl } from './constants';

const api = axios.create({
  baseURL: mailServiceUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

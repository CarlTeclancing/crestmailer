import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const http = axios.create({ baseURL: BASE, headers: { 'Content-Type': 'application/json' } });

http.interceptors.response.use(
  r => r.data,
  e => Promise.reject(new Error(e.response?.data?.error || e.message || 'Something went wrong'))
);

export const contactsApi = {
  getAll: (p = {}) => http.get('/contacts.php', { params: p }),
  create: (d) => http.post('/contacts.php', d),
  update: (id, d) => http.put(`/contacts.php?id=${id}`, d),
  delete: (id) => http.delete(`/contacts.php?id=${id}`),
};

export const campaignsApi = {
  getAll: (p = {}) => http.get('/campaigns.php', { params: p }),
  create: (d) => http.post('/campaigns.php', d),
  send: (id) => http.post(`/campaigns.php?action=send&id=${id}`),
  delete: (id) => http.delete(`/campaigns.php?id=${id}`),
};

export const mailApi = {
  getLogs: (p = {}) => http.get('/mail.php', { params: p }),
  send: (d) => http.post('/mail.php', d),
};

export const usersApi = {
  getAll: () => http.get('/users.php'),
  create: (d) => http.post('/users.php', d),
  update: (id, d) => http.put(`/users.php?id=${id}`, d),
  delete: (id) => http.delete(`/users.php?id=${id}`),
};

export const settingsApi = {
  get: () => http.get('/settings.php'),
  update: (d) => http.post('/settings.php', d),
};

export const statsApi = { get: () => http.get('/stats.php') };

export default http;

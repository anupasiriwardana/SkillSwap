import { http } from '../../lib/api';

export const authApi = {
  register: (body) => http.post('/auth/register', body),
  login: (body) => http.post('/auth/login', body),
  me: () => http.get('/auth/me'),
};

import { http } from '../../lib/api';

export const profileKeys = {
  mine: ['profile', 'me'],
};

export const profileApi = {
  getMine: () => http.get('/me/profile'),
  saveMine: (body) => http.put('/me/profile', body),
};

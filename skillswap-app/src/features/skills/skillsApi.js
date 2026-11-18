import { http } from '../../lib/api';

export const skillKeys = {
  mine: ['skills', 'mine'],
  suggest: (q) => ['skills', 'suggest', q],
};

export const skillsApi = {
  listMine: () => http.get('/me/skills'),
  add: (body) => http.post('/me/skills', body),
  update: (id, body) => http.put(`/me/skills/${id}`, body),
  remove: (id) => http.delete(`/me/skills/${id}`),
  suggest: (q) => http.get('/skills/suggest', { q }),
};

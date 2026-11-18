import { http } from '../../lib/api';

export const adminKeys = {
  stats: ['admin', 'stats'],
  users: (filters) => ['admin', 'users', filters],
  skills: (filters) => ['admin', 'skills', filters],
};

export const adminApi = {
  stats: () => http.get('/admin/stats'),
  users: (params) => http.get('/admin/users', params),
  setUserStatus: (id, active) => http.patch(`/admin/users/${id}/status`, { active }),
  skills: (params) => http.get('/admin/skills', params),
  mergeSkill: (id, targetSkillId) => http.post(`/admin/skills/${id}/merge`, { targetSkillId }),
  deleteSkill: (id) => http.delete(`/admin/skills/${id}`),
};

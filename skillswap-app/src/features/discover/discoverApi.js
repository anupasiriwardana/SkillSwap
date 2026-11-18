import { http } from '../../lib/api';

export const discoverKeys = {
  all: ['discover'],
  matches: (filters) => ['discover', 'matches', filters],
  members: (filters) => ['discover', 'members', filters],
  member: (id) => ['discover', 'member', String(id)],
};

const clean = (params) => Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null));

export const discoverApi = {
  matches: (filters) => http.get('/matches', clean(filters)),
  members: (filters) => http.get('/members', clean(filters)),
  member: (id) => http.get(`/members/${id}`),
};

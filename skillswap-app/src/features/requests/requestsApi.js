import { http } from '../../lib/api';

export const requestKeys = {
  all: ['requests'],
  incoming: ['requests', 'incoming'],
  outgoing: ['requests', 'outgoing'],
};

export const requestsApi = {
  send: (body) => http.post('/requests', body),
  incoming: () => http.get('/requests/incoming'),
  outgoing: () => http.get('/requests/outgoing'),
  accept: (id) => http.post(`/requests/${id}/accept`),
  decline: (id) => http.post(`/requests/${id}/decline`),
  cancel: (id) => http.post(`/requests/${id}/cancel`),
};

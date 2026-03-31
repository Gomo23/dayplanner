import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) { localStorage.clear(); window.location.href = '/login'; }
  return Promise.reject(err);
});

export const authAPI = {
  login:    d => api.post('/auth/login', d),
  register: d => api.post('/auth/register', d),
};
export const tasksAPI = {
  getAll:          () => api.get('/tasks'),
  getByDate:       d  => api.get(`/tasks/date/${d}`),
  getHighPriority: () => api.get('/tasks/priority/high'),
  stats:           () => api.get('/tasks/stats'),
  create:          d  => api.post('/tasks', d),
  update:          (id,d) => api.put(`/tasks/${id}`, d),
  toggle:          id => api.patch(`/tasks/${id}/toggle`),
  delete:          id => api.delete(`/tasks/${id}`),
};
export const expensesAPI = {
  getAll:   ()         => api.get('/expenses'),
  summary:  (y,m)      => api.get(`/expenses/summary/${y}/${m}`),
  create:   d          => api.post('/expenses', d),
  delete:   id         => api.delete(`/expenses/${id}`),
};
export const notesAPI = {
  getAll: ()       => api.get('/notes'),
  create: d        => api.post('/notes', d),
  update: (id,d)   => api.put(`/notes/${id}`, d),
  delete: id       => api.delete(`/notes/${id}`),
};

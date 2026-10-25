import api from './api';

export const contactService = {
  submitContact: async (data) => {
    const response = await api.post('/contact', data);
    return response.data;
  },

  getMessages: async () => {
    const response = await api.get('/contact');
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/contact/${id}`, { status });
    return response.data;
  },
};

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};

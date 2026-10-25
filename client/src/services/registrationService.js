import api from './api';

export const registrationService = {
  registerForEvent: async (eventId, notes = '') => {
    const response = await api.post(`/events/${eventId}/register`, { notes });
    return response.data;
  },

  cancelRegistration: async (eventId) => {
    const response = await api.delete(`/events/${eventId}/register`);
    return response.data;
  },

  getMyRegistrations: async () => {
    const response = await api.get('/registrations/my');
    return response.data;
  },

  getEventRegistrations: async (eventId) => {
    const response = await api.get(`/events/${eventId}/registrations`);
    return response.data;
  },
};

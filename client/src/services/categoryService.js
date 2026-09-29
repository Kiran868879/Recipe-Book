import api from './api';

const categoryService = {
  list: async ({ page = 1, limit = 100 } = {}) => {
    const response = await api.get('/categories', { params: { page, limit } });
    return response.data;
  },

  create: async (category) => {
    const response = await api.post('/categories', category);
    return response.data;
  },

  update: async (id, category) => {
    const response = await api.put(`/categories/${id}`, category);
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export default categoryService;

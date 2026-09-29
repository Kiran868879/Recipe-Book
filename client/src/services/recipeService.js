import api from './api';

const recipeService = {
  list: async ({ page = 1, limit = 9 } = {}) => {
    const response = await api.get('/recipes', { params: { page, limit } });
    return response.data;
  },

  quick: async ({ page = 1, limit = 9 } = {}) => {
    const response = await api.get('/recipes/quick', { params: { page, limit } });
    return response.data;
  },

  search: async ({ query = '', page = 1, limit = 9 } = {}) => {
    const response = await api.get('/recipes/search', { params: { q: query, page, limit } });
    return response.data;
  },

  byCategory: async ({ categoryId, page = 1, limit = 9 } = {}) => {
    const response = await api.get(`/recipes/category/${categoryId}`, { params: { page, limit } });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  create: async (recipe) => {
    const response = await api.post('/recipes', recipe);
    return response.data;
  },

  update: async (id, recipe) => {
    const response = await api.put(`/recipes/${id}`, recipe);
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },

  favorite: async (id) => {
    const response = await api.post(`/recipes/${id}/favorite`);
    return response.data;
  },
};

export default recipeService;

import apiClient from './apiClient';

export const authService = {
  register: async (data) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await apiClient.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },
};

export const barangService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/barang', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/barang/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/barang', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/barang/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/barang/${id}`);
    return response.data;
  },
};

export const kategoriService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/kategori', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/kategori/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/kategori', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/kategori/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/kategori/${id}`);
    return response.data;
  },
};

export const peminjamanService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/peminjaman', { params });
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/peminjaman', data);
    return response.data;
  },

  returnBarang: async (id, data) => {
    const response = await apiClient.post(`/peminjaman/${id}/return`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/peminjaman/${id}`);
    return response.data;
  },
};

export const laporanService = {
  getDashboardStats: async () => {
    const response = await apiClient.get('/laporan/dashboard/stats');
    return response.data;
  },

  getBarangByKategori: async () => {
    const response = await apiClient.get('/laporan/barang/by-kategori');
    return response.data;
  },

  getPeminjamanReport: async (params = {}) => {
    const response = await apiClient.get('/laporan/peminjaman/report', { params });
    return response.data;
  },

  getInventoryReport: async (params = {}) => {
    const response = await apiClient.get('/laporan/inventory/report', { params });
    return response.data;
  },
};

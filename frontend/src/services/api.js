const BASE_URL = '';

const request = async (endpoint, options = {}) => {
  const config = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
};

export const api = {
  async getMe() {
    return request('/auth/me', { method: 'GET' });
  },

  async login(email, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(name, email, password) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  async logout() {
    return request('/auth/logout', {
      method: 'POST',
    });
  },

  async calculate(operation, numbers) {
    return request('/actions', {
      method: 'POST',
      body: JSON.stringify({ operation, numbers }),
    });
  },

  async getHistory() {
    return request('/actions/history', {
      method: 'GET',
    });
  },

  async checkHealth() {
    return request('/health', { method: 'GET' });
  }
};

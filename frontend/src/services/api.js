const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production'
  ? 'https://sudanes-chemical-industries-pos-gpd.vercel.app/api'
  : 'http://localhost:5000/api');

// Helper for timeout-aware fetch
const fetchWithTimeout = async (resource, options = {}) => {
  const { timeout = 8000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const apiService = {
  registerUser: async (userData) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  },

  getUser: async (userId) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/user/${userId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  getQuestions: async (unitId, count = 10, userId = null, excludeIds = []) => {
    try {
      let url = `${API_BASE_URL}/questions/rotate/${unitId}/${count}`;
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (excludeIds && excludeIds.length > 0) params.append('excludeIds', excludeIds.join(','));
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetchWithTimeout(url);
      if (!response.ok) throw new Error('Backend unreachable');
      return await response.json();
    } catch (error) {
      console.warn('Falling back to Demo Mode data:', error);
      throw error;
    }
  },

  checkAnswer: async (questionId, userAnswer) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/questions/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, userAnswer }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Check answer error:', error);
      throw error;
    }
  },

  getUserProfile: async (userId) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/user/profile/${userId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  syncUserStats: async (userId, data) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/user/sync/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Sync stats error:', error);
      throw error;
    }
  },

  getLeaderboard: async () => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/user/leaderboard`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Get leaderboard error:', error);
      throw error;
    }
  }
};

export default apiService;

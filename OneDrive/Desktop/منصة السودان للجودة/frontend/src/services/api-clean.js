const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' 
  ? 'https://sudan-quality-platform-backend.onrender.com/api' 
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
  // New certificate functions
  awardCertificate: async (data) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/certificates/award-public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Award certificate error:', error);
      throw error;
    }
  },

  // Set user level
  setUserLevel: async (userId, level) => {
    try {
      const profileRes = await fetchWithTimeout(`${API_BASE_URL}/user/profile/${userId}`);
      const profile = await profileRes.json();
      profile.progress.level = level;
      const response = await fetchWithTimeout(`${API_BASE_URL}/user/sync/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Set level error:', error);
      throw error;
    }
  },

  // Get certificates
  getUserCertificates: async (userId) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/user/certificates/${userId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Get certificates error:', error);
      throw error;
    }
  }
};

export default apiService;

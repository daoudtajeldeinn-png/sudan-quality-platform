export const APP_VERSION = '1.0.10';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production'
  ? 'https://sudan-quality-platform-5aekyyazn-daoudtajeldeinn-pngs-projects.vercel.app/api'
  : 'http://localhost:5000/api');

// Helper for timeout-aware fetch
const fetchWithTimeout = async (resource, options = {}, authToken = null) => {
  const { timeout = 30000 } = options; // Increased to 30s for cold starts
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(resource, {
      ...options,
      headers,
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
  // تسجيل مستخدم جديد
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

  // الحصول على بيانات المستخدم
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

  // الحصول على الأسئلة مع دعم الـ Demo Mode
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
      throw error; // Re-throw to be handled by component fallback
    }
  },

  // التحقق من إجابة السؤال عبر السيرفر
  checkAnswer: async (questionId, userAnswer, shuffledIndices = null) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/questions/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, userAnswer, shuffledIndices }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Check answer error:', error);
      throw error;
    }
  },

  // الحصول على الملف الشخصي الكامل (XP, Level, Badges)
  getUserProfile: async (userId, authToken = null) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/user/profile/${userId}`, {}, authToken);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // مزامنة البيانات مع السيرفر
  syncUserStats: async (userId, data, authToken = null) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/user/sync/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }, authToken);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Sync stats error:', error);
      throw error;
    }
  },

  // الحصول على القائمة المتصدرة (Leaderboard)
  getLeaderboard: async (authToken = null) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/user/leaderboard`, {}, authToken);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Get leaderboard error:', error);
      throw error;
    }
  },

  // Award certificate after quiz (public endpoint)
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

  // Mark a unit as completed
  markUnitCompleted: async (userId, unitId, score, totalQuestions) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/user/complete/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitId, score, totalQuestions }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Mark unit completed error:', error);
      throw error;
    }
  },

  // Get user certificates
  getUserCertificates: async (userId, authToken = null) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/user/certificates/${userId}`, {}, authToken);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Get certificates error:', error);
      throw error;
    }
  },

  // Set user level (via sync)
  setUserLevel: async (userId, level) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/user/profile/${userId}`);
      if (!response.ok) throw new Error('Profile fetch failed');
      const profile = await response.json();
      if (!profile) throw new Error('Profile not found');
      if (!profile.progress) profile.progress = { unitScores: {}, unitStates: {}, certificates: [], completedUnits: [] };
      profile.progress.level = level;
      return apiService.syncUserStats(userId, profile);
    } catch (error) {
      console.error('Set level error:', error);
      throw error;
    }
  }
};

export default apiService;

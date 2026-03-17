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
  getQuestions: async (unitId, count = 10) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/questions/${unitId}/${count}`);
      if (!response.ok) throw new Error('Backend unreachable');
      return await response.json();
    } catch (error) {
      console.warn('Falling back to Demo Mode data:', error);
      throw error; // Re-throw to be handled by component fallback
    }
  },

  // التحقق من إجابة السؤال عبر السيرفر
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
  }
};

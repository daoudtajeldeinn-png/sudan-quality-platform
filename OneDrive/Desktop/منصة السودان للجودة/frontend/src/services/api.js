const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  // تسجيل مستخدم جديد
  registerUser: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  },

  // الحصول على بيانات المستخدم
  getUser: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }
};

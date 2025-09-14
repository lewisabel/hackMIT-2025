// frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:3001/api';

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`Making API request to: ${url}`);
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      throw new Error(errorData.message || errorData.error || `API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.success ? data.data : data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

// Updated Teacher API functions (remove teacher ID from URLs)
export const teacherApi = {
  async getStats() {  // Remove teacherId parameter
    return apiRequest(`/teacher/stats`);  // Remove ${teacherId} from URL
  },

  async getStudentsNeedingAttention(limit = 5) {  // Remove teacherId parameter
    return apiRequest(`/teacher/students/attention?limit=${limit}`);  // Remove ${teacherId} from URL
  },

  async getClassPerformance() {  // Remove teacherId parameter
    return apiRequest(`/teacher/classes/performance`);  // Remove ${teacherId} from URL
  }
};
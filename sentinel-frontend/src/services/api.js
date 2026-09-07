import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const analyzeEmlFile = async (file) => {
  const formData = new FormData();
  formData.append('emlFile', file);

  const response = await API.post('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const fetchCases = async () => {
  try {
    const response = await API.get('/cases');
    return response.data;
  } catch (error) {
    console.error('Error fetching cases from Atlas:', error);
    return []; 
  }
};

export const fetchCaseById = async (caseId) => {
  try {
    const response = await API.get(`/cases/${caseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching case ${caseId}:`, error);
    return null; 
  }
};

// NEW: Chat API function
export const sendChatMessage = async (message, caseId) => {
  try {
    const response = await API.post('/chat', { message, caseId });
    return response.data.reply;
  } catch (error) {
    console.error("Chat API Error:", error);
    return "Connection to Sentinel AI lost. Please check backend server.";
  }
};
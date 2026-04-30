/* Centralized API configuration */
// Change this URL if deploying to a different server
const API_BASE_URL = 'http://localhost:3000/api';

const api = {
    // Generate headers for requests
    getHeaders(requireAuth = false) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (requireAuth) {
            const token = localStorage.getItem('adminToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return headers;
    },

    // Helper for POST requests
    async post(endpoint, data, requireAuth = false) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(requireAuth),
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    },

    // Helper for GET requests
    async get(endpoint, requireAuth = false) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: this.getHeaders(requireAuth),
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }
};

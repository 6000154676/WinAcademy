// Authentication handlers
const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/pages/login.html';
    }
};

const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/pages/login.html';
};

// Auto-run if elements exist
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

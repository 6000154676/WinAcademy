// UI Logic

// Render dynamic navbar based on auth status
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.getElementById('nav-links');
    if (navLinks) {
        const token = localStorage.getItem('adminToken');
        if (token) {
            // Logged in
            navLinks.innerHTML += `
                <li><a href="/pages/dashboard.html">Dashboard</a></li>
                <li><a href="#" id="logoutBtn">Logout</a></li>
            `;
            
            // Re-attach logout listener if inserted dynamically
            document.getElementById('logoutBtn').addEventListener('click', () => {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                window.location.href = '/index.html';
            });
        } else {
            // Logged out
            navLinks.innerHTML += `
                <li><a href="/pages/login.html" class="btn">Admin Login</a></li>
            `;
        }
    }
});

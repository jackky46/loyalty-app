import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Handle 419 CSRF token mismatch - reload page to get new token
window.axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 419) {
            // CSRF token expired, reload page
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

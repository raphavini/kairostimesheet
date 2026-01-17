
// Base API URL - change this if your PHP server runs elsewhere
// const API_BASE = 'http://localhost:8000/api';
const API_BASE = 'api';

async function request(url: string, options?: RequestInit) {
    const res = await fetch(url, options);
    if (!res.ok) {
        if (res.status === 401) {
            // Optional: trigger a logout if 401
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = '#/auth/login';
        }
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `HTTP error! status: ${res.status}`);
    }
    return res.json();
}

export const api = {
    async getContracts() {
        return request(`${API_BASE}/contracts.php`);
    },

    async createContract(data: any) {
        return request(`${API_BASE}/contracts.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    },

    async getClients() {
        return request(`${API_BASE}/clients.php`);
    },

    async getDashboardStats() {
        return request(`${API_BASE}/stats.php`);
    },

    async getLogs() {
        return request(`${API_BASE}/logs.php?action=logs`);
    },

    async getProjects() {
        return request(`${API_BASE}/logs.php?action=projects`);
    },

    async createLog(data: any) {
        return request(`${API_BASE}/logs.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    },

    async getAuditLogs() {
        return request(`${API_BASE}/audit.php`);
    }
};

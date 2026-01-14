
// Base API URL - change this if your PHP server runs elsewhere
// const API_BASE = 'http://localhost:8000/api';
const API_BASE = '/api';

export const api = {
    async getContracts() {
        const res = await fetch(`${API_BASE}/contracts.php`);
        return res.json();
    },

    async getDashboardStats() {
        const res = await fetch(`${API_BASE}/stats.php`);
        return res.json();
    },

    async getLogs() {
        const res = await fetch(`${API_BASE}/logs.php?action=logs`);
        return res.json();
    },

    async getProjects() {
        const res = await fetch(`${API_BASE}/logs.php?action=projects`);
        return res.json();
    },

    async createLog(data: any) {
        const res = await fetch(`${API_BASE}/logs.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async getAuditLogs() {
        const res = await fetch(`${API_BASE}/audit.php`);
        return res.json();
    }
};


const API_BASE = 'http://localhost:8000/api';

export const authApi = {
    async login(email, password) {
        const res = await fetch(`${API_BASE}/auth.php?action=login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return res.json();
    },

    async verify2FA(userId, code) {
        const res = await fetch(`${API_BASE}/auth.php?action=verify-2fa`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, code })
        });
        return res.json();
    },

    async forgotPassword(email) {
        const res = await fetch(`${API_BASE}/auth.php?action=forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        return res.json();
    },

    async resetPassword(token, password) {
        const res = await fetch(`${API_BASE}/auth.php?action=reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password })
        });
        return res.json();
    },

    async changePassword(userId, currentPassword, newPassword) {
        const res = await fetch(`${API_BASE}/auth.php?action=change-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, currentPassword, newPassword })
        });
        return res.json();
    }
};

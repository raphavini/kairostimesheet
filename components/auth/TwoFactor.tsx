
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";

export const TwoFactor: React.FC = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const userId = location.state?.userId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
        setError("Session invalid. Please login again.");
        return;
    }

    setLoading(true);
    try {
      const res = await authApi.verify2FA(userId, code);
      if (res.status === "success") {
        login(res.user, res.token);
        navigate("/");
      } else {
        setError(res.error || "Invalid verification code");
      }
    } catch (err) {
      setError("Error verifying code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background-dark p-4">
      <div className="w-full max-w-md bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-slate-200 dark:border-border-dark overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="size-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto mb-4">
              <span className="material-symbols-outlined text-2xl">phonelink_lock</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Two-Factor Authentication</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Enter the 6-digit code from your authenticator app.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium text-center">
                {error}
              </div>
            )}
            
            <div className="flex justify-center">
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-32 text-center text-2xl tracking-widest px-4 py-2 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all font-mono"
                  placeholder="000000"
                  autoFocus
                />
            </div>

            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all disabled:opacity-70"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
            
            <div className="text-center">
                <p className="text-xs text-slate-400">Demo Code: <strong>123456</strong></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

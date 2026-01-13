
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../../services/auth";

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [debugToken, setDebugToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      setSubmitted(true);
      // For demonstration purposes only
      if (res.debug_token) {
        setDebugToken(res.debug_token);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background-dark p-4">
      <div className="w-full max-w-md bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-slate-200 dark:border-border-dark overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
              <span className="material-symbols-outlined text-2xl">lock_reset</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Reset Password</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Enter your email to receive recovery instructions.</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  placeholder="name@company.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              
              <Link to="/auth/login" className="flex items-center justify-center gap-2 text-sm text-slate-500 font-bold hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Login
              </Link>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="p-4 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
                If an account exists for <strong>{email}</strong>, you will receive an email with instructions.
              </div>
              
              {debugToken && (
                 <div className="p-4 bg-amber-50 text-amber-800 text-xs break-all rounded border border-amber-200">
                    <strong>Demo Mode:</strong> Use this token to reset: <br/>
                    {debugToken}
                 </div>
              )}

              <div className="flex flex-col gap-3">
                  <Link to={`/auth/reset-password?token=${debugToken}`} className="w-full py-2 border border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors">
                     Go to Reset Page (Demo)
                  </Link>
                  <Link to="/auth/login" className="text-sm text-slate-500 font-bold hover:text-primary">
                    Back to Login
                  </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

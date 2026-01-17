
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isIframe] = useState(window.self !== window.top);

  React.useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Security: You might want to validate event.origin here
      if (event.data && event.data.type === "LK_OS_AUTH_RESPONSE") {
        if (event.data.status === "approved") {
          setLoading(true);
          try {
            const res = await authApi.ssoLogin(event.data.user, event.data.token);
            if (res.status === "success") {
              login(res.user, res.token);
              navigate("/");
            } else {
              setError(res.error || "SSO Login failed");
            }
          } catch (err) {
            console.error("SSO Login Error:", err);
            setError("Failed to login with LK OS");
          } finally {
            setLoading(false);
          }
        } else if (event.data.status === "denied") {
          setError("Acesso negado pelo usuário.");
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [login, navigate]);

  const handleLkOsLogin = () => {
    setError("");
    window.parent.postMessage({ type: "LK_OS_AUTH_REQUEST" }, "*");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authApi.login(email, password);

      if (res.status === "success") {
        login(res.user, res.token);
        navigate("/");
      } else if (res.status === "2fa_required") {
        // Redirect to 2FA page passing userId
        navigate("/auth/2fa", { state: { userId: res.userId } });
      } else {
        setError(res.error || "Login failed");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const SocialButton = ({ icon, label, provider }: any) => (
    <button
      type="button"
      className="flex items-center justify-center gap-2 w-full py-2.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
      onClick={() => alert(`Login with ${provider} coming soon!`)}
    >
      <img src={icon} alt={label} className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background-dark p-4">
      <div className="w-full max-w-md bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-slate-200 dark:border-border-dark overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="size-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 mx-auto mb-4">
              <span className="material-symbols-outlined text-2xl">grid_view</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sign in to your account to continue</p>
          </div>

          {isIframe && (
            <div className="mb-6">
              <button
                type="button"
                onClick={handleLkOsLogin}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
              >
                Entrar com LK OS
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-border-dark"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-surface-dark px-2 text-slate-500 font-bold">Ou use seu e-mail</span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg font-medium text-center">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                <Link to="/auth/forgot-password" className="text-xs text-primary font-bold hover:underline">Forgot password?</Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : "Sign In"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-border-dark"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-surface-dark px-2 text-slate-500 font-bold">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SocialButton
              provider="Google"
              label="Google"
              icon="https://www.svgrepo.com/show/475656/google-color.svg"
            />
            <SocialButton
              provider="Microsoft"
              label="Microsoft"
              icon="https://www.svgrepo.com/show/452062/microsoft.svg"
            />
            <SocialButton
              provider="Apple"
              label="Apple"
              icon="https://ligadokodigo.com.br/images/apple_ios.svg"
            />
            <SocialButton
              provider="GitHub"
              label="GitHub"
              icon="https://www.svgrepo.com/show/512317/github-142.svg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

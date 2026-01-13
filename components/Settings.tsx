
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/auth";

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setMessage({ type: "", text: "" });
    
    try {
      const res = await authApi.changePassword(user.id, currentPassword, newPassword);
      if (res.status === "success") {
        setMessage({ type: "success", text: "Password changed successfully" });
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setMessage({ type: "error", text: res.error || "Failed to change password" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Settings</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences and security.</p>
       </div>

       <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-border-dark">
             <h3 className="text-lg font-bold">Security</h3>
             <p className="text-sm text-slate-500">Update your password and 2FA settings.</p>
          </div>
          
          <div className="p-6 space-y-8">
             {/* Change Password */}
             <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Change Password</h4>
                
                {message.text && (
                  <div className={`p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                  </div>
                )}

                <div className="space-y-1.5">
                   <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Current Password</label>
                   <input 
                     type="password" 
                     value={currentPassword}
                     onChange={(e) => setCurrentPassword(e.target.value)}
                     className="w-full px-3 py-2 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-sm font-medium text-slate-600 dark:text-slate-300">New Password</label>
                   <input 
                     type="password" 
                     value={newPassword}
                     onChange={(e) => setNewPassword(e.target.value)}
                     className="w-full px-3 py-2 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                   />
                </div>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-lg text-sm hover:bg-primary transition-colors disabled:opacity-50">
                   {loading ? "Updating..." : "Update Password"}
                </button>
             </form>

             <hr className="border-slate-100 dark:border-border-dark" />

             {/* Two Factor Status */}
             <div className="flex items-center justify-between">
                <div>
                   <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Two-Factor Authentication</h4>
                   <p className="text-sm text-slate-500 mt-1">Add an extra layer of security to your account.</p>
                </div>
                <button 
                  className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${
                      user?.two_factor_enabled 
                      ? "border-red-200 text-red-600 hover:bg-red-50" 
                      : "border-primary text-primary hover:bg-primary/5"
                  }`}
                  onClick={() => alert("Toggle 2FA logic would go here.")}
                >
                   {user?.two_factor_enabled ? "Disable 2FA" : "Enable 2FA"}
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

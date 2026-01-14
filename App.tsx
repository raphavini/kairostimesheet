
import React from "react";
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Contracts } from "./components/Contracts";
import { TimeTracker } from "./components/TimeTracker";
import { Reports } from "./components/Reports";
import { AuditLogs } from "./components/AuditLogs";
import { Settings } from "./components/Settings";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Login } from "./components/auth/Login";
import { ForgotPassword } from "./components/auth/ForgotPassword";
import { ResetPassword } from "./components/auth/ResetPassword";
import { TwoFactor } from "./components/auth/TwoFactor";

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <Layout><Outlet /></Layout> : <Navigate to="/auth/login" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/auth/2fa" element={<TwoFactor />} />

          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute />}>
            <Route index element={<Dashboard />} />
            <Route path="contracts" element={<Contracts />} />
            <Route path="time-tracking" element={<TimeTracker />} />
            <Route path="reports" element={<Reports />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

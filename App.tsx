import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Contracts } from "./components/Contracts";
import { TimeTracker } from "./components/TimeTracker";
import { Reports } from "./components/Reports";
import { AuditLogs } from "./components/AuditLogs";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/time-tracking" element={<TimeTracker />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/settings" element={<div className="p-8 text-center text-slate-500">Settings Module Placeholder</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

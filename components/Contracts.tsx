import React, { useEffect, useState } from "react";
import { Contract } from "../types";
import { api } from "../services/api";

export const Contracts: React.FC = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getContracts().then(data => {
        setContracts(data);
        setLoading(false);
    }).catch(err => {
        console.error("Failed to load contracts", err);
        setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading contracts...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h2 className="text-3xl font-extrabold tracking-tight">Contract Management</h2>
           <p className="text-slate-500 dark:text-slate-400 mt-1">Manage active subscriptions and hourly pools.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-lg">add</span>
            <span>New Contract</span>
        </button>
      </div>

      <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-200 dark:border-border-dark flex gap-4 overflow-x-auto">
           <button className="px-4 py-2 text-sm font-bold text-primary border-b-2 border-primary">All Contracts</button>
           <button className="px-4 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">Active</button>
           <button className="px-4 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">Expiring</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-border-dark text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Contract Name</th>
                <th className="px-6 py-4">Period</th>
                <th className="px-6 py-4">Consumption</th>
                <th className="px-6 py-4">Rate</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-dark text-sm">
              {contracts.map((contract) => {
                const consumptionPercent = Math.round((contract.usedHours / contract.totalHours) * 100);
                let progressBarColor = "bg-primary";
                if (consumptionPercent > 90) progressBarColor = "bg-red-500";
                else if (consumptionPercent > 75) progressBarColor = "bg-amber-500";

                return (
                  <tr key={contract.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-xs">
                          {contract.clientLogo}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{contract.clientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{contract.name}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                       {contract.startDate} - <span className="font-medium text-slate-700 dark:text-slate-200">{contract.endDate}</span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="w-full max-w-[140px]">
                         <div className="flex justify-between text-xs mb-1">
                            <span className="font-bold text-slate-700 dark:text-slate-200">{contract.usedHours}h</span>
                            <span className="text-slate-400">/ {contract.totalHours}h</span>
                         </div>
                         <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className={`h-full ${progressBarColor} rounded-full`} style={{ width: `${consumptionPercent}%` }}></div>
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">${contract.hourlyRate}/h</td>
                    <td className="px-6 py-4 text-right">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide
                         ${contract.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700'}
                       `}>
                          {contract.status}
                       </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-border-dark flex items-center justify-between">
           <p className="text-xs text-slate-500">Showing {contracts.length} records</p>
           <div className="flex gap-2">
              <button className="px-3 py-1 border border-slate-200 dark:border-border-dark rounded text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50">Prev</button>
              <button className="px-3 py-1 border border-slate-200 dark:border-border-dark rounded text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};

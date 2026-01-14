import React, { useState, useEffect } from "react";
import { MOCK_CLIENTS } from "../constants";
import { AuditEvent, AuditActionType } from "../types";
import { api } from "../services/api";

export const AuditLogs: React.FC = () => {
   const [logs, setLogs] = useState<AuditEvent[]>([]);
   const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      api.getAuditLogs().then(data => {
         setLogs(data);
         setLoading(false);
      }).catch(err => {
         console.error("Failed to load audit logs", err);
         setLoading(false);
      });
   }, []);

   const getActionBadge = (action: AuditActionType) => {
      switch (action) {
         case AuditActionType.CREATE:
            return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
         case AuditActionType.UPDATE:
            return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
         case AuditActionType.DELETE:
            return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
         case AuditActionType.LOGIN:
            return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
         default:
            return "bg-slate-100 text-slate-700";
      }
   };

   const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return {
         date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
         time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
   };

   if (loading) return <div className="p-8">Loading audit logs...</div>;

   return (
      <div className="flex h-[calc(100vh-8rem)] gap-6">
         {/* Left Sidebar Filters */}
         <div className="w-72 flex-shrink-0 flex flex-col gap-6">
            <div>
               <h3 className="font-bold text-lg">Filters</h3>
               <p className="text-slate-500 text-xs">Narrow down system audit logs</p>
            </div>

            <div className="space-y-4">
               {/* Time Range */}
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time Range</label>
                  <button className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-lg text-sm font-medium hover:border-primary/50 transition-colors">
                     <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-primary">calendar_today</span>
                        Last 7 Days
                     </span>
                     <span className="material-symbols-outlined text-slate-400">expand_more</span>
                  </button>
               </div>

               {/* Tenants */}
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tenants</label>
                  <div className="space-y-2">
                     <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" checked readOnly className="rounded text-primary focus:ring-primary/20 border-slate-300" />
                        <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">Global Admin Actions</span>
                     </label>
                     {MOCK_CLIENTS.map(client => (
                        <label key={client.id} className="flex items-center gap-2 cursor-pointer group">
                           <input type="checkbox" className="rounded text-primary focus:ring-primary/20 border-slate-300" />
                           <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">{client.name}</span>
                        </label>
                     ))}
                  </div>
                  <button className="text-xs text-primary font-bold flex items-center gap-1 hover:underline mt-1">
                     <span className="material-symbols-outlined text-sm">add</span> View All Tenants
                  </button>
               </div>

               {/* Action Types */}
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Action Types</label>
                  <div className="flex flex-wrap gap-2">
                     {['CREATE', 'UPDATE', 'DELETE', 'LOGIN'].map(action => {
                        let colorClass = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
                        if (action === 'CREATE') colorClass = "bg-emerald-50 text-emerald-600 border border-emerald-200";
                        if (action === 'UPDATE') colorClass = "bg-blue-50 text-blue-600 border border-blue-200";
                        if (action === 'DELETE') colorClass = "bg-red-50 text-red-600 border border-red-200";
                        if (action === 'LOGIN') colorClass = "bg-amber-50 text-amber-600 border border-amber-200";

                        return (
                           <button key={action} className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${colorClass} hover:opacity-80`}>
                              {action}
                           </button>
                        )
                     })}
                  </div>
               </div>

               {/* User Role */}
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">User Role</label>
                  <button className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-lg text-sm font-medium">
                     <span>All Roles</span>
                     <span className="material-symbols-outlined text-slate-400">expand_more</span>
                  </button>
               </div>

               {/* IP Filtering */}
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">IP Filtering</label>
                  <input
                     type="text"
                     placeholder="e.g. 192.168.1.1"
                     className="w-full px-3 py-2 bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
               </div>
            </div>

            <div className="mt-auto pt-6 space-y-3">
               <button className="w-full py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/25 hover:bg-primary-hover transition-colors">Apply Filters</button>
               <button className="w-full py-2.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-300 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors">Reset All</button>
            </div>
         </div>

         {/* Main Content Area */}
         <div className="flex-1 flex flex-col overflow-hidden">
            <div className="mb-6">
               <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                  <span>System Dashboard</span>
                  <span>/</span>
                  <span className="text-slate-600 dark:text-slate-200 font-medium">Audit & Activity Logs</span>
               </div>
               <h2 className="text-3xl font-extrabold tracking-tight">Audit logs</h2>
               <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time chronological record of every action across the platform.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-border-dark pb-1">
               <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-full shadow-md shadow-primary/20 flex items-center gap-2">
                  All Events <span className="material-symbols-outlined text-base">check</span>
               </button>
               <button className="px-4 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-sm font-bold rounded-full transition-colors">Contract Changes</button>
               <button className="px-4 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-sm font-bold rounded-full transition-colors">Billing Events</button>
               <button className="px-4 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-sm font-bold rounded-full transition-colors">Security Alerts</button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-border-dark text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <th className="px-6 py-4">Timestamp</th>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-border-dark">
                     {Array.isArray(logs) && logs.map(log => {
                        const { date, time } = formatDate(log.timestamp);
                        return (
                           <tr
                              key={log.id}
                              onClick={() => setSelectedEvent(log)}
                              className={`cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group ${selectedEvent?.id === log.id ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                           >
                              <td className="px-6 py-4">
                                 <div className="flex flex-col">
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{date}</span>
                                    <span className="text-xs text-slate-500">{time}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                    <img src={log.user.avatar} alt={log.user.name} className="size-10 rounded-full bg-slate-200" />
                                    <div>
                                       <p className="font-bold text-slate-900 dark:text-slate-100">{log.user.name}</p>
                                       <p className="text-xs text-slate-500">{log.user.role}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                       <span className={`w-1.5 h-1.5 rounded-full ${log.action === AuditActionType.DELETE ? 'bg-red-500' :
                                             log.action === AuditActionType.CREATE ? 'bg-emerald-500' : 'bg-blue-500'
                                          }`}></span>
                                       <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide ${getActionBadge(log.action)}`}>
                                          {log.description}
                                       </span>
                                    </div>
                                    <span className="text-sm text-slate-500 truncate max-w-[200px] hidden xl:block">{log.entityType}</span>
                                 </div>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
               <div className="p-4 border-t border-slate-200 dark:border-border-dark text-xs text-slate-500">
                  Showing {Array.isArray(logs) ? logs.length : 0} events
               </div>
            </div>
         </div>

         {/* Details Drawer (Overlay) */}
         {selectedEvent && (
            <div className="fixed inset-y-0 right-0 w-[600px] bg-white dark:bg-surface-dark shadow-2xl border-l border-slate-200 dark:border-border-dark z-50 transform transition-transform animate-slide-in-right flex flex-col">
               {/* Header */}
               <div className="p-6 border-b border-slate-200 dark:border-border-dark flex items-start justify-between bg-white dark:bg-surface-dark z-10">
                  <div>
                     <h2 className="text-xl font-bold text-slate-900 dark:text-white">Event Details</h2>
                     <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-mono">ID: {selectedEvent.id}</p>
                  </div>
                  <button
                     onClick={() => setSelectedEvent(null)}
                     className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                  >
                     <span className="material-symbols-outlined">close</span>
                  </button>
               </div>

               {/* Scrollable Body */}
               <div className="flex-1 overflow-y-auto p-6 space-y-8">

                  {/* Action Summary */}
                  <div>
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Action Summary</h4>
                     <div className="p-4 bg-slate-50 dark:bg-background-dark rounded-xl border border-slate-200 dark:border-border-dark">
                        <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed font-medium">
                           {selectedEvent.details}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getActionBadge(selectedEvent.action)}`}>
                              {selectedEvent.action}
                           </span>
                           <span className="text-xs text-slate-500">• {new Date(selectedEvent.timestamp).toLocaleString()}</span>
                        </div>
                     </div>
                  </div>

                  {/* Changes */}
                  {selectedEvent.changes && (
                     <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Changes (Old vs New)</h4>
                        <div className="border border-slate-200 dark:border-border-dark rounded-lg overflow-hidden">
                           <div className="grid grid-cols-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-border-dark py-2 px-4 text-xs font-bold text-slate-500">
                              <div>Before</div>
                              <div>After</div>
                           </div>
                           {selectedEvent.changes.map((change, idx) => (
                              <div key={idx} className="p-4 border-b border-slate-100 dark:border-border-dark last:border-0">
                                 <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">{change.field}</div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="p-2 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 text-sm font-medium rounded line-through decoration-red-300">
                                       {change.oldValue}
                                    </div>
                                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 text-sm font-medium rounded">
                                       {change.newValue}
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* Metadata */}
                  <div>
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Technical Metadata</h4>
                     <div className="space-y-2">
                        {Object.entries(selectedEvent.metadata).map(([key, value]) => (
                           <div key={key} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                              <span className="text-sm text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className="text-sm font-mono text-slate-700 dark:text-slate-300">{value}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Footer Action */}
               <div className="p-6 border-t border-slate-200 dark:border-border-dark bg-slate-50/50 dark:bg-background-dark/50">
                  <button className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all">
                     Download Audit Certificate
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

import React, { useState, useEffect } from "react";
import { LogType, WorkLog } from "../types";
import { api } from "../services/api";

export const TimeTracker: React.FC = () => {
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [projectId, setProjectId] = useState("");
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [logType, setLogType] = useState<LogType>(LogType.Evolutivo);

  useEffect(() => {
    Promise.all([api.getLogs(), api.getProjects()])
        .then(([logsData, projectsData]) => {
            setLogs(logsData);
            setProjects(projectsData);
            setLoading(false);
        });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !hours || !description) return;

    const newLog = {
      projectId,
      userId: "u1", // Hardcoded user for demo
      date: new Date().toISOString().split('T')[0],
      hours: parseFloat(hours),
      description,
      type: logType
    };

    try {
        await api.createLog(newLog);
        // Refresh logs
        const updatedLogs = await api.getLogs();
        setLogs(updatedLogs);
        
        // Reset
        setHours("");
        setDescription("");
    } catch (err) {
        console.error("Error creating log", err);
    }
  };

  const getProjectName = (id: string) => projects.find(p => p.id === id)?.name || "Unknown Project";

  // Calculate daily totals
  const todayTotal = logs
    .filter(l => l.date === new Date().toISOString().split('T')[0])
    .reduce((acc, curr) => acc + curr.hours, 0);

  if(loading) return <div className="p-8">Loading logs...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Activity Logging</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track your daily efforts and project contributions.</p>
        </div>
        <div className="flex gap-4 items-center bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-slate-200 dark:border-border-dark">
            <div className="text-center px-4 border-r border-slate-200 dark:border-border-dark">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Today</p>
                <p className="text-xl font-bold text-primary">{todayTotal}h</p>
            </div>
            <div className="text-center px-4">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Target</p>
                <p className="text-xl font-bold text-slate-700 dark:text-slate-200">8.0h</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Log Form */}
        <div className="lg:col-span-7">
           <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
                 <span className="material-symbols-outlined text-primary">add_circle</span>
                 Log New Effort
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-600 dark:text-slate-300">Project</label>
                       <select 
                         value={projectId} 
                         onChange={(e) => setProjectId(e.target.value)}
                         className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
                       >
                         <option value="">Select a project</option>
                         {projects.map(p => (
                           <option key={p.id} value={p.id}>{p.name}</option>
                         ))}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-600 dark:text-slate-300">Duration (Hours)</label>
                       <div className="relative">
                         <input 
                           type="number" 
                           step="0.5"
                           value={hours}
                           onChange={(e) => setHours(e.target.value)}
                           className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
                           placeholder="0.0"
                         />
                         <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">HRS</span>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 dark:text-slate-300">Category</label>
                    <div className="grid grid-cols-3 gap-3">
                       {[LogType.Evolutivo, LogType.Corretivo, LogType.Operacional].map((type) => (
                         <button 
                           key={type}
                           type="button"
                           onClick={() => setLogType(type)}
                           className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                             logType === type 
                               ? "border-primary bg-primary/5 text-primary" 
                               : "border-transparent bg-slate-50 dark:bg-background-dark text-slate-500 hover:bg-slate-100"
                           }`}
                         >
                            <span className="text-xs font-bold">{type}</span>
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 dark:text-slate-300">Description</label>
                    <textarea 
                       value={description}
                       onChange={(e) => setDescription(e.target.value)}
                       className="w-full h-32 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none transition-shadow"
                       placeholder="Detail your contribution..."
                    ></textarea>
                 </div>

                 <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">send</span> Log Effort
                 </button>
              </form>
           </div>
        </div>

        {/* Recent Logs List */}
        <div className="lg:col-span-5 flex flex-col h-full">
           <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm flex flex-col flex-1 overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-border-dark flex justify-between items-center">
                 <h3 className="text-lg font-bold">Recent Entries</h3>
                 <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full text-slate-500 dark:text-slate-300 font-bold">Today</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                 {logs.map((log) => (
                   <div key={log.id} className="p-4 rounded-lg bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark hover:border-primary/30 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                         <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded
                           ${log.type === LogType.Corretivo ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 
                             log.type === LogType.Evolutivo ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 
                             'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}
                         `}>
                            {log.type}
                         </span>
                         <span className="text-xs font-bold text-slate-500">{log.hours.toFixed(1)}h</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors line-clamp-1">{log.description}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{getProjectName(log.projectId)}</p>
                   </div>
                 ))}
                 {logs.length === 0 && (
                   <div className="text-center py-10 text-slate-400">
                     <span className="material-symbols-outlined text-4xl mb-2">history</span>
                     <p className="text-sm">No logs yet.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

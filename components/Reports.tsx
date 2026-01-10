import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { api } from "../services/api";

const COLORS = ["#135bec", "#10b981", "#f59e0b", "#6366f1", "#ec4899"];

export const Reports: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getLogs(), api.getProjects()])
        .then(([logsData, projectsData]) => {
            setLogs(logsData);
            setProjects(projectsData);
            setLoading(false);
        });
  }, []);

  if(loading) return <div className="p-8">Loading reports...</div>;

  // Aggregate hours by project
  const projectDistribution = projects.map(project => {
    const hours = logs
      .filter(l => l.projectId === project.id)
      .reduce((acc, curr) => acc + curr.hours, 0);
    return { name: project.name, value: hours };
  }).filter(p => p.value > 0);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight">Project Analytics</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Breakdown of hours and resource allocation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm p-6">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold">Hours by Project</h3>
             <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button>
           </div>
           <div className="h-80 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={projectDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {projectDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                 <span className="text-3xl font-black text-slate-800 dark:text-white">
                   {projectDistribution.reduce((acc, curr) => acc + curr.value, 0)}h
                 </span>
                 <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Total</span>
              </div>
           </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm p-6 flex flex-col">
           <h3 className="text-lg font-bold mb-6">Details</h3>
           <div className="flex-1 overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-border-dark text-slate-500 font-bold text-xs uppercase">
                     <th className="px-4 py-3">Project</th>
                     <th className="px-4 py-3">Hours</th>
                     <th className="px-4 py-3">% of Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-border-dark">
                   {projectDistribution.map((entry, index) => {
                      const total = projectDistribution.reduce((acc, curr) => acc + curr.value, 0);
                      const percent = ((entry.value / total) * 100).toFixed(1);
                      return (
                        <tr key={index}>
                           <td className="px-4 py-3">
                             <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                                <span className="font-medium text-slate-700 dark:text-slate-200">{entry.name}</span>
                             </div>
                           </td>
                           <td className="px-4 py-3 font-bold">{entry.value}h</td>
                           <td className="px-4 py-3 text-slate-500">{percent}%</td>
                        </tr>
                      );
                   })}
                </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

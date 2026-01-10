import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { api } from "../services/api";

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [contracts, setContracts] = useState<any[]>([]);

  useEffect(() => {
     // Fetch Stats
     api.getDashboardStats().then(setData);
     api.getContracts().then(setContracts);
  }, []);

  if (!data || contracts.length === 0) return <div className="p-8">Loading dashboard...</div>;

  const totalHours = contracts.reduce((acc, c) => acc + parseFloat(c.totalHours), 0);
  const totalUsed = contracts.reduce((acc, c) => acc + parseFloat(c.usedHours), 0);
  const burnRate = totalHours > 0 ? Math.round((totalUsed / totalHours) * 100) : 0;
  
  const { monthlyData, contractHealth } = data;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Executive Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time performance and contract health.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            <span>This Month</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-lg">download</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="p-6 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-primary">
              <span className="material-symbols-outlined">description</span>
            </div>
            <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span> +12%
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Active Contracts</p>
          <h3 className="text-3xl font-extrabold mt-1">{contracts.length}</h3>
          <p className="text-xs text-slate-400 mt-2">v.s. {Math.max(0, contracts.length - 1)} last month</p>
        </div>

        {/* Card 2 - Radial like representation but simple text for speed */}
        <div className="p-6 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg text-amber-500">
               <span className="material-symbols-outlined">timelapse</span>
             </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Global Burn Rate</p>
          <div className="flex items-baseline gap-2 mt-1">
             <h3 className="text-3xl font-extrabold">{burnRate}%</h3>
             <span className="text-xs text-slate-400 font-medium">of total budget</span>
          </div>
           <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mt-4 overflow-hidden">
               <div className="bg-amber-500 h-full rounded-full" style={{ width: `${burnRate}%` }}></div>
           </div>
        </div>

        {/* Card 3 */}
        <div className="p-6 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg text-purple-500">
               <span className="material-symbols-outlined">payments</span>
             </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Billable Value (Est.)</p>
          <h3 className="text-3xl font-extrabold mt-1">${(totalUsed * 150).toLocaleString()}</h3>
          <p className="text-xs text-slate-400 mt-2">Based on avg. rate $150/hr</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm p-6">
            <h3 className="text-lg font-bold mb-6">Monthly Evolution</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorConsumed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#135bec" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#135bec" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="consumed" stroke="#135bec" strokeWidth={3} fillOpacity={1} fill="url(#colorConsumed)" />
                  <Area type="monotone" dataKey="budget" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
        </div>

        {/* Side Stats */}
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm p-6">
           <h3 className="text-lg font-bold mb-6">Budget Consumption</h3>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart layout="vertical" data={contractHealth}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={80} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Bar dataKey="value" barSize={12} radius={[0, 4, 4, 0]}>
                      {contractHealth.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-4 space-y-3">
              {contractHealth.map((d: any) => (
                <div key={d.name} className="flex justify-between items-center text-sm">
                   <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full" style={{backgroundColor: d.color}}></div>
                      <span className="text-slate-600 dark:text-slate-300 font-medium">{d.name}</span>
                   </div>
                   <span className="font-bold text-slate-900 dark:text-white">{d.value}%</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

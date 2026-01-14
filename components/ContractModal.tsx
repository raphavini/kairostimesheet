import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { Client, ContractStatus } from "../types";

interface ContractModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const ContractModal: React.FC<ContractModalProps> = ({ onClose, onSuccess }) => {
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        client_name: "",
        name: "",
        total_hours: "",
        hourly_rate: "",
        start_date: "",
        end_date: "",
        status: ContractStatus.Active
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.createContract({
                ...formData,
                total_hours: parseFloat(formData.total_hours),
                hourly_rate: parseFloat(formData.hourly_rate)
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Failed to create contract", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-surface-dark w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-border-dark overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-border-dark flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Create New Contract</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-slate-500">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Client</label>
                            <input
                                type="text"
                                name="client_name"
                                required
                                placeholder="Client name"
                                value={formData.client_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-slate-100"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Contract Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="e.g. Monthly Retainer 2024"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-slate-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Total Hours</label>
                            <input
                                type="number"
                                name="total_hours"
                                required
                                placeholder="40"
                                value={formData.total_hours}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-slate-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Hourly Rate ($)</label>
                            <input
                                type="number"
                                name="hourly_rate"
                                required
                                placeholder="150"
                                value={formData.hourly_rate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-slate-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                required
                                value={formData.start_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-slate-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                required
                                value={formData.end_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-slate-100"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-400 font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-[2] px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors shadow-lg shadow-primary/20"
                        >
                            {submitting ? "Creating..." : "Create Contract"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


import React, { useState } from 'react';
import type { LiveOpportunityItem } from '../types';
import useEscapeKey from '../hooks/useEscapeKey';
import { CloseIcon, PlusCircleIcon } from './Icons';
import { COUNTRIES, INDUSTRIES } from '../constants';

interface AddOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<LiveOpportunityItem, 'isUserAdded' | 'ai_feasibility_score' | 'ai_risk_assessment'>) => void;
}

export const AddOpportunityModal: React.FC<AddOpportunityModalProps> = ({ isOpen, onClose, onSave }) => {
    useEscapeKey(onClose);

    const [projectName, setProjectName] = useState('');
    const [country, setCountry] = useState(COUNTRIES[0]);
    const [sector, setSector] = useState(INDUSTRIES[0].id);
    const [value, setValue] = useState('');
    const [summary, setSummary] = useState('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!projectName.trim() || !summary.trim()) {
            setError('Project Name and Summary are required.');
            return;
        }
        onSave({
            project_name: projectName,
            country: country,
            sector: sector,
            value: value,
            summary: summary,
            source_url: sourceUrl,
        });
        // Clear form for next time
        setProjectName('');
        setCountry(COUNTRIES[0]);
        setSector(INDUSTRIES[0].id);
        setValue('');
        setSummary('');
        setSourceUrl('');
    };
    
    if (!isOpen) return null;

    const inputStyles = "w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 text-gray-800 shadow-sm text-sm";
    const labelStyles = "block text-sm font-semibold text-gray-800 mb-2";

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog">
            <div 
                className="bg-white border border-gray-200 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-5 flex justify-between items-center border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <PlusCircleIcon className="w-8 h-8 text-gray-800" />
                        <div>
                        <h2 className="text-xl font-bold text-gray-900">List a New Project or Opportunity</h2>
                        <p className="text-sm text-gray-600">Add an initiative to your private watchlist.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"><CloseIcon className="w-6 h-6"/></button>
                </header>

                <form onSubmit={handleSubmit}>
                    <main className="p-6 space-y-5 max-h-[70vh] overflow-y-auto bg-gray-50/50">
                        <div>
                            <label htmlFor="projectName" className={labelStyles}>Project Name *</label>
                            <input type="text" id="projectName" value={projectName} onChange={e => setProjectName(e.target.value)} className={inputStyles} placeholder="e.g., National Fiber Optic Backbone Expansion" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="country" className={labelStyles}>Country *</label>
                                <select id="country" value={country} onChange={e => setCountry(e.target.value)} className={inputStyles} required>
                                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="sector" className={labelStyles}>Sector *</label>
                                <select id="sector" value={sector} onChange={e => setSector(e.target.value)} className={inputStyles} required>
                                    {INDUSTRIES.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                </select>
                            </div>
                        </div>
                         <div>
                            <label htmlFor="value" className={labelStyles}>Project Value (Optional)</label>
                            <input type="text" id="value" value={value} onChange={e => setValue(e.target.value)} className={inputStyles} placeholder="e.g., $250 Million" />
                        </div>
                        <div>
                            <label htmlFor="summary" className={labelStyles}>Summary / Project Notes *</label>
                            <textarea id="summary" value={summary} onChange={e => setSummary(e.target.value)} rows={4} className={`${inputStyles} resize-vertical`} placeholder="Provide a brief overview of the project, its goals, and current status." required />
                        </div>
                         <div>
                            <label htmlFor="sourceUrl" className={labelStyles}>Source URL (Optional)</label>
                            <input type="url" id="sourceUrl" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} className={inputStyles} placeholder="https://example.gov/project-details" />
                        </div>
                        {error && <p className="text-red-600 text-sm text-center bg-red-100 p-3 rounded-lg border border-red-200">{error}</p>}
                    </main>

                    <footer className="p-4 bg-gray-50 border-t border-gray-200 flex-shrink-0 flex justify-end items-center gap-4">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2.5 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition-colors shadow-sm">
                            Save Project
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

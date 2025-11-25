
import React from 'react';
import { ReportParameters } from '../types';

interface SavedWorkManagerProps {
    currentParams: ReportParameters;
    savedReports: ReportParameters[];
    onSave: (params: ReportParameters) => void;
    onLoad: (params: ReportParameters) => void;
    onDelete: (reportName: string) => void;
}

export const SavedWorkManager: React.FC<SavedWorkManagerProps> = ({ currentParams, savedReports, onSave, onLoad, onDelete }) => {
    const handleSave = () => {
        onSave(currentParams);
    };

    return (
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="text-sm font-bold text-gray-900 mb-3">Saved Work Manager</h4>
            <div className="flex gap-2">
                <button onClick={handleSave} className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800">
                    Save Current Progress
                </button>
            </div>
            
            {savedReports.length > 0 && (
                <div className="mt-4">
                    <h5 className="text-xs font-bold text-gray-500 uppercase mb-2">Saved Drafts</h5>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {savedReports.map((report, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-100">
                                <span className="text-xs font-medium text-gray-700 truncate w-32">{report.reportName || 'Untitled'}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => onLoad(report)} className="text-xs text-blue-600 hover:underline">Load</button>
                                    <button onClick={() => onDelete(report.reportName)} className="text-xs text-red-500 hover:underline">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

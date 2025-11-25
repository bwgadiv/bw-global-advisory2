
import React from 'react';
import { ReportParameters } from '../types';
import { FileText, Zap, GlobeIcon, ActivityIcon, PlusCircleIcon, LayoutDashboardIcon, ReportIcon } from './Icons';

interface CommandCenterProps {
    savedReports: ReportParameters[];
    onCreateNew: () => void;
    onLoadReport: (report: ReportParameters) => void;
    onOpenInstant: () => void;
    onOpenSimulator: () => void;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ 
    savedReports, 
    onCreateNew, 
    onLoadReport,
    onOpenInstant,
    onOpenSimulator 
}) => {
    return (
        <div className="min-h-full bg-slate-50 text-gray-900 p-6 md:p-10 overflow-y-auto">
            {/* Header */}
            <header className="mb-8 border-b border-gray-200 pb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <LayoutDashboardIcon className="w-6 h-6 text-slate-700" />
                            Intelligence Repository
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            Archive of generated strategic reports and intelligence snapshots.
                        </p>
                    </div>
                    <button 
                        onClick={onCreateNew}
                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors text-sm font-medium"
                    >
                        <PlusCircleIcon className="w-4 h-4" />
                        New Analysis
                    </button>
                </div>
            </header>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <button 
                    onClick={onCreateNew}
                    className="flex flex-col items-start p-5 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-slate-300 transition-all text-left group"
                >
                    <div className="bg-slate-100 p-2 rounded-md mb-3 group-hover:bg-slate-200 transition-colors">
                        <FileText className="w-5 h-5 text-slate-700" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Deep Strategic Analysis</h3>
                    <p className="text-xs text-gray-500 mt-1">Start a new multi-agent problem solving mission.</p>
                </button>

                <button 
                    onClick={onOpenInstant}
                    className="flex flex-col items-start p-5 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-slate-300 transition-all text-left group"
                >
                    <div className="bg-slate-100 p-2 rounded-md mb-3 group-hover:bg-slate-200 transition-colors">
                        <Zap className="w-5 h-5 text-slate-700" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Live Intelligence</h3>
                    <p className="text-xs text-gray-500 mt-1">Generate rapid market snapshots from real-time data.</p>
                </button>

                <div className="flex flex-col justify-center p-5 bg-slate-100 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <ActivityIcon className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-semibold text-slate-700">System Status</span>
                    </div>
                    <p className="text-xs text-slate-500">Analysis engines ready.</p>
                </div>
            </div>

            {/* Reports List */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 text-sm">Stored Intelligence</h3>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 border border-gray-200 rounded-md">
                        {savedReports.length} Documents
                    </span>
                </div>
                
                {savedReports.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FileText className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-gray-500 text-sm mb-4">No intelligence reports archived yet.</p>
                        <button onClick={onCreateNew} className="text-slate-900 hover:underline text-xs font-medium">
                            Launch your first analysis
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {savedReports.map((report, idx) => (
                            <div 
                                key={idx} 
                                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between"
                                onClick={() => onLoadReport(report)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 text-sm">
                                            {report.reportName || 'Untitled Analysis'}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-gray-500">
                                                {report.region}
                                            </span>
                                            <span className="text-gray-300 text-xs">•</span>
                                            <span className="text-xs text-gray-500">
                                                {report.industry[0] || 'General'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-4">
                                    <span className="text-xs text-gray-400">
                                        {new Date(report.createdAt || Date.now()).toLocaleDateString()}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-[10px] font-medium border ${
                                        report.status === 'complete' 
                                        ? 'bg-green-50 text-green-700 border-green-100' 
                                        : 'bg-slate-100 text-slate-600 border-slate-200'
                                    }`}>
                                        {report.status === 'complete' ? 'Ready' : 'Draft'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommandCenter;

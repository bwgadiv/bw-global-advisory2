
import React from 'react';
import type { RROI_Index } from '../types';

export const RROIResultDisplay: React.FC<{ rroi: RROI_Index }> = ({ rroi }) => {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-blue-600';
        return 'text-orange-600';
    };

    const getBarColor = (score: number) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-blue-500';
        return 'bg-orange-500';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-blue-500 to-green-500"></div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Regional Readiness Score</p>
                <div className={`text-6xl font-extrabold tracking-tighter ${getScoreColor(rroi.overallScore)}`}>
                    {rroi.overallScore}
                </div>
                <p className="text-gray-600 mt-4 text-sm max-w-md leading-relaxed">
                    {rroi.summary}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(rroi.components).map((component, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-gray-800 text-sm">{component.name}</h4>
                            <span className={`font-bold text-sm ${getScoreColor(component.score)}`}>
                                {component.score}/100
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3 overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-1000 ease-out ${getBarColor(component.score)}`} 
                                style={{ width: `${component.score}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            {component.analysis}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

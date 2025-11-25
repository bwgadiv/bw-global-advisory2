
import React, { useState, useEffect } from 'react';
import type { ReportParameters, RROI_Index } from '../types';
import { generateRROI } from '../services/nexusService';
import { RROIResultDisplay } from './RROIResultDisplay';
import { TrendingUp, ActivityIcon } from './Icons';

interface RROIDiagnosticStepProps {
    params: ReportParameters;
    onAnalysisComplete?: (rroi: RROI_Index) => void;
}

const RROIDiagnosticStep: React.FC<RROIDiagnosticStepProps> = ({ params, onAnalysisComplete }) => {
    const [loading, setLoading] = useState(false);
    const [rroiData, setRroiData] = useState<RROI_Index | null>(null);

    const runDiagnostic = async () => {
        setLoading(true);
        try {
            const result = await generateRROI(params);
            setRroiData(result);
            if (onAnalysisComplete) onAnalysisComplete(result);
        } catch (error) {
            console.error("RROI Generation failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!rroiData && params.region && params.industry.length > 0 && !loading) {
            runDiagnostic();
        }
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Regional Readiness & Opportunity Index (RROI)
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        AI-driven diagnostic evaluating {params.region || 'Target Region'} for {params.industry[0] || 'Target Sector'} suitability.
                    </p>
                </div>
                <button 
                    onClick={runDiagnostic}
                    disabled={loading}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                    {loading ? <ActivityIcon className="w-4 h-4 animate-spin"/> : <ActivityIcon className="w-4 h-4"/>}
                    {loading ? 'Calibrating...' : 'Re-Run Diagnostic'}
                </button>
            </div>

            {loading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin"></div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium animate-pulse">Calculating Regional Metrics...</p>
                </div>
            ) : rroiData ? (
                <RROIResultDisplay rroi={rroiData} />
            ) : (
                <div className="bg-gray-50 p-8 rounded-xl border border-dashed border-gray-300 text-center">
                    <p className="text-gray-500">Diagnostic ready to launch.</p>
                </div>
            )}
        </div>
    );
};

export default RROIDiagnosticStep;

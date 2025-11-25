
import React, { useState, useEffect } from 'react';
import type { ReportParameters, GeopoliticalAnalysisResult } from '../types';
import { runGeopoliticalAnalysis } from '../services/nexusService';
import { GlobeIcon, ActivityIcon } from './Icons';

interface GeopoliticalAnalysisStepProps {
    params: ReportParameters;
}

const GeopoliticalAnalysisStep: React.FC<GeopoliticalAnalysisStepProps> = ({ params }) => {
    const [analysis, setAnalysis] = useState<GeopoliticalAnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const run = async () => {
            if (!params.region) return;
            setLoading(true);
            try {
                const result = await runGeopoliticalAnalysis(params);
                setAnalysis(result);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        run();
    }, [params.region]);

    if (!params.region) return <div className="p-8 text-center text-gray-500">Please select a target region to activate Geopolitical Intelligence.</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <GlobeIcon className="w-5 h-5 text-indigo-600" />
                    Geopolitical & Economic Forecast
                </h3>
                {loading && <span className="text-xs text-indigo-600 font-bold animate-pulse">Analyzing Regional Stability...</span>}
            </div>

            {analysis ? (
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h4 className="text-sm font-bold text-gray-500 uppercase mb-4">Stability & Risk Index</h4>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-4 border-gray-100">
                                <span className={`text-2xl font-bold ${analysis.stabilityScore > 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {analysis.stabilityScore}
                                </span>
                                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 opacity-50" style={{ transform: `rotate(${analysis.stabilityScore * 3.6}deg)` }}></div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                                    Political Stability
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${analysis.currencyRisk === 'High' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                    Currency Risk: {analysis.currencyRisk}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${analysis.inflationTrend === 'Rising' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                                    Inflation: {analysis.inflationTrend}
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded border border-gray-100 text-xs text-gray-600 italic">
                            "{analysis.forecast}"
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h4 className="text-sm font-bold text-gray-500 uppercase mb-4">Trade & Conflict Metrics</h4>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Regional Conflict Probability</span>
                                    <span className="font-bold">{analysis.regionalConflictRisk}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-red-500 h-2 rounded-full transition-all" style={{ width: `${analysis.regionalConflictRisk}%` }}></div>
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                <h5 className="text-xs font-bold text-gray-900 mb-2">Identified Trade Barriers</h5>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.tradeBarriers.length > 0 ? analysis.tradeBarriers.map((tb, i) => (
                                        <span key={i} className="px-2 py-1 bg-red-50 text-red-700 border border-red-100 rounded text-xs font-medium">
                                            {tb}
                                        </span>
                                    )) : <span className="text-xs text-gray-400">No critical barriers identified.</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-12 flex justify-center">
                    <ActivityIcon className="w-8 h-8 text-gray-300 animate-spin" />
                </div>
            )}
        </div>
    );
};

export default GeopoliticalAnalysisStep;

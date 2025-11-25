
import React, { useState, useEffect } from 'react';
import type { ReportParameters, SEAM_Blueprint } from '../types';
import { generateSEAM } from '../services/nexusService';
import { SEAMResultDisplay } from './SEAMResultDisplay';
import { Users, ActivityIcon } from './Icons';

interface SEAMEcosystemStepProps {
    params: ReportParameters;
}

const SEAMEcosystemStep: React.FC<SEAMEcosystemStepProps> = ({ params }) => {
    const [loading, setLoading] = useState(false);
    const [seamData, setSeamData] = useState<SEAM_Blueprint | null>(null);

    const runAnalysis = async () => {
        setLoading(true);
        try {
            const result = await generateSEAM(params);
            setSeamData(result);
        } catch (error) {
            console.error("SEAM Generation failed", error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-run if contextual data is present and not yet run
    useEffect(() => {
        if (!seamData && params.region && params.industry.length > 0 && !loading) {
            runAnalysis();
        }
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-orange-600" />
                        Strategic Ecosystem Alignment Map (SEAM)
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Mapping high-impact partners and ecosystem entities for {params.industry[0] || 'your sector'} in {params.region}.
                    </p>
                </div>
                <button 
                    onClick={runAnalysis}
                    disabled={loading}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                    {loading ? <ActivityIcon className="w-4 h-4 animate-spin"/> : <ActivityIcon className="w-4 h-4"/>}
                    {loading ? 'Mapping...' : 'Refresh Map'}
                </button>
            </div>

            {loading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin"></div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium animate-pulse">Identifying strategic partners...</p>
                </div>
            ) : seamData ? (
                <SEAMResultDisplay seam={seamData} />
            ) : (
                <div className="bg-gray-50 p-8 rounded-xl border border-dashed border-gray-300 text-center">
                    <p className="text-gray-500">System ready. Analysis will start automatically.</p>
                </div>
            )}
        </div>
    );
};

export default SEAMEcosystemStep;

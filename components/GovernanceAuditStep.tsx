
import React, { useState, useEffect } from 'react';
import type { ReportParameters, GovernanceAuditResult } from '../types';
import { runGovernanceAudit } from '../services/nexusService';
import { ShieldCheckIcon, ManualIcon } from './Icons';

interface GovernanceAuditStepProps {
    params: ReportParameters;
}

const GovernanceAuditStep: React.FC<GovernanceAuditStepProps> = ({ params }) => {
    const [audit, setAudit] = useState<GovernanceAuditResult | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const run = async () => {
            if (!params.region) return;
            setLoading(true);
            try {
                const result = await runGovernanceAudit(params);
                setAudit(result);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        run();
    }, [params.region, params.organizationType]);

    if (!params.region) return <div className="p-8 text-center text-gray-500">Awaiting jurisdiction selection...</div>;

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'Critical': return 'text-red-600';
            case 'High': return 'text-orange-600';
            case 'Medium': return 'text-yellow-600';
            default: return 'text-green-600';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                    Governance & Compliance Audit
                </h3>
                {loading && <span className="text-xs text-blue-600 font-bold animate-pulse">Running Integrity Check...</span>}
            </div>

            {audit ? (
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-6">
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h4 className="text-sm font-bold text-blue-800 uppercase mb-2">Governance Health Score</h4>
                            <div className="text-5xl font-extrabold text-blue-700 mb-2">{audit.governanceScore}</div>
                            <p className="text-xs text-blue-600">
                                Composite index of regulatory transparency, rule of law, and administrative efficiency in {params.region}.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <ManualIcon className="w-4 h-4" /> Risk Indicators
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                                    <span className="text-gray-600">Corruption Risk</span>
                                    <span className={`font-bold ${getRiskColor(audit.corruptionRisk)}`}>{audit.corruptionRisk}</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                                    <span className="text-gray-600">Regulatory Friction</span>
                                    <span className="font-bold text-gray-900">{audit.regulatoryFriction}/100</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Transparency Index</span>
                                    <span className="font-bold text-gray-900">{audit.transparencyIndex}/100</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-red-50 p-5 rounded-xl border border-red-100">
                            <h4 className="text-sm font-bold text-red-800 uppercase mb-3">🚩 Operational Red Flags</h4>
                            <ul className="space-y-2">
                                {audit.redFlags.map((flag, i) => (
                                    <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                                        <span className="mt-1 text-red-500">•</span> {flag}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                            <h4 className="text-sm font-bold text-green-800 uppercase mb-3">📋 Compliance Roadmap</h4>
                            <ul className="space-y-2">
                                {audit.complianceRoadmap.map((step, i) => (
                                    <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                                        <span className="mt-1 font-bold text-green-500">{i + 1}.</span> {step}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-12 flex justify-center">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
};

export default GovernanceAuditStep;

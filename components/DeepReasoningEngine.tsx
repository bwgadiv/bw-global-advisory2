
import React, { useState, useEffect } from 'react';
import { generateDeepReasoning } from '../services/nexusService';
import { BrainCircuit, ShieldCheck, ScaleIcon, MicroscopeIcon } from './Icons';
import type { DeepReasoningAnalysis } from '../types';

interface DeepReasoningEngineProps {
    userOrg: string;
    targetEntity: string;
    context: string;
}

export const DeepReasoningEngine: React.FC<DeepReasoningEngineProps> = ({ userOrg, targetEntity, context }) => {
    const [analysis, setAnalysis] = useState<DeepReasoningAnalysis | null>(null);
    const [thinking, setThinking] = useState(false);

    const runAnalysis = async () => {
        setThinking(true);
        try {
            const result = await generateDeepReasoning(userOrg, targetEntity, context);
            setAnalysis(result);
        } catch (e) {
            console.error(e);
        } finally {
            setThinking(false);
        }
    };

    useEffect(() => {
        if (userOrg && targetEntity) {
            runAnalysis();
        }
    }, [userOrg, targetEntity]);

    if (thinking) {
        return (
            <div className="p-8 bg-white rounded-xl border border-gray-200 shadow-sm text-center animate-pulse">
                <BrainCircuit className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700">Engaging Critical Logic...</h3>
                <p className="text-sm text-slate-500">Simulating adversarial negotiation scenarios.</p>
            </div>
        );
    }

    if (!analysis) return null;

    const getVerdictColor = (v: string) => {
        if (v === 'Strong Buy') return 'bg-green-100 text-green-800 border-green-200';
        if (v === 'Hard Pass') return 'bg-red-100 text-red-800 border-red-200';
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    };

    return (
        <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <MicroscopeIcon className="w-6 h-6 text-slate-700" />
                    Critical Reasoning Engine
                </h3>
                <span className={`px-4 py-2 rounded-full font-bold text-sm border ${getVerdictColor(analysis.verdict)}`}>
                    {analysis.verdict}
                </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                        <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" /> Deal Killers (The "Why Not")
                        </h4>
                        <ul className="space-y-2">
                            {analysis.dealKillers.map((dk, i) => (
                                <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                                    <span className="mt-1">•</span> {dk}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                            <ScaleIcon className="w-4 h-4" /> Hidden Gems (The "Why")
                        </h4>
                        <ul className="space-y-2">
                            {analysis.hiddenGems.map((hg, i) => (
                                <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                                    <span className="mt-1">•</span> {hg}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-2 text-xs uppercase tracking-wider">Reasoning Chain</h4>
                        <div className="space-y-3">
                            {analysis.reasoningChain.map((step, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center font-bold border border-slate-300">
                                            {i + 1}
                                        </div>
                                        {i < analysis.reasoningChain.length - 1 && <div className="w-px h-full bg-slate-200 my-1"></div>}
                                    </div>
                                    <p className="text-sm text-slate-600 pb-2">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <h4 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4" /> Counter-Intuitive Insight
                        </h4>
                        <p className="text-sm text-indigo-700 italic">"{analysis.counterIntuitiveInsight}"</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

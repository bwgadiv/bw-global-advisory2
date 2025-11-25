
import React, { useState, useEffect } from 'react';
import type { ReportParameters, SymbioticPartner } from '../types';
import { generateSymbioticMatches } from '../services/nexusService';
import { MatchMakerIcon, GlobeIcon, Target, BrainCircuit } from './Icons';
import Spinner from './Spinner';

interface SymbioticMatchmakingProps {
    params: ReportParameters;
    onPartnerSelect?: (partner: SymbioticPartner) => void;
}

export const SymbioticMatchmaking: React.FC<SymbioticMatchmakingProps> = ({ params, onPartnerSelect }) => {
    const [matches, setMatches] = useState<SymbioticPartner[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<SymbioticPartner | null>(null);

    useEffect(() => {
        const findMatches = async () => {
            if (!params.industry.length) return;
            setLoading(true);
            try {
                const results = await generateSymbioticMatches(params);
                setMatches(results);
            } catch (e) {
                console.error("Matching failed", e);
            } finally {
                setLoading(false);
            }
        };
        findMatches();
    }, [params.industry, params.region]);

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <MatchMakerIcon className="w-6 h-6 text-purple-600" />
                            Global Symbiotic Discovery
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Finding "Unseen" partners with high asymmetry leverage (High Value / Low Cost).
                        </p>
                    </div>
                    {loading && (
                        <div className="flex items-center gap-2 text-sm text-purple-600 font-bold animate-pulse">
                            <Spinner className="w-4 h-4" />
                            Scanning Ecosystems...
                        </div>
                    )}
                </div>

                {!loading && matches.length === 0 ? (
                    <div className="p-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <GlobeIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Define your industry and region to start discovery.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {matches.map((match, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => setSelectedMatch(match)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedMatch === match ? 'bg-purple-50 border-purple-500 shadow-md' : 'bg-white border-gray-200 hover:border-purple-300'}`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="font-bold text-gray-900">{match.entityName}</div>
                                        <div className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                                            {match.symbiosisScore}% Match
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                        <Target className="w-3 h-3" /> {match.location} • {match.entityType}
                                    </div>
                                    <p className="text-xs text-gray-600 line-clamp-2 italic">"{match.asymmetryAnalysis}"</p>
                                </div>
                            ))}
                        </div>

                        {selectedMatch ? (
                            <div className="bg-gray-900 text-white p-6 rounded-xl shadow-xl">
                                <div className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-4">
                                    <BrainCircuit className="w-6 h-6 text-purple-400" />
                                    <h4 className="font-bold text-lg">Deep Synergy Analysis</h4>
                                </div>
                                
                                <div className="space-y-5">
                                    <div>
                                        <div className="text-xs text-gray-400 uppercase font-bold mb-1">The Asymmetry (Why it works)</div>
                                        <p className="text-sm text-gray-200 leading-relaxed">{selectedMatch.asymmetryAnalysis}</p>
                                    </div>
                                    
                                    <div>
                                        <div className="text-xs text-gray-400 uppercase font-bold mb-1">Mutual Benefit Loop</div>
                                        <p className="text-sm text-gray-200 leading-relaxed">{selectedMatch.mutualBenefit}</p>
                                    </div>

                                    <div>
                                        <div className="text-xs text-gray-400 uppercase font-bold mb-2">Calculated Risks</div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedMatch.riskFactors.map((risk, i) => (
                                                <span key={i} className="px-2 py-1 bg-red-900/50 border border-red-700 rounded text-xs text-red-200">
                                                    {risk}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {onPartnerSelect && (
                                        <button 
                                            onClick={() => onPartnerSelect(selectedMatch)}
                                            className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold text-sm transition-colors mt-4 shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            Select Target for Deep Reasoning
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200 text-gray-400 text-sm">
                                Select a match to view Deep Analysis
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

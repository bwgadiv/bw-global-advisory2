
import React, { useState } from 'react';

interface MatchmakingEngineProps {
    params: any;
    onMatchesFound: (matches: any[]) => void;
}

const MatchmakingEngine: React.FC<MatchmakingEngineProps> = ({ params, onMatchesFound }) => {
    const [isSearching, setIsSearching] = useState(false);
    const [matches, setMatches] = useState<any[]>([]);

    const runMatchmaking = async () => {
        setIsSearching(true);
        // Mock matchmaking logic
        setTimeout(() => {
            const mockMatches = [
                {
                    type: 'baseline',
                    title: 'Primary Target Match',
                    location: params.region || 'Target Region',
                    score: 85,
                    incentives: '5-year tax holiday, infrastructure grants',
                    velocity: '18 months'
                },
                {
                    type: 'alternative',
                    title: 'Alternative Location 1',
                    location: 'Vietnam',
                    score: 88,
                    incentives: '10-year tax holiday, workforce training',
                    velocity: '12 months'
                },
                {
                    type: 'synergistic',
                    title: 'Tripartite Partnership',
                    location: 'Regional Hub',
                    partners: ['Local Government', 'University', 'Logistics Company'],
                    score: 92,
                    benefits: 'Integrated talent pipeline, streamlined logistics'
                }
            ];
            setMatches(mockMatches);
            onMatchesFound(mockMatches);
            setIsSearching(false);
        }, 2500);
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">🎯 Multi-Layered Matchmaking Engine</h3>
                <p className="text-sm text-blue-800 mb-4">
                    Find the best opportunities beyond your initial idea. Our AI analyzes global data to identify superior alternatives and synergistic partnerships.
                </p>
                <button
                    onClick={runMatchmaking}
                    disabled={isSearching}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold transition-colors flex items-center gap-2"
                >
                    {isSearching ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Searching Global Index...
                        </>
                    ) : (
                        '🚀 Run Global Matchmaking'
                    )}
                </button>
            </div>

            {matches.length > 0 && (
                <div className="space-y-4 animate-fade-in">
                    <h4 className="text-lg font-semibold text-gray-900">📊 Matchmaking Results</h4>
                    <div className="grid gap-4">
                        {matches.map((match, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h5 className="font-bold text-gray-900 text-lg">{match.title}</h5>
                                        <p className="text-sm text-gray-500">{match.location}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                                        match.type === 'baseline' ? 'bg-green-100 text-green-800' :
                                        match.type === 'alternative' ? 'bg-blue-100 text-blue-800' :
                                        'bg-purple-100 text-purple-800'
                                    }`}>
                                        {match.type}
                                    </span>
                                </div>
                                
                                <div className="grid md:grid-cols-3 gap-4 text-sm bg-gray-50 p-3 rounded-lg mb-3">
                                    <div>
                                        <span className="block font-bold text-gray-500 text-xs uppercase">Success Score</span>
                                        <span className="text-green-600 font-bold text-lg">{match.score}/100</span>
                                    </div>
                                    <div>
                                        <span className="block font-bold text-gray-500 text-xs uppercase">Velocity</span>
                                        <span className="text-gray-800 font-medium">{match.velocity}</span>
                                    </div>
                                    <div>
                                        <span className="block font-bold text-gray-500 text-xs uppercase">Incentives</span>
                                        <span className="text-gray-800 font-medium truncate" title={match.incentives}>
                                            {match.incentives?.split(',')[0]}...
                                        </span>
                                    </div>
                                </div>

                                <div className="text-sm space-y-1">
                                    {match.partners && (
                                        <div className="flex gap-2 items-center text-gray-600">
                                            <span className="font-medium text-gray-800">Partners:</span>
                                            {match.partners.join(', ')}
                                        </div>
                                    )}
                                    {match.benefits && (
                                        <div className="flex gap-2 items-center text-gray-600">
                                            <span className="font-medium text-gray-800">Key Benefit:</span>
                                            {match.benefits}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatchmakingEngine;

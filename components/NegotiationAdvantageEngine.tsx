
import React, { useState } from 'react';

interface NegotiationAdvantageEngineProps {
    params: any;
    targetCountry?: string;
    proposedDeal?: any;
}

const NegotiationAdvantageEngine: React.FC<NegotiationAdvantageEngineProps> = ({
    params,
    targetCountry,
    proposedDeal
}) => {
    const [activeTab, setActiveTab] = useState<'playbook' | 'batna' | 'objections'>('playbook');

    const generatePlaybook = () => {
        const playbook = {
            preparation: {
                knowYourValue: `Your proposal creates ${proposedDeal?.economicImpact || 'significant'} economic impact with ${proposedDeal?.jobCreation || 'thousands of jobs'} created.`,
                setFirmMinimums: `Non-negotiables: ${params.problemStatement?.substring(0, 100) || 'Core strategic objectives must be met'}`,
                anticipateObjections: [
                    "Budget constraints - Counter: Show ROI projections and long-term benefits",
                    "Local competition concerns - Counter: Highlight unique value proposition and partnership benefits",
                    "Timeline concerns - Counter: Present realistic implementation roadmap with milestones"
                ]
            },
            engagement: {
                buildRapport: `Focus on shared goals: ${params.idealPartnerProfile || 'mutual economic development'}`,
                highlightValue: "Emphasize symbiotic benefits and long-term partnership potential",
                culturalAdaptation: targetCountry ? `Adapt to ${targetCountry} negotiation style` : "Research local customs"
            },
            closing: {
                getInWriting: "Draft MOU covering key terms, responsibilities, and timelines",
                followUpCadence: "Weekly check-ins during negotiation, monthly during implementation",
                relationshipMaintenance: "Establish clear communication channels and escalation procedures"
            }
        };
        return playbook;
    };

    const generateBATNA = () => {
        return {
            yourOptions: [
                `Proceed with ${targetCountry || 'current target'} - ${proposedDeal?.score || '85'} success probability`,
                "Alternative location identified by matchmaking engine",
                "Scale back operations or delay expansion",
                "Partner with domestic entities instead"
            ],
            theirOptions: [
                `Accept your proposal - gains ${proposedDeal?.benefits || 'economic development'}`,
                "Negotiate better terms with competitors",
                "Pursue alternative partnerships",
                "Maintain status quo without new investment"
            ],
            leveragePoints: [
                "Your unique value proposition and proven track record",
                "Alternative options provide negotiation leverage",
                "Time-sensitive opportunities create urgency",
                "Mutual benefits create win-win scenario"
            ]
        };
    };

    const playbook = generatePlaybook();
    const batna = generateBATNA();

    return (
        <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">🎯 Negotiation Advantage Engine</h3>
                <p className="text-sm text-purple-800">
                    Your personal negotiation playbook and strategic leverage analysis for winning the deal.
                </p>
            </div>

            <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                    {[
                        { id: 'playbook', label: 'Negotiation Playbook' },
                        { id: 'batna', label: 'BATNA Analysis' },
                        { id: 'objections', label: 'Objection Handling' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id
                                    ? 'border-purple-600 text-purple-700'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="min-h-[400px] pt-4">
                {activeTab === 'playbook' && (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">📋 Preparation Phase</h4>
                            <div className="space-y-4">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <h5 className="font-bold text-blue-900 mb-2">💰 Know Your Value</h5>
                                    <p className="text-blue-800 text-sm">{playbook.preparation.knowYourValue}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                    <h5 className="font-bold text-green-900 mb-2">🎯 Set Firm Minimums</h5>
                                    <p className="text-green-800 text-sm">{playbook.preparation.setFirmMinimums}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">🤝 Engagement Phase</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                    <h5 className="font-bold text-yellow-900 mb-2">🔗 Build Rapport</h5>
                                    <p className="text-yellow-800 text-sm">{playbook.engagement.buildRapport}</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                    <h5 className="font-bold text-purple-900 mb-2">🌍 Cultural Adaptation</h5>
                                    <p className="text-purple-800 text-sm">{playbook.engagement.culturalAdaptation}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Closing Phase</h4>
                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                <h5 className="font-bold text-indigo-900 mb-2">📝 Get It In Writing</h5>
                                <p className="text-indigo-800 mb-2 text-sm">{playbook.closing.getInWriting}</p>
                                <p className="text-indigo-800 text-sm"><strong>Follow-up:</strong> {playbook.closing.followUpCadence}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'batna' && (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">🎯 Best Alternative to Negotiated Agreement (BATNA)</h4>
                            <p className="text-gray-600 mb-4 text-sm">
                                Your BATNA gives you negotiation leverage. Knowing your alternatives empowers you to walk away from bad deals.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-green-50 p-5 rounded-lg border border-green-100">
                                <h5 className="font-bold text-green-900 mb-3">✅ Your Options (Leverage)</h5>
                                <ul className="space-y-2">
                                    {batna.yourOptions.map((option, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-green-800">
                                            <span className="mt-1">•</span>
                                            <span>{option}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-red-50 p-5 rounded-lg border border-red-100">
                                <h5 className="font-bold text-red-900 mb-3">⚠️ Their Options (Risk)</h5>
                                <ul className="space-y-2">
                                    {batna.theirOptions.map((option, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-red-800">
                                            <span className="mt-1">•</span>
                                            <span>{option}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <h5 className="font-bold text-purple-900 mb-3">💪 Key Leverage Points</h5>
                            <ul className="space-y-2">
                                {batna.leveragePoints.map((point, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-purple-500 font-bold mt-0.5">✓</span>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {activeTab === 'objections' && (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">🛡️ Anticipated Objections & Responses</h4>
                            <p className="text-gray-600 mb-4 text-sm">
                                Prepare for common concerns and have data-backed responses ready.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {playbook.preparation.anticipateObjections.map((objection, index) => {
                                const [concern, counter] = objection.split(' - Counter: ');
                                return (
                                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <h5 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                                            ❌ Objection: {concern}
                                        </h5>
                                        <div className="pl-6 border-l-2 border-green-500">
                                            <p className="text-green-800 text-sm"><strong>💡 Response:</strong> {counter}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                            <h5 className="font-bold text-blue-900 mb-2">🎭 General Handling Strategy</h5>
                            <ul className="text-blue-800 text-sm space-y-1">
                                <li>• Stay calm and acknowledge their concern</li>
                                <li>• Ask clarifying questions to understand their perspective</li>
                                <li>• Provide data and examples to support your position</li>
                                <li>• Focus on mutual benefits and long-term value</li>
                                <li>• Know when to walk away if terms become unfavorable</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NegotiationAdvantageEngine;

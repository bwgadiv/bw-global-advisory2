
import React from 'react';

interface CulturalIntelligenceModuleProps {
    targetCountry?: string;
}

const CulturalIntelligenceModule: React.FC<CulturalIntelligenceModuleProps> = ({ targetCountry }) => {
    const culturalBriefs: Record<string, any> = {
        'Japan': {
            negotiation: 'Silence indicates thoughtful consideration, not disagreement. Be patient and avoid rushing.',
            etiquette: 'Business cards exchanged with both hands, bow slightly. Decision-making is consensus-based.',
            communication: 'Indirect communication preferred. Read between the lines.',
            keyPhrases: ['Hai (Yes)', 'Wakarimashita (I understand)', 'Onegaishimasu (Please)']
        },
        'United States': {
            negotiation: 'Direct and assertive. Focus on bottom-line and ROI.',
            etiquette: 'Firm handshake, maintain eye contact. First names common after introduction.',
            communication: 'Straightforward and explicit. Value clarity over subtlety.',
            keyPhrases: ['Let\'s make a deal', 'What\'s your best offer?', 'I need to run this by my team']
        },
        'Middle East': {
            negotiation: 'Relationship-building paramount. Expect multiple meetings and hospitality.',
            etiquette: 'Greetings are warm and lengthy. Use right hand for eating/giving.',
            communication: 'High context - much implied rather than stated.',
            keyPhrases: ['Inshallah (God willing)', 'Masha\'allah (As God has willed)', 'Alhamdulillah (Praise be to God)']
        },
        'Germany': {
            negotiation: 'Thorough preparation expected. Data-driven and logical approach.',
            etiquette: 'Punctuality crucial. Formal titles until invited to use first names.',
            communication: 'Direct but not aggressive. Value of thoroughness and precision.',
            keyPhrases: ['Sehr gut (Very good)', 'Einverstanden (Agreed)', 'Lassen Sie uns das besprechen (Let\'s discuss this)']
        },
        'China': {
            negotiation: 'Mianzi (Face) is critical. Never criticize openly. Negotiations are long-term.',
            etiquette: 'Seating arrangement by hierarchy. Gifts are expected but refused 3 times before acceptance.',
            communication: 'Implicit and polite. "Yes" often means "I hear you", not "I agree".',
            keyPhrases: ['Ni Hao (Hello)', 'Xie Xie (Thank you)', 'Guanxi (Relationships/Connections)']
        }
    };

    // Fallback logic for region matching
    const getBrief = (country: string) => {
        if (!country) return culturalBriefs['United States'];
        const key = Object.keys(culturalBriefs).find(k => country.includes(k)) || 'United States';
        return culturalBriefs[key];
    };

    const brief = getBrief(targetCountry || '');

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">🌍 Cultural Intelligence Brief</h3>
                <p className="text-sm text-blue-800">
                    Understanding cultural nuances is crucial for successful international partnerships.
                    Here's what you need to know for <strong>{targetCountry || 'your target region'}</strong>.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-2">🤝 Negotiation Style</h4>
                        <p className="text-sm text-gray-600">{brief.negotiation}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-2">🎭 Business Etiquette</h4>
                        <p className="text-sm text-gray-600">{brief.etiquette}</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-2">💬 Communication Style</h4>
                        <p className="text-sm text-gray-600">{brief.communication}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-2">🔑 Key Phrases</h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                            {brief.keyPhrases.map((phrase: string, index: number) => (
                                <li key={index} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                    {phrase}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Important Notes</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Research specific individuals and companies for additional context</li>
                    <li>• Consider hiring local cultural consultants for complex deals</li>
                    <li>• Always show respect for local customs and traditions</li>
                    <li>• Building trust takes time - don't rush the relationship</li>
                </ul>
            </div>
        </div>
    );
};

export default CulturalIntelligenceModule;

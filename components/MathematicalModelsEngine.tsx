
import React, { useState } from 'react';

interface MathematicalModelsEngineProps {
    regionData?: any;
    industryData?: any;
    onModelResults?: (results: any) => void;
}

const MathematicalModelsEngine: React.FC<MathematicalModelsEngineProps> = ({
    regionData,
    industryData,
    onModelResults
}) => {
    const [activeModel, setActiveModel] = useState<string>('lq');
    const [results, setResults] = useState<any>(null);

    // Mock data for demonstration
    const mockData = {
        regionEmployment: {
            'Manufacturing': 15000,
            'Technology': 8000,
            'Agriculture': 5000,
            'Services': 12000
        },
        nationalEmployment: {
            'Manufacturing': 200000,
            'Technology': 150000,
            'Agriculture': 100000,
            'Services': 300000
        },
        regionGDP: 50000000,
        nationalGDP: 2000000000,
        tradeData: {
            'Export Market A': { distance: 5000, size: 100000000 },
            'Export Market B': { distance: 2000, size: 50000000 },
            'Export Market C': { distance: 8000, size: 200000000 }
        }
    };

    const calculateLocationQuotient = () => {
        const lq: Record<string, number> = {};
        const totalRegional = Object.values(mockData.regionEmployment).reduce((a: number, b: number) => a + b, 0);
        const totalNational = Object.values(mockData.nationalEmployment).reduce((a: number, b: number) => a + b, 0);

        Object.keys(mockData.regionEmployment).forEach(industry => {
            const regionalShare = (mockData.regionEmployment[industry as keyof typeof mockData.regionEmployment] as number) / totalRegional;
            const nationalShare = (mockData.nationalEmployment[industry as keyof typeof mockData.nationalEmployment] as number) / totalNational;
            lq[industry] = regionalShare / nationalShare;
        });

        return {
            locationQuotients: lq,
            interpretation: Object.entries(lq).map(([industry, value]) => ({
                industry,
                lq: value,
                specialization: value > 1.25 ? 'High Specialization' : value < 0.8 ? 'Low Specialization' : 'Average'
            }))
        };
    };

    const calculateGravityModel = () => {
        const gravity = Object.entries(mockData.tradeData).map(([market, data]: [string, any]) => {
            const expectedTrade = (mockData.regionGDP * data.size) / Math.pow(data.distance, 2);
            return {
                market,
                expectedTrade,
                distance: data.distance,
                marketSize: data.size
            };
        });

        return {
            gravityModel: gravity,
            insights: gravity.map(item => ({
                ...item,
                opportunity: item.expectedTrade > 1000000 ? 'High Potential' : 'Moderate Potential'
            }))
        };
    };

    const performMCDA = () => {
        // Multi-Criteria Decision Analysis with sample criteria
        const alternatives = [
            { name: 'Location A', criteria: { cost: 0.8, infrastructure: 0.9, labor: 0.7, market: 0.6 } },
            { name: 'Location B', criteria: { cost: 0.6, infrastructure: 0.7, labor: 0.9, market: 0.8 } },
            { name: 'Location C', criteria: { cost: 0.9, infrastructure: 0.8, labor: 0.6, market: 0.7 } }
        ];

        const weights = { cost: 0.3, infrastructure: 0.25, labor: 0.25, market: 0.2 };

        const scores = alternatives.map(alt => ({
            ...alt,
            score: Object.entries(alt.criteria).reduce((sum, [criterion, value]) =>
                sum + (value * weights[criterion as keyof typeof weights]), 0
            )
        }));

        return {
            mcda: scores.sort((a, b) => b.score - a.score),
            weights,
            recommendation: scores[0]
        };
    };

    const runModel = (modelType: string) => {
        let result;
        switch (modelType) {
            case 'lq':
                result = calculateLocationQuotient();
                break;
            case 'gravity':
                result = calculateGravityModel();
                break;
            case 'mcda':
                result = performMCDA();
                break;
            default:
                result = { error: 'Model not implemented' };
        }
        setResults(result);
        onModelResults?.(result);
    };

    const models = [
        {
            id: 'lq',
            name: 'Location Quotient (LQ)',
            description: 'Measures regional specialization in industries compared to national average',
            purpose: 'Identify competitive advantages and export-oriented sectors'
        },
        {
            id: 'gravity',
            name: 'Gravity Model of Trade',
            description: 'Predicts trade flows based on economic size and distance',
            purpose: 'Find untapped export markets and trade opportunities'
        },
        {
            id: 'mcda',
            name: 'Multi-Criteria Decision Analysis',
            description: 'Ranks alternatives based on weighted criteria',
            purpose: 'Make optimal location or partner selection decisions'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-indigo-900 mb-2">🧮 Mathematical Models Engine</h3>
                <p className="text-sm text-indigo-800">
                    Rigorous economic models for data-driven strategic analysis. These proven formulas power world-class consulting and investment decisions.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {models.map(model => (
                    <button
                        key={model.id}
                        onClick={() => { setActiveModel(model.id); runModel(model.id); }}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                            activeModel === model.id
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:border-indigo-300 bg-white'
                        }`}
                    >
                        <h4 className="font-semibold text-gray-900 mb-2">{model.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{model.description}</p>
                        <p className="text-xs text-indigo-600 font-medium">{model.purpose}</p>
                    </button>
                ))}
            </div>

            {results && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 animate-fade-in">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        📊 {models.find(m => m.id === activeModel)?.name} Results
                    </h4>

                    {activeModel === 'lq' && results.locationQuotients && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Location Quotient > 1.25 indicates high specialization and export potential
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                {results.interpretation.map((item: any) => (
                                    <div key={item.industry} className="bg-gray-50 p-3 rounded">
                                        <h5 className="font-medium text-gray-900">{item.industry}</h5>
                                        <p className="text-sm text-gray-600">LQ: {item.lq.toFixed(2)}</p>
                                        <span className={`text-xs px-2 py-1 rounded ${
                                            item.specialization === 'High Specialization' ? 'bg-green-100 text-green-800' :
                                            item.specialization === 'Low Specialization' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {item.specialization}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeModel === 'gravity' && results.gravityModel && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Higher expected trade values indicate better market opportunities
                            </p>
                            <div className="space-y-3">
                                {results.insights.map((item: any) => (
                                    <div key={item.market} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <div>
                                            <h5 className="font-medium text-gray-900">{item.market}</h5>
                                            <p className="text-sm text-gray-600">
                                                Distance: {item.distance}km | Market Size: ${(item.marketSize / 1000000).toFixed(0)}M
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                ${(item.expectedTrade / 1000000).toFixed(1)}M expected trade
                                            </p>
                                            <span className={`text-xs px-2 py-1 rounded ${
                                                item.opportunity === 'High Potential' ? 'bg-green-100 text-green-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {item.opportunity}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeModel === 'mcda' && results.mcda && (
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Criteria Weights: Cost ({(results.weights.cost * 100).toFixed(0)}%)</span>
                                <span>Infrastructure ({(results.weights.infrastructure * 100).toFixed(0)}%)</span>
                                <span>Labor ({(results.weights.labor * 100).toFixed(0)}%)</span>
                                <span>Market ({(results.weights.market * 100).toFixed(0)}%)</span>
                            </div>
                            <div className="space-y-3">
                                {results.mcda.map((alt: any, index: number) => (
                                    <div key={alt.name} className={`p-4 rounded-lg border-2 ${
                                        index === 0 ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
                                    }`}>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h5 className="font-medium text-gray-900">
                                                    {index === 0 && '🥇 '} {alt.name}
                                                </h5>
                                                <p className="text-sm text-gray-600">
                                                    Score: {(alt.score * 100).toFixed(1)}/100
                                                </p>
                                            </div>
                                            <div className="text-right text-sm">
                                                <div>Cost: {(alt.criteria.cost * 100).toFixed(0)}%</div>
                                                <div>Infra: {(alt.criteria.infrastructure * 100).toFixed(0)}%</div>
                                                <div>Labor: {(alt.criteria.labor * 100).toFixed(0)}%</div>
                                                <div>Market: {(alt.criteria.market * 100).toFixed(0)}%</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {results.recommendation && (
                                <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                                    <h5 className="font-semibold text-green-900">🎯 Recommended Choice</h5>
                                    <p className="text-green-800">
                                        Based on weighted criteria analysis, <strong>{results.recommendation.name}</strong>
                                        scores highest with {(results.recommendation.score * 100).toFixed(1)}/100.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MathematicalModelsEngine;

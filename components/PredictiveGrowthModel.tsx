
import React, { useState, useEffect } from 'react';
import { generateThinkingContent } from '../services/nexusService';

const PredictiveGrowthModel = ({ location, timeHorizon, onModelComplete }: { location: any; timeHorizon: number; onModelComplete: any }) => {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [thinking, setThinking] = useState(false);

    useEffect(() => {
        // Ensure location and city/country are present before generating
        if (location && location.city && location.country && !analysis && !thinking) {
            setThinking(true);
            const prompt = `Act as a senior economist. Generate a predictive economic growth model for ${location.city}, ${location.country} over the next ${timeHorizon} years. Consider inflation, political stability, and infrastructure projects. Provide a detailed scenario analysis.`;
            
            generateThinkingContent(prompt).then(result => {
                setAnalysis(result);
                setThinking(false);
                onModelComplete();
            });
        }
    }, [location, timeHorizon, analysis, thinking, onModelComplete]);

    if (!location || !location.city || !location.country) {
        return (
            <div className="p-12 bg-gray-50 border border-gray-200 rounded-xl text-center shadow-sm">
                <h4 className="text-lg font-bold text-gray-800 mb-2">Predictive Model Standby</h4>
                <p className="text-gray-500 text-sm">Model will generate once a specific target jurisdiction is defined.</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                Predictive Growth Model
                {thinking && <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold animate-pulse">Thinking (Gemini 3 Pro)</span>}
            </h4>
            
            {thinking ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-32 bg-gray-100 rounded border border-gray-200"></div>
                </div>
            ) : (
                <div className="prose prose-sm max-w-none text-gray-700">
                    <div className="whitespace-pre-wrap">{analysis || "Analysis could not be generated."}</div>
                </div>
            )}
        </div>
    );
};
export default PredictiveGrowthModel;

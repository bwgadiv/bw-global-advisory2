
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Schema, Type } from "@google/genai";
import { ReportParameters } from '../types';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldCheckIcon, SearchIcon, BookOpenIcon, AlertTriangleIcon, CheckCircleIcon } from './Icons';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface QualityAnalysisProps {
    params: ReportParameters;
}

interface QualityAudit {
    score: number;
    credibility: string;
    biasDetected: boolean;
    biasAnalysis: string;
    missingDataPoints: string[];
    recommendedSources: string[];
    freshnessScore: number;
}

const schema: Schema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.NUMBER, description: "Quality score from 0-100" },
        credibility: { type: Type.STRING, description: "Short credibility assessment string" },
        biasDetected: { type: Type.BOOLEAN, description: "Whether bias is detected" },
        biasAnalysis: { type: Type.STRING, description: "Explanation of potential bias" },
        missingDataPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of missing data points" },
        recommendedSources: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of recommended sources" },
        freshnessScore: { type: Type.NUMBER, description: "Data freshness score 0-100" }
    },
    required: ["score", "credibility", "biasDetected", "biasAnalysis", "missingDataPoints", "recommendedSources", "freshnessScore"]
};

const QualityAnalysis: React.FC<QualityAnalysisProps> = ({ params }) => {
    const [audit, setAudit] = useState<QualityAudit | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const performAudit = async () => {
            if (!params.problemStatement || !params.region) return;
            
            if (isMounted) setLoading(true);
            try {
                const prompt = `
                    Act as a Senior Intelligence Auditor. Conduct a quality assurance audit on the following strategic scope:
                    
                    Context:
                    - Region: ${params.region}
                    - Industry: ${params.industry.join(', ')}
                    - Organization Type: ${params.organizationType}
                    - Objective: ${params.problemStatement}

                    Analyze for data availability, cognitive biases, and data gaps.
                `;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: { 
                        responseMimeType: 'application/json',
                        responseSchema: schema
                    }
                });

                const text = response.text;
                if (text && isMounted) {
                    setAudit(JSON.parse(text));
                }
            } catch (error) {
                console.error("Quality Audit Failed", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            if (params.problemStatement && params.region) performAudit();
        }, 1500);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [params.problemStatement, params.region, params.industry, params.organizationType]);

    const scoreData = audit ? [
        { name: 'Feasibility', uv: audit.score, fill: '#334155' },
        { name: 'Data Freshness', uv: audit.freshnessScore, fill: '#10b981' },
        { name: 'Bias Risk', uv: audit.biasDetected ? 80 : 20, fill: audit.biasDetected ? '#ef4444' : '#e2e8f0' }
    ] : [];

    if (!params.problemStatement) {
        return (
            <div className="p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center mt-6">
                <ShieldCheckIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-lg font-bold text-slate-700">Quality Audit Standby</h4>
                <p className="text-sm text-slate-500 mt-2">Define your Strategic Context and Objectives to run a quality check.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mt-6">
            <header className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheckIcon className="w-5 h-5 text-slate-700" />
                        Intelligence Quality Assurance
                    </h3>
                    <p className="text-xs text-slate-500">AI-Driven Data Audit & Credibility Check</p>
                </div>
                {loading && (
                    <span className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-slate-500"></span> Auditing...
                    </span>
                )}
            </header>

            {loading && !audit ? (
                <div className="p-8 space-y-4">
                    <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                    <div className="h-32 bg-slate-50 rounded border border-slate-100 animate-pulse"></div>
                </div>
            ) : audit ? (
                <div className="p-6 grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col items-center justify-center">
                        <div className="relative w-full h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart 
                                    innerRadius="20%" 
                                    outerRadius="100%" 
                                    barSize={10} 
                                    data={scoreData} 
                                    startAngle={180} 
                                    endAngle={0}
                                >
                                    <RadialBar background dataKey="uv" cornerRadius={10} label={{ position: 'insideStart', fill: '#fff' }} />
                                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ top: '50%', right: 0, transform: 'translate(0, -50%)' }} />
                                    <Tooltip />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                <span className="text-3xl font-extrabold text-slate-900">{audit.score}</span>
                                <span className="text-xs text-slate-500 block">/100 Score</span>
                            </div>
                        </div>
                        <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${audit.score > 75 ? 'bg-emerald-100 text-emerald-800' : audit.score > 50 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                            {audit.credibility}
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className={`p-4 rounded-lg border ${audit.biasDetected ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                            <h5 className={`font-bold text-sm mb-1 flex items-center gap-2 ${audit.biasDetected ? 'text-red-800' : 'text-emerald-800'}`}>
                                {audit.biasDetected ? <AlertTriangleIcon className="w-4 h-4"/> : <CheckCircleIcon className="w-4 h-4"/>}
                                {audit.biasDetected ? 'Potential Bias Detected' : 'Objective Assessment'}
                            </h5>
                            <p className={`text-sm ${audit.biasDetected ? 'text-red-700' : 'text-emerald-700'}`}>
                                {audit.biasAnalysis}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                                <h5 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1">
                                    <SearchIcon className="w-3 h-3" /> Identified Data Gaps
                                </h5>
                                <ul className="space-y-2">
                                    {audit.missingDataPoints.map((gap, i) => (
                                        <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                            <span className="text-red-500 mt-0.5">•</span>
                                            {gap}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                                <h5 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1">
                                    <BookOpenIcon className="w-3 h-3" /> Recommended Sources
                                </h5>
                                <ul className="space-y-2">
                                    {audit.recommendedSources.map((source, i) => (
                                        <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                            <span className="text-blue-600 mt-0.5">✓</span>
                                            {source}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-8 text-center text-slate-500">Unable to complete audit.</div>
            )}
        </div>
    );
};

export default QualityAnalysis;

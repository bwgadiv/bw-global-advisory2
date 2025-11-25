
import React, { useState, useEffect } from 'react';
import { generateSearchGroundedContent } from '../services/geminiService';

interface DueDiligenceSuiteProps {
    partnerName: string;
    partnerType: string;
}

const DueDiligenceSuite: React.FC<DueDiligenceSuiteProps> = ({ partnerName, partnerType }) => {
    const [report, setReport] = useState<{text: string, sources: any[]} | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (partnerName) {
                if (isMounted) {
                    setLoading(true);
                    setReport(null);
                }
                
                try {
                    const query = `Conduct a due diligence check on ${partnerName} (${partnerType}). Look for recent legal issues, financial news, and reputation risks. Provide a summary with citations.`;
                    const result = await generateSearchGroundedContent(query);
                    
                    if (isMounted) {
                        setReport(result);
                        setLoading(false);
                    }
                } catch (error) {
                    console.error("Due Diligence Error:", error);
                    if (isMounted) setLoading(false);
                }
            } else {
                if (isMounted) {
                    setReport(null);
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [partnerName, partnerType]);

    return (
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm animate-fade-in-up">
            <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-red-600 rounded-full"></span>
                Due Diligence Module
                <span className="ml-auto px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">Search Grounded</span>
            </h4>
            
            {loading ? (
                <div className="space-y-4 animate-pulse p-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    <p className="text-xs text-slate-400 font-mono mt-2">Scanning global databases...</p>
                </div>
            ) : !partnerName ? (
                 <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <p className="text-sm text-slate-500 italic">Please define an Ideal Partner Profile in the "Scope & Context" step to run due diligence.</p>
                 </div>
            ) : (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div className="text-sm text-slate-700 mb-4 whitespace-pre-wrap leading-relaxed font-serif">{report?.text || "No specific risk information found."}</div>
                    {report?.sources && report.sources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Verified Sources</h5>
                            <div className="grid grid-cols-1 gap-2">
                                {report.sources.map((chunk, i) => (
                                    chunk.web?.uri && (
                                        <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800 hover:underline truncate block flex items-center gap-2 p-1 hover:bg-white rounded transition-colors">
                                            <span className="text-slate-400">🔗</span> {chunk.web.title || chunk.web.uri}
                                        </a>
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
export default DueDiligenceSuite;

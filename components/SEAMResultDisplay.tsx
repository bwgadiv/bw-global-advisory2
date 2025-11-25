
import React from 'react';
import type { SEAM_Blueprint } from '../types';

export const SEAMResultDisplay: React.FC<{ seam: SEAM_Blueprint }> = ({ seam }) => (
    <div className="space-y-4 animate-fade-in">
        <div className="bg-slate-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Strategic Ecosystem Summary</h4>
            <p className="text-sm text-gray-700 leading-relaxed italic">"{seam.ecosystemSummary}"</p>
        </div>
        
        <div className="space-y-2">
            {seam.partners.map((p, index) => (
                <div 
                    key={index} 
                    className="p-3 border-l-4 border-orange-400 bg-white rounded-r-md shadow-sm hover:shadow-md hover:bg-orange-50/30 transition-all duration-200 group"
                >
                     <div className="flex justify-between items-start">
                        <p className="font-bold text-sm text-gray-900">
                            {p.entity} 
                            <span className="text-[10px] font-bold uppercase text-orange-600 ml-2 opacity-80 group-hover:opacity-100">
                                ({p.type})
                            </span>
                        </p>
                     </div>
                     <p className="text-xs text-gray-500 mt-1 leading-relaxed">{p.rationale}</p>
                </div>
            ))}
        </div>
    </div>
);

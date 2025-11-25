
import React, { useState } from 'react';
import { STAKEHOLDER_PERSPECTIVES } from '../constants';
import { Users, Target, ShieldCheck, TrendingUp } from './Icons';

interface StakeholderPerspectiveModuleProps {
    selectedPerspectives: string[];
    onPerspectiveChange: (perspectives: string[]) => void;
    primaryObjective: string;
}

const StakeholderPerspectiveModule: React.FC<StakeholderPerspectiveModuleProps> = ({
    selectedPerspectives,
    onPerspectiveChange,
    primaryObjective
}) => {
    const [activePerspective, setActivePerspective] = useState<string | null>(null);

    const availablePerspectives = Object.keys(STAKEHOLDER_PERSPECTIVES);

    const togglePerspective = (p: string) => {
        if (selectedPerspectives.includes(p)) {
            onPerspectiveChange(selectedPerspectives.filter(sp => sp !== p));
            if (activePerspective === p) setActivePerspective(null);
        } else {
            onPerspectiveChange([...selectedPerspectives, p]);
            setActivePerspective(p);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-black" /> Stakeholder Map
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                    Select key stakeholders to analyze their specific interests, risks, and success metrics regarding "{primaryObjective || 'your objective'}".
                </p>

                <div className="flex flex-wrap gap-3 mb-6">
                    {availablePerspectives.map(p => (
                        <button
                            key={p}
                            onClick={() => togglePerspective(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                                selectedPerspectives.includes(p)
                                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                {selectedPerspectives.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Analyzing Perspective:</label>
                            <select 
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                value={activePerspective || ''}
                                onChange={(e) => setActivePerspective(e.target.value)}
                            >
                                {selectedPerspectives.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {activePerspective && STAKEHOLDER_PERSPECTIVES[activePerspective] && (
                <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                        <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4" /> Strategic Priorities
                        </h4>
                        <ul className="space-y-2">
                            {STAKEHOLDER_PERSPECTIVES[activePerspective].priorities.map((item: string, i: number) => (
                                <li key={i} className="text-sm text-blue-800 flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-red-50 p-5 rounded-xl border border-red-100">
                        <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" /> Key Concerns & Risks
                        </h4>
                        <ul className="space-y-2">
                            {STAKEHOLDER_PERSPECTIVES[activePerspective].concerns.map((item: string, i: number) => (
                                <li key={i} className="text-sm text-red-800 flex items-start gap-2">
                                    <span className="text-red-500 mt-1">•</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                        <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> Success Metrics
                        </h4>
                        <ul className="space-y-2">
                            {STAKEHOLDER_PERSPECTIVES[activePerspective].successMetrics.map((item: string, i: number) => (
                                <li key={i} className="text-sm text-green-800 flex items-start gap-2">
                                    <span className="text-green-500 mt-1">•</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-2">Tailored Value Proposition</h4>
                        <p className="text-sm text-gray-600 italic">
                            "{STAKEHOLDER_PERSPECTIVES[activePerspective].valueProposition}"
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StakeholderPerspectiveModule;

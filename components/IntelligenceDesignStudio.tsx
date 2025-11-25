
import React, { useState, useMemo } from 'react';
import { ReportParameters, UserProfile, StrategicIntent, SkillLevel } from '../types';
import { ORGANIZATION_TYPES, STRATEGIC_INTENTS, REGIONS_AND_COUNTRIES, ORGANIZATION_SUBTYPES } from '../constants';
import { NexusLogo, Target, BrainCircuit, GlobeIcon, Users, FileText, LetterIcon, Layers, CheckCircle, RocketIcon, ShieldCheck, ActivityIcon, ManualIcon } from './Icons';
import { StrategicCanvas } from './StrategicCanvas';
import { generateFastSuggestion } from '../services/nexusService';
import Inquire from './Inquire';

interface DesignStudioProps {
    params: ReportParameters;
    onParamsChange: (params: ReportParameters) => void;
    onProfileUpdate: (profile: UserProfile) => void;
}

type StudioStage = 'identity' | 'intent' | 'canvas';

// Helper to map module IDs to names for the preview
const MODULE_NAME_MAP: Record<string, string> = {
    'geopolitics': 'Geopolitical Forecast',
    'rroi': 'RROI Diagnostic',
    'comfort_index': 'Regional Comfort Index',
    'math_models': 'Math Models Engine',
    'rocket_engine': 'Nexus Rocket Engine',
    'governance_audit': 'Governance Audit',
    'due_diligence': 'Due Diligence Suite',
    'symbiotic_matchmaking': 'Symbiotic Discovery',
    'matchmaking_engine': 'Matchmaking Engine',
    'seam': 'Ecosystem Mapping',
    'partner_intel': 'Partner Intelligence',
    'deep_reasoning': 'Deep Reasoning Engine',
    'trade_disruption': 'Trade Simulation',
    'predictive_growth': 'Predictive Growth',
    'alternative_locations': 'Alt. Location Matcher',
    'cultural_intel': 'Cultural Intelligence',
    'negotiation_advantage': 'Negotiation Advantage',
    'stakeholder_analysis': 'Stakeholder Map',
    'relationship_builder': 'Relationship Strategy',
    'final_review': 'Final Dossier'
};

const MODULE_PHASES: Record<string, string> = {
    'geopolitics': 'Macro',
    'rroi': 'Macro',
    'comfort_index': 'Macro',
    'math_models': 'Macro',
    'rocket_engine': 'Macro',
    'governance_audit': 'Integrity',
    'due_diligence': 'Integrity',
    'symbiotic_matchmaking': 'Expansion',
    'matchmaking_engine': 'Expansion',
    'seam': 'Expansion',
    'partner_intel': 'Expansion',
    'deep_reasoning': 'Expansion',
    'trade_disruption': 'Expansion',
    'predictive_growth': 'Expansion',
    'alternative_locations': 'Expansion',
    'cultural_intel': 'Execution',
    'negotiation_advantage': 'Execution',
    'stakeholder_analysis': 'Execution',
    'relationship_builder': 'Execution',
    'final_review': 'Execution'
};

export const IntelligenceDesignStudio: React.FC<DesignStudioProps> = ({
    params,
    onParamsChange,
    onProfileUpdate
}) => {
    const [stage, setStage] = useState<StudioStage>('identity');
    const [isAnalyzingThought, setIsAnalyzingThought] = useState(false);

    // --- Handlers ---

    const handleIdentityComplete = () => {
        setStage('intent');
    };

    const toggleIntent = (intentId: string) => {
        const currentIntents = params.selectedIntents || [];
        const newIntents = currentIntents.includes(intentId)
            ? currentIntents.filter(id => id !== intentId)
            : [...currentIntents, intentId];
        
        // Update params with the array
        onParamsChange({
            ...params,
            selectedIntents: newIntents,
            // Keep the first selected one as the "primary" for legacy support if needed, or clear if empty
            selectedIntent: newIntents.length > 0 ? newIntents[0] : undefined
        });
    };

    const handleProceedToCanvas = () => {
        // Generate a combined problem statement if needed, or just proceed
        if (!params.problemStatement && params.selectedIntents && params.selectedIntents.length > 0) {
             const intentTitles = params.selectedIntents.map(id => STRATEGIC_INTENTS.find(i => i.id === id)?.title).join(' + ');
             onParamsChange({ ...params, problemStatement: `Strategic Mission: ${intentTitles}` });
        }
        setStage('canvas');
    };

    const handleInitialThoughtAnalysis = async () => {
        if (!params.initialThought) return;
        setIsAnalyzingThought(true);
        try {
            const refined = await generateFastSuggestion(params.initialThought, "Convert this raw thought into a strategic objective statement.");
            onParamsChange({ ...params, problemStatement: refined });
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzingThought(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onParamsChange({ ...params, uploadedFileName: file.name, uploadedDocument: true });
        }
    };

    // Calculate active engines for the preview
    const activeEngines = useMemo(() => {
        const selectedIds = params.selectedIntents || [];
        const moduleSet = new Set<string>();
        
        // Always include core
        moduleSet.add('geopolitics');
        moduleSet.add('final_review');

        selectedIds.forEach(id => {
            const intent = STRATEGIC_INTENTS.find(i => i.id === id);
            if (intent) {
                intent.recommendedModules.forEach(mod => moduleSet.add(mod));
            }
        });

        return Array.from(moduleSet);
    }, [params.selectedIntents]);

    // Group engines by phase for the visualization
    const enginesByPhase = useMemo(() => {
        const groups: Record<string, string[]> = {
            'Macro': [],
            'Integrity': [],
            'Expansion': [],
            'Execution': []
        };
        
        activeEngines.forEach(engineId => {
            const phase = MODULE_PHASES[engineId] || 'Execution';
            if (groups[phase]) {
                groups[phase].push(engineId);
            }
        });
        
        return groups;
    }, [activeEngines]);

    // Logic for Org SubTypes
    const subTypes = ORGANIZATION_SUBTYPES[params.organizationType] || [];
    const showCustomTypeInput = params.organizationType === 'Custom';
    const showCustomCategoryInput = params.organizationType && (params.organizationSubType === 'Custom' || subTypes.length === 0);

    // --- Views ---

    if (stage === 'identity') {
        return (
            <div className="h-full w-full bg-slate-100 overflow-y-auto font-sans" id="studio-scroll-container">
                <div className="min-h-full flex flex-col items-center justify-center p-6 md:p-12">
                    
                    <div className="max-w-5xl w-full animate-fade-in-up">
                        {/* Header Section */}
                        <div className="mb-10 text-center">
                            <div className="inline-flex items-center justify-center p-3 bg-white rounded shadow-sm border border-slate-300 mb-6">
                                <NexusLogo className="w-8 h-8 text-slate-900" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                                Establish Point of View
                            </h1>
                            <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
                                Configure the Nexus Intelligence System. Your profile calibrates the AI's depth, tone, and strategic focus.
                            </p>
                        </div>

                        <div className="bg-white rounded border border-slate-200 shadow-lg overflow-hidden">
                            <div className="p-8 md:p-12 space-y-10">
                                
                                {/* Experience Level Selection - Expanded */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Analyst Experience Level</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[
                                            { id: 'observer', label: 'Observer', desc: 'Passive Insights Only', icon: ActivityIcon },
                                            { id: 'novice', label: 'Novice Analyst', desc: 'Guided & Instructional', icon: ManualIcon },
                                            { id: 'associate', label: 'Associate', desc: 'Collaborative Co-Pilot', icon: Users },
                                            { id: 'senior', label: 'Senior Strategist', desc: 'Autonomous Execution', icon: Target },
                                            { id: 'executive', label: 'Decision Maker', desc: 'Synthesis & Bottom Line', icon: ShieldCheck },
                                            { id: 'visionary', label: 'Visionary Architect', desc: 'Abstract & Global Scale', icon: BrainCircuit }
                                        ].map((level) => (
                                            <button 
                                                key={level.id} 
                                                onClick={() => onParamsChange({...params, skillLevel: level.id as SkillLevel})} 
                                                className={`group p-5 rounded border text-left transition-all duration-200 relative overflow-hidden ${
                                                    params.skillLevel === level.id 
                                                    ? 'bg-slate-900 text-white shadow-lg scale-[1.02] ring-2 ring-offset-2 ring-slate-900 border-transparent' 
                                                    : 'border-slate-300 hover:border-slate-500 bg-white hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <level.icon className={`w-6 h-6 ${params.skillLevel === level.id ? 'text-white' : 'text-slate-400'}`} />
                                                        {params.skillLevel === level.id && <CheckCircle className="w-5 h-5 text-white" />}
                                                    </div>
                                                    <div className={`font-bold text-lg mb-1 ${params.skillLevel === level.id ? 'text-white' : 'text-slate-700'}`}>
                                                        {level.label}
                                                    </div>
                                                    <p className={`text-xs font-medium ${params.skillLevel === level.id ? 'text-slate-300' : 'text-slate-500'}`}>{level.desc}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-slate-200 w-full"></div>

                                {/* Personal Details */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Principal Agent</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                                                <input 
                                                    type="text" 
                                                    value={params.userName} 
                                                    onChange={(e) => onParamsChange({...params, userName: e.target.value})}
                                                    className="w-full p-3 bg-white border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-slate-900 placeholder-slate-400 shadow-sm"
                                                    placeholder="e.g. Jane Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Role / Title</label>
                                                <input 
                                                    type="text" 
                                                    value={params.userDepartment} 
                                                    onChange={(e) => onParamsChange({...params, userDepartment: e.target.value})}
                                                    className="w-full p-3 bg-white border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-slate-900 placeholder-slate-400 shadow-sm"
                                                    placeholder="e.g. Head of Strategy"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
                                                    <input 
                                                        type="email" 
                                                        value={params.userEmail || ''} 
                                                        onChange={(e) => onParamsChange({...params, userEmail: e.target.value})}
                                                        className="w-full p-3 bg-white border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none shadow-sm text-sm"
                                                        placeholder="jane@company.com"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone</label>
                                                    <input 
                                                        type="tel" 
                                                        value={params.userPhone || ''} 
                                                        onChange={(e) => onParamsChange({...params, userPhone: e.target.value})}
                                                        className="w-full p-3 bg-white border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none shadow-sm text-sm"
                                                        placeholder="+1 (555) 000-0000"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Organization</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Entity Type</label>
                                                <div className="relative">
                                                    <select 
                                                        value={params.organizationType} 
                                                        onChange={(e) => onParamsChange({...params, organizationType: e.target.value, organizationSubType: ''})}
                                                        className="w-full p-3 bg-white border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none appearance-none text-slate-900 shadow-sm"
                                                    >
                                                        <option value="">Select Organization Type...</option>
                                                        {ORGANIZATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                        <Users className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                </div>
                                                {showCustomTypeInput && (
                                                    <input 
                                                        type="text" 
                                                        value={params.customOrganizationType || ''} 
                                                        onChange={(e) => onParamsChange({...params, customOrganizationType: e.target.value})}
                                                        className="w-full mt-2 p-3 bg-slate-50 border border-slate-300 rounded-none text-sm focus:ring-1 focus:ring-slate-900"
                                                        placeholder="Specify Org Type..."
                                                    />
                                                )}
                                            </div>

                                            {params.organizationType && (
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Category / Function</label>
                                                    <select 
                                                        value={params.organizationSubType || ''} 
                                                        onChange={(e) => onParamsChange({...params, organizationSubType: e.target.value})}
                                                        className="w-full p-3 bg-white border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none appearance-none text-sm shadow-sm"
                                                    >
                                                        <option value="">Select Category...</option>
                                                        {subTypes.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                                        <option value="Custom">Other (Specify)</option>
                                                    </select>
                                                    {showCustomCategoryInput && (
                                                        <input 
                                                            type="text" 
                                                            value={params.customOrganizationSubType || ''} 
                                                            onChange={(e) => onParamsChange({...params, customOrganizationSubType: e.target.value})}
                                                            className="w-full mt-2 p-3 bg-slate-50 border border-slate-300 rounded-none text-sm focus:ring-1 focus:ring-slate-900"
                                                            placeholder="Specify Category..."
                                                        />
                                                    )}
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">HQ Location</label>
                                                    <select 
                                                        value={params.userCountry} 
                                                        onChange={(e) => onParamsChange({...params, userCountry: e.target.value})}
                                                        className="w-full p-3 bg-white border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none appearance-none text-sm shadow-sm"
                                                    >
                                                        <option value="">Select Country...</option>
                                                        {REGIONS_AND_COUNTRIES.flatMap(r => r.countries).sort().map(c => <option key={c} value={c}>{c}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Target Region</label>
                                                    <select 
                                                        value={params.region} 
                                                        onChange={(e) => onParamsChange({...params, region: e.target.value})}
                                                        className="w-full p-3 bg-white border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none appearance-none text-sm shadow-sm"
                                                    >
                                                        <option value="">Select Region...</option>
                                                        {REGIONS_AND_COUNTRIES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Address</label>
                                                    <input 
                                                        type="text" 
                                                        value={params.userAddress || ''} 
                                                        onChange={(e) => onParamsChange({...params, userAddress: e.target.value})}
                                                        className="w-full p-3 bg-white border border-slate-300 rounded-none text-sm focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none shadow-sm"
                                                        placeholder="City, Country"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Website</label>
                                                    <input 
                                                        type="url" 
                                                        value={params.userWebsite || ''} 
                                                        onChange={(e) => onParamsChange({...params, userWebsite: e.target.value})}
                                                        className="w-full p-3 bg-white border border-slate-300 rounded-none text-sm focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none shadow-sm"
                                                        placeholder="https://"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Strategic Assistance Request */}
                                <div className="bg-slate-50 p-8 rounded border border-slate-200">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">Strategic Assistance Request</h3>
                                            <p className="text-sm text-slate-500 mt-1">Describe your core challenge or the specific help you seek.</p>
                                        </div>
                                        <BrainCircuit className="w-6 h-6 text-slate-400" />
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <textarea 
                                            value={params.initialThought || ''} 
                                            onChange={(e) => onParamsChange({...params, initialThought: e.target.value})}
                                            placeholder="e.g., 'We need to find a manufacturing partner in Vietnam to diversify our supply chain away from China. Budget is $50M...'"
                                            className="w-full p-4 border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none min-h-[120px] text-sm leading-relaxed resize-y bg-white shadow-inner"
                                        />
                                        
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div className="relative">
                                                <input 
                                                    type="file" 
                                                    id="identity-doc-upload" 
                                                    className="hidden" 
                                                    onChange={handleFileUpload}
                                                    accept=".pdf,.docx,.txt"
                                                />
                                                <label htmlFor="identity-doc-upload" className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer hover:text-slate-900 transition-colors px-3 py-2 rounded hover:bg-white border border-transparent hover:border-slate-300">
                                                    <FileText className="w-4 h-4" /> 
                                                    {params.uploadedFileName ? `Attached: ${params.uploadedFileName}` : 'Attach Briefing Doc'}
                                                </label>
                                            </div>

                                            <button 
                                                onClick={handleInitialThoughtAnalysis}
                                                disabled={!params.initialThought || isAnalyzingThought}
                                                className="text-xs font-bold text-slate-700 hover:text-slate-900 disabled:opacity-50 transition-colors flex items-center gap-1"
                                            >
                                                {isAnalyzingThought ? 'Analyzing...' : 'Refine Request with AI'}
                                            </button>
                                        </div>
                                    </div>

                                    {params.problemStatement && params.initialThought && (
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            <div className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> System Interpreted Directive
                                            </div>
                                            <p className="text-sm text-slate-700 italic leading-relaxed font-mono">"{params.problemStatement}"</p>
                                        </div>
                                    )}
                                </div>

                                {/* Action Footer */}
                                <div className="flex justify-end pt-4">
                                    <button 
                                        onClick={handleIdentityComplete}
                                        disabled={!params.organizationType || !params.userCountry || !params.userName}
                                        className="group relative px-8 py-4 bg-slate-900 text-white font-bold text-sm tracking-widest uppercase rounded hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3"
                                    >
                                        Confirm Identity & Proceed
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (stage === 'intent') {
        const hasSelected = (params.selectedIntents || []).length > 0;

        return (
            <div className="h-full w-full bg-slate-100 overflow-y-auto font-sans" id="studio-scroll-container">
                <div className="min-h-full flex flex-col items-center justify-start p-6 md:p-12">
                    <div className="max-w-7xl w-full space-y-10 animate-fade-in">
                        
                        <div className="text-center space-y-4">
                            <button onClick={() => setStage('identity')} className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest mb-4 transition-colors">← Back to Identity</button>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Define Strategic Intent</h1>
                            <p className="text-lg text-slate-600 font-normal max-w-3xl mx-auto">
                                Select one or more mission architectures to configure your intelligence pipeline.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {STRATEGIC_INTENTS.map((intent) => {
                                const isSelected = (params.selectedIntents || []).includes(intent.id);
                                const isAligned = intent.personaAlignment.includes('All') || intent.personaAlignment.some(p => params.organizationType.includes(p));
                                
                                return (
                                    <button
                                        key={intent.id}
                                        onClick={() => toggleIntent(intent.id)}
                                        className={`relative group p-6 rounded border text-left transition-all duration-300 flex flex-col h-full ${
                                            isSelected 
                                            ? 'bg-slate-900 border-slate-900 text-white shadow-xl transform -translate-y-1' 
                                            : isAligned
                                                ? 'bg-white border-slate-400 shadow-md ring-2 ring-slate-200' // Recommended style
                                                : 'bg-white border-slate-200 hover:border-slate-400 hover:shadow-sm'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`transition-transform duration-300 ${isSelected ? 'text-white' : 'text-slate-900 group-hover:scale-105'}`}>
                                                {intent.icon}
                                            </div>
                                            {isSelected ? (
                                                <div className="bg-white text-slate-900 rounded-full p-1"><CheckCircle className="w-4 h-4" /></div>
                                            ) : isAligned && (
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded border border-slate-300">
                                                    Suggested
                                                </span>
                                            )}
                                        </div>
                                        
                                        <h3 className={`text-base font-bold mb-2 leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>{intent.title}</h3>
                                        <p className={`text-xs leading-relaxed mb-4 flex-grow ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>{intent.description}</p>
                                        
                                        {/* Engine Preview */}
                                        <div className={`pt-3 border-t ${isSelected ? 'border-slate-700' : 'border-slate-100'}`}>
                                            <p className={`text-[9px] uppercase font-bold mb-2 ${isSelected ? 'text-slate-500' : 'text-slate-400'}`}>Active Engines</p>
                                            <div className="flex flex-wrap gap-1">
                                                {intent.recommendedModules.slice(0,3).map(m => (
                                                    <span key={m} className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                                        {MODULE_NAME_MAP[m]?.split(' ')[0]}
                                                    </span>
                                                ))}
                                                {intent.recommendedModules.length > 3 && <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>+{intent.recommendedModules.length - 3}</span>}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Architecture Preview */}
                        <div className="bg-white rounded border border-slate-200 shadow-lg overflow-hidden">
                            <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Layers className="w-5 h-5 text-slate-700" />
                                        Mission Architecture
                                    </h3>
                                    <p className="text-sm text-slate-500">Visualizing the integrated intelligence workflow.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Engines:</span>
                                    <span className="text-sm font-bold bg-slate-900 text-white px-3 py-1 rounded">
                                        {activeEngines.length}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-8 min-h-[200px]">
                                {hasSelected ? (
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                                        {/* Connector Line */}
                                        <div className="hidden md:block absolute top-3.5 left-0 w-full h-0.5 bg-slate-200 z-0"></div>

                                        {['Macro', 'Integrity', 'Expansion', 'Execution'].map((phase, idx) => (
                                            <div key={phase} className="relative z-10">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 bg-white ${enginesByPhase[phase].length > 0 ? 'border-slate-800 text-slate-900' : 'border-slate-200 text-slate-300'}`}>
                                                        {idx + 1}
                                                    </div>
                                                    <h4 className={`font-bold uppercase text-xs tracking-widest ${enginesByPhase[phase].length > 0 ? 'text-slate-900' : 'text-slate-300'}`}>{phase} Phase</h4>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    {enginesByPhase[phase].map(modId => (
                                                        <div key={modId} className="bg-white p-3 rounded border border-slate-200 shadow-sm flex items-center gap-2 text-xs font-medium text-slate-700 animate-fade-in">
                                                            <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                                                            {MODULE_NAME_MAP[modId] || modId}
                                                        </div>
                                                    ))}
                                                    {enginesByPhase[phase].length === 0 && (
                                                        <div className="p-3 rounded border border-dashed border-slate-200 text-xs text-slate-300 italic text-center">
                                                            Inactive
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-slate-300">
                                        <Layers className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p>Select at least one strategic intent above to generate the mission architecture.</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex justify-end">
                                 <button 
                                    onClick={handleProceedToCanvas}
                                    disabled={!hasSelected}
                                    className="group relative px-8 py-4 bg-slate-900 text-white font-bold text-sm tracking-widest uppercase rounded hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3"
                                >
                                    Initialize Strategic Canvas
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // STAGE 3: STRATEGIC CANVAS
    return (
        <div className="flex h-full w-full bg-slate-100 overflow-hidden">
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <StrategicCanvas 
                    params={params}
                    onParamsChange={onParamsChange}
                    onBack={() => setStage('intent')}
                />
            </div>
            {/* Persistent AI Co-Pilot */}
            <div className="w-80 flex-shrink-0 hidden xl:block bg-white border-l border-slate-200 shadow-lg z-20">
                <Inquire params={params} />
            </div>
        </div>
    );
};

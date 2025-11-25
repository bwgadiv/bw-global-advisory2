
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { ReportParameters, UserProfile as UserProfileType, ReportSuggestions } from '../types.ts';
import { getDynamicScopeSuggestions } from '../services/nexusService.ts';
import { REGIONS_AND_COUNTRIES, INDUSTRIES, AI_PERSONAS, TIERS_BY_ORG_TYPE, GLOBAL_CITY_DATABASE, STEP_3_LABELS } from '../constants.tsx';
import Inquire from './Inquire.tsx';
import { Settings, Layers, Zap, BrainCircuit, Users, TrendingUp, Target, GlobeIcon, ShieldCheck, ActivityIcon, FileText } from './Icons.tsx';
import { ProfileStep } from './ProfileStep.tsx';
import { ManualEntrySelect } from './ManualEntrySelect.tsx';
import PredictiveGrowthModel from './PredictiveGrowthModel.tsx';
import AlternativeLocationMatcher from './AlternativeLocationMatcher.tsx';
import DueDiligenceSuite from './DueDiligenceSuite.tsx';
import PartnerIntelligenceDashboard from './PartnerIntelligenceDashboard.tsx';
import RelationshipBuilder from './RelationshipBuilder.tsx';
import RegionalComfortIndex from './RegionalComfortIndex.tsx';
import StakeholderPerspectiveModule from './StakeholderPerspectiveModule.tsx';
import { ReviewStep } from './ReviewStep.tsx';
import QualityAnalysis from './QualityAnalysis.tsx';
import { TradeDisruptionWidget } from './TradeDisruptionAnalyzer.tsx'; 
import RROIDiagnosticStep from './RROIDiagnosticStep.tsx';
import SEAMEcosystemStep from './SEAMEcosystemStep.tsx';
import { SymbioticMatchmaking } from './SymbioticMatchmaking.tsx';
import { DeepReasoningEngine } from './DeepReasoningEngine.tsx';
import GeopoliticalAnalysisStep from './GeopoliticalAnalysisStep.tsx';
import GovernanceAuditStep from './GovernanceAuditStep.tsx';

interface ReportGeneratorProps {
    params: ReportParameters;
    onParamsChange: (params: ReportParameters) => void;
    onReportUpdate: (params: ReportParameters, content: string, error: string | null, generating: boolean) => void;
    onProfileUpdate: (profile: UserProfileType) => void;
    isGenerating: boolean; 
    onApplySuggestions: (suggestions: ReportSuggestions) => void;
    savedReports: ReportParameters[];
    onSaveReport: (params: ReportParameters) => void;
    onLoadReport: (params: ReportParameters) => void;
    onDeleteReport: (reportName: string) => void;
    onScopeComplete: () => void;
}

// --- REVISED PHASES: Strategic Consultancy / Agency Model ---
const PHASES = [
    {
        id: 'phase-1',
        title: 'Mission Protocol',
        description: 'Identity, Clearance & Agency Allocation',
        icon: Settings,
        steps: [1, 4] 
    },
    {
        id: 'phase-2',
        title: 'Macro-Strategic Intelligence',
        description: 'Geopolitics, Market Readiness & Regional Comfort',
        icon: GlobeIcon,
        steps: [2, 3, 100, 13, 10] // 100=Geo, 13=RROI, 10=Comfort
    },
    {
        id: 'phase-3',
        title: 'Institutional Integrity',
        description: 'Governance Audit & Compliance Diagnostics',
        icon: ShieldCheck,
        steps: [101, 5] // 101=Governance, 5=Due Diligence
    },
    {
        id: 'phase-4',
        title: 'Symbiotic Expansion',
        description: 'Matchmaking, Ecosystems & Deep Reasoning',
        icon: BrainCircuit,
        steps: [15, 14, 6, 16, 99, 8, 11]
    },
    {
        id: 'phase-5',
        title: 'Execution Directives',
        description: 'Roadmap, Stakeholders & Final Output',
        icon: FileText, 
        steps: [9, 7, 12] 
    }
];

// Updated Metadata to reflect the Agency Capability
const STEP_METADATA: Record<number, { title: string, description: string }> = {
    1: { title: "Organization Profile & Setup", description: "Establish your entity profile to calibrate the Nexus AI." },
    4: { title: "Matchmaking Intelligence Depth", description: "Select the depth of the symbiotic search engine (Scout vs. Deep Architecture)." },
    2: { title: "Market & AI Team Allocation", description: "Define target region and deploy specialized AI analyst teams." },
    3: { title: "Strategic Objectives", description: "Articulate specific goals to guide the reasoning engines." },
    100: { title: "Geopolitical & Economic Forecast", description: "Real-time analysis of political stability, currency risk, and economic outlook." },
    13: { title: "RROI Diagnostic", description: "Regional Readiness & Opportunity Index evaluation." },
    10: { title: "Regional Comfort Index", description: "Operational comfort, safety, and cultural readiness assessment." },
    101: { title: "Governance Integrity Audit", description: "Deep-dive compliance check, corruption risk analysis, and regulatory friction testing." },
    5: { title: "Due Diligence Suite", description: "Automated risk vetting and background verification." },
    15: { title: "Symbiotic Discovery Engine", description: "Identify high-leverage, asymmetric partnership opportunities." },
    14: { title: "Ecosystem Mapping (SEAM)", description: "Visualize the broader strategic value chain." },
    6: { title: "Partner Intelligence", description: "Detailed capability analysis of potential partners." },
    16: { title: "Critical Reasoning Engine", description: "Adversarial 'Deal Killer' logic to validate strategy." },
    99: { title: "Trade Simulation", description: "Simulate tariff impacts and geopolitical disruptions." },
    8: { title: "Predictive Growth Modeling", description: "Forward-looking economic scenario generation." },
    11: { title: "Location Alternatives", description: "Comparative analysis of alternative jurisdictions." },
    9: { title: "Stakeholder Analysis", description: "Map influence and analyze stakeholder perspectives." },
    7: { title: "Relationship Strategy", description: "Culturally attuned engagement and communication planning." },
    12: { title: "Final Intelligence Output", description: "Synthesize all intelligence into a strategic directive." }
};

// --- COMPONENTS ---

const WizardStepContent = React.memo((props: any) => {
    const {
        stepId, params, handleChange, onParamsChange, handleMultiSelectToggle, targetRegion, setTargetRegion, targetCountry, setTargetCountry,
        isManualIndustry, setIsManualIndustry, relevantIndustries, inputStyles, labelStyles, currentTiers, step3Labels,
        suggestedObjectives, suggestedPartners, loadingSuggestions, savedReports, onSaveReport, onLoadReport, onDeleteReport
    } = props;

    const stepInfo = STEP_METADATA[stepId] || { title: "Analysis Step", description: "Proceed with analysis." };

    // Filter Personas based on Org Type AND Industry (Step 2 Logic)
    const relevantPersonas = AI_PERSONAS.filter(persona => {
        const orgMatch = !persona.applicableOrgs || persona.applicableOrgs.includes(params.organizationType);
        let industryMatch = true;
        const selectedIndustryTitle = params.industry.length > 0 
            ? INDUSTRIES.find(i => i.id === params.industry[0])?.title 
            : null;

        if (selectedIndustryTitle && persona.applicableIndustries && persona.applicableIndustries.length > 0) {
            industryMatch = persona.applicableIndustries.includes(selectedIndustryTitle);
        }
        return orgMatch;
    });

    const selectedIndustryTitle = params.industry.length > 0 
            ? INDUSTRIES.find(i => i.id === params.industry[0])?.title 
            : null;

    switch (stepId) {
        // --- PHASE 1: MISSION PROTOCOL ---
        case 1: return (
            <div className="space-y-8 animate-fade-in">
                <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                    <div className="mb-6 border-b border-gray-100 pb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-black" /> {stepInfo.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{stepInfo.description}</p>
                    </div>
                    
                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 mb-8">
                        <label className="block text-sm font-bold text-indigo-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4" /> Analyst Experience Level
                        </label>
                        <p className="text-xs text-indigo-700 mb-4">Calibrate the Nexus AI complexity.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { id: 'novice', label: 'Novice', desc: 'I need guidance.' }, 
                                { id: 'experienced', label: 'Experienced', desc: 'Collaborate with me.' }, 
                                { id: 'expert', label: 'Expert', desc: 'Raw data & advanced tools.' }
                            ].map((level) => (
                                <button key={level.id} onClick={() => handleChange('skillLevel', level.id)} className={`p-4 rounded-xl border-2 text-left transition-all ${params.skillLevel === level.id ? 'border-indigo-600 bg-white shadow-md ring-1 ring-indigo-600' : 'border-indigo-200 hover:border-indigo-400 bg-white/50 text-indigo-900'}`}>
                                    <div className={`font-bold text-base mb-1 ${params.skillLevel === level.id ? 'text-indigo-900' : 'text-indigo-800'}`}>{level.label}</div>
                                    <div className="text-xs text-indigo-600">{level.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <ProfileStep 
                        params={params} 
                        handleChange={handleChange}
                        onParamsChange={onParamsChange}
                        inputStyles={inputStyles} 
                        labelStyles={labelStyles}
                        savedReports={savedReports}
                        onSave={onSaveReport}
                        onLoad={onLoadReport}
                        onDelete={onDeleteReport}
                    />
                </div>
            </div>
        );
        case 4: return (
            <div className="space-y-6 animate-fade-in">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="mb-6 border-b border-gray-100 pb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-black" /> {stepInfo.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{stepInfo.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                        {currentTiers.map((tier: any) => (
                            <label key={tier.id} className={`block p-6 rounded-xl border-2 cursor-pointer transition-all relative overflow-hidden group ${params.tier.includes(tier.id) ? 'border-black bg-gray-50 shadow-md' : 'border-gray-100 hover:border-gray-300 bg-white'}`}>
                                <div className="flex justify-between items-start mb-2 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${params.tier.includes(tier.id) ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            <Target className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="font-bold text-lg text-gray-900 block leading-tight">{tier.title}</span>
                                            {tier.agents && (
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full inline-block mt-1">
                                                    {tier.agents} Allocation
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <input type="checkbox" checked={params.tier.includes(tier.id)} onChange={() => handleMultiSelectToggle('tier', tier.id)} className="h-6 w-6 accent-black rounded-full" />
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed pl-14 relative z-10 max-w-2xl">{tier.desc}</p>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        );

        // --- PHASE 2: MACRO-STRATEGIC INTELLIGENCE ---
        case 2: return (
            <div className="space-y-8 animate-fade-in">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="mb-6 border-b border-gray-100 pb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-black" /> {stepInfo.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{stepInfo.description}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className={labelStyles}>Target Region</label>
                            <select value={targetRegion} onChange={e => { setTargetRegion(e.target.value); if (e.target.value.includes("Global")) setTargetCountry("All Regions"); else setTargetCountry(''); }} className={inputStyles}>
                                <option value="">Select Region</option>
                                {REGIONS_AND_COUNTRIES.map(region => <option key={region.name} value={region.name}>{region.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className={labelStyles}>Specific Jurisdiction</label>
                            <select value={targetCountry} onChange={e => { setTargetCountry(e.target.value); handleChange('region', `${e.target.value}, ${targetRegion}`); }} disabled={!targetRegion} className={inputStyles}>
                                <option value="">Select Jurisdiction</option>
                                {REGIONS_AND_COUNTRIES.find(r => r.name === targetRegion)?.countries.map(country => <option key={country} value={country}>{country}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200 mb-6">
                        <label className={labelStyles}>Sector Focus</label>
                        <ManualEntrySelect
                            label="Industry"
                            options={relevantIndustries}
                            value={params.industry.length > 0 && !isManualIndustry ? INDUSTRIES.find(i => i.id === params.industry[0]) : undefined}
                            onSelect={(option) => handleChange('industry', [option.id])}
                            onManualChange={(value) => handleChange('customIndustry', value)}
                            isManual={isManualIndustry}
                            setIsManual={setIsManualIndustry}
                            manualValue={params.customIndustry || ''}
                            displayKey="title"
                            valueKey="id"
                        />
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <h4 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2"><Users className="w-5 h-5 text-gray-800"/> AI Analyst Team Allocation</h4>
                        <p className="text-xs text-gray-500 mb-4">Agents assigned based on your sector.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {relevantPersonas.map((persona: any) => {
                                const Icon = persona.icon;
                                const isRecommended = selectedIndustryTitle && persona.applicableIndustries && persona.applicableIndustries.includes(selectedIndustryTitle);
                                
                                return (
                                <button key={persona.id} onClick={() => handleMultiSelectToggle('aiPersona', persona.id)} className={`p-3 rounded-lg border text-left transition-all flex items-start gap-3 ${params.aiPersona.includes(persona.id) ? 'border-black bg-gray-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50 bg-white'} ${isRecommended ? 'ring-1 ring-green-400 bg-green-50/30' : ''}`}>
                                    <div className={`p-2 rounded-md ${params.aiPersona.includes(persona.id) ? 'bg-white' : 'bg-gray-100'}`}>
                                        <Icon className={`w-5 h-5 ${params.aiPersona.includes(persona.id) ? 'text-black' : 'text-gray-400'}`} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                                            {persona.title}
                                            {isRecommended && <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-bold">Recommended</span>}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5">{persona.description}</p>
                                    </div>
                                </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
        case 3: return (
            <div className="space-y-6 animate-fade-in">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="mb-6 border-b border-gray-100 pb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-black" /> {stepInfo.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{stepInfo.description}</p>
                    </div>
                    <div>
                        <label className={labelStyles}>{step3Labels.valueProp}</label>
                        <textarea value={params.valueProposition} onChange={e => handleChange('valueProposition', e.target.value)} rows={3} className={inputStyles} placeholder="Unique value proposition..." />
                    </div>
                    <div className="mt-4">
                        <label className={labelStyles}>{step3Labels.objective}</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {loadingSuggestions ? <span className="text-xs text-black animate-pulse">AI Analyzing...</span> : 
                                suggestedObjectives.map((obj: string, i: number) => (
                                <button key={i} onClick={() => handleChange('problemStatement', obj)} className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 border border-gray-300 transition-colors">+ {obj}</button>
                                ))
                            }
                        </div>
                        <textarea value={params.problemStatement} onChange={e => handleChange('problemStatement', e.target.value)} rows={4} className={inputStyles} />
                    </div>
                    <QualityAnalysis params={params} />
                </div>
            </div>
        );
        case 100: return <GeopoliticalAnalysisStep params={params} />;
        case 13: return <RROIDiagnosticStep params={params} />;
        case 10: return <RegionalComfortIndex region={targetRegion} country={targetCountry} />;

        // --- PHASE 3: INSTITUTIONAL INTEGRITY ---
        case 101: return <GovernanceAuditStep params={params} />;
        case 5: return <DueDiligenceSuite partnerName={params.idealPartnerProfile} partnerType="Organization" />;

        // --- PHASE 4: SYMBIOTIC EXPANSION ---
        case 15: return <SymbioticMatchmaking params={params} onPartnerSelect={(partner) => handleChange('idealPartnerProfile', partner.entityName)} />;
        case 14: return <SEAMEcosystemStep params={params} />;
        case 6: return <PartnerIntelligenceDashboard params={params} />;
        case 16: return <DeepReasoningEngine userOrg={params.organizationType} targetEntity={params.idealPartnerProfile || "Target Partner"} context={params.problemStatement} />;
        case 99: return (
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl text-gray-900 border border-gray-300 shadow-sm">
                    <h3 className="text-xl font-bold mb-2">Strategic Simulation Engine</h3>
                    <p className="text-gray-600 text-sm mb-6">Model tariff impacts, trade disruptions, and economic shifts in real-time.</p>
                    <TradeDisruptionWidget mode="simulator" />
                </div>
            </div>
        );
        case 8: return <PredictiveGrowthModel location={GLOBAL_CITY_DATABASE[targetCountry]} timeHorizon={5} onModelComplete={() => {}} />;
        case 11: return <AlternativeLocationMatcher originalLocation={GLOBAL_CITY_DATABASE[targetCountry]} requirements={{}} />;

        // --- PHASE 5: EXECUTION DIRECTIVES ---
        case 9: return <StakeholderPerspectiveModule selectedPerspectives={params.stakeholderPerspectives || []} onPerspectiveChange={(val) => handleChange('stakeholderPerspectives', val)} primaryObjective={params.problemStatement} />;
        case 7: return <RelationshipBuilder partnerName={params.idealPartnerProfile} partnerType="org" />;
        case 12: return <ReviewStep params={params} />;
        
        default: return null;
    }
});

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
    params,
    onParamsChange,
    savedReports,
    onSaveReport,
    onLoadReport,
    onDeleteReport
}) => {
    const [activePhaseId, setActivePhaseId] = useState('phase-1');
    const [activeStepIndex, setActiveStepIndex] = useState(0); 
    
    const [targetRegion, setTargetRegion] = useState('');
    const [targetCountry, setTargetCountry] = useState('');
    const [isManualIndustry, setIsManualIndustry] = useState(false);
    const [suggestedObjectives, setSuggestedObjectives] = useState<string[]>([]);
    const [suggestedPartners, setSuggestedPartners] = useState<string[]>([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (params.reportName && params.region) {
            const parts = params.region.split(', ');
            if (parts.length > 1) {
                setTargetCountry(parts[0]);
                setTargetRegion(parts[1]);
            } else {
                setTargetRegion(params.region);
            }
        }
    }, [params.reportName]);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [activePhaseId, activeStepIndex]);

    const currentPhaseIndex = PHASES.findIndex(p => p.id === activePhaseId);
    const currentPhase = PHASES[currentPhaseIndex];
    const currentStepId = currentPhase.steps[activeStepIndex];

    const inputStyles = "w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm text-gray-900 shadow-sm placeholder-gray-400";
    const labelStyles = "block text-sm font-bold text-gray-800 mb-2 tracking-wide";

    const handleChange = useCallback((field: keyof ReportParameters, value: any) => {
        onParamsChange({ ...params, [field]: value });
    }, [params, onParamsChange]);

    const handleMultiSelectToggle = useCallback((field: keyof ReportParameters, value: string) => {
        const currentValues = params[field] as string[] || [];
        const newValues = currentValues.includes(value) ? currentValues.filter(v => v !== value) : [...currentValues, value];
        if (newValues.length === 0 && (params[field] as string[]).length > 0) return; 
        onParamsChange({ ...params, [field]: newValues });
    }, [params, onParamsChange]);

    useEffect(() => {
        if (currentStepId === 3 && params.region && params.industry.length > 0 && suggestedObjectives.length === 0) {
             setLoadingSuggestions(true);
             getDynamicScopeSuggestions(params.region, targetCountry, params.industry[0], params.organizationType)
                .then(data => {
                    setSuggestedObjectives(data.objectives);
                    setSuggestedPartners(data.partners);
                    setLoadingSuggestions(false);
                });
        }
    }, [currentStepId, params.region, targetCountry, params.industry, params.organizationType, suggestedObjectives.length]);

    const handleNext = () => {
        if (activeStepIndex < currentPhase.steps.length - 1) {
            setActiveStepIndex(prev => prev + 1);
        } else if (currentPhaseIndex < PHASES.length - 1) {
            setActivePhaseId(PHASES[currentPhaseIndex + 1].id);
            setActiveStepIndex(0);
        }
    };

    const handleBack = () => {
        if (activeStepIndex > 0) {
            setActiveStepIndex(prev => prev - 1);
        } else if (currentPhaseIndex > 0) {
            const prevPhase = PHASES[currentPhaseIndex - 1];
            setActivePhaseId(prevPhase.id);
            setActiveStepIndex(prevPhase.steps.length - 1);
        }
    };

    const handleReset = () => {
        setActivePhaseId('phase-1');
        setActiveStepIndex(0);
    };

    const currentTiers = TIERS_BY_ORG_TYPE[params.organizationType] || TIERS_BY_ORG_TYPE['Default'] || [];
    const step3Labels = STEP_3_LABELS[params.organizationType] || STEP_3_LABELS['Default'];
    const relevantIndustries = INDUSTRIES; 

    const showMetrics = params.opportunityScore && params.opportunityScore.totalScore > 0;

    return (
        <div className="flex gap-8 items-start h-[calc(100vh-100px)] bg-gray-50 text-gray-900">
            
            {/* Phase Navigation (Left Rail) */}
            <div className="w-64 flex-shrink-0 space-y-4 hidden lg:block">
                {PHASES.map((phase, idx) => {
                    const isActive = phase.id === activePhaseId;
                    const isPast = idx < currentPhaseIndex;
                    const Icon = phase.icon;
                    
                    return (
                        <div key={phase.id} className={`relative p-4 rounded-xl border transition-all duration-300 ${isActive ? 'bg-white border-black shadow-md' : 'bg-transparent border-transparent opacity-60'}`}>
                            <div className="flex items-center gap-3 mb-1">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-black text-white' : isPast ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                                    {isPast ? '✓' : <Icon className="w-4 h-4" />}
                                </div>
                                <h3 className={`font-bold text-sm ${isActive ? 'text-black' : 'text-gray-500'}`}>{phase.title}</h3>
                            </div>
                            <p className="text-xs text-gray-500 pl-11">{phase.description}</p>
                            {idx < PHASES.length - 1 && (
                                <div className="absolute left-8 top-14 bottom-0 w-px bg-gray-300 -ml-0.5 h-6" />
                            )}
                        </div>
                    );
                })}
                <button onClick={handleReset} className="mt-8 ml-4 text-xs text-gray-500 hover:text-black transition-colors">
                    ⟲ Reset Workflow
                </button>
            </div>

            {/* Main Content Card */}
            <div className="flex-grow flex flex-col h-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                
                <header className="px-8 py-6 border-b border-gray-200 bg-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{currentPhase.title}</h2>
                        <p className="text-sm text-gray-500 mt-1">Step {activeStepIndex + 1} of {currentPhase.steps.length}: {currentPhase.description}</p>
                    </div>
                    
                    {showMetrics && (
                        <div className="hidden md:flex items-center gap-4 animate-fade-in">
                            <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Readiness</span>
                                <span className="text-lg font-bold text-green-600">Calculated</span>
                            </div>
                            <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Nexus Score</span>
                                <span className="text-lg font-bold text-blue-600">{params.opportunityScore?.totalScore || 0}</span>
                            </div>
                        </div>
                    )}
                </header>

                <div ref={scrollContainerRef} className="flex-grow overflow-y-auto p-8 bg-gray-50">
                    <div className="max-w-4xl mx-auto">
                        <WizardStepContent
                            stepId={currentStepId}
                            params={params}
                            handleChange={handleChange}
                            onParamsChange={onParamsChange}
                            handleMultiSelectToggle={handleMultiSelectToggle}
                            targetRegion={targetRegion}
                            setTargetRegion={setTargetRegion}
                            targetCountry={targetCountry}
                            setTargetCountry={setTargetCountry}
                            isManualIndustry={isManualIndustry}
                            setIsManualIndustry={setIsManualIndustry}
                            relevantIndustries={relevantIndustries}
                            inputStyles={inputStyles}
                            labelStyles={labelStyles}
                            currentTiers={currentTiers}
                            step3Labels={step3Labels}
                            suggestedObjectives={suggestedObjectives}
                            suggestedPartners={suggestedPartners}
                            loadingSuggestions={loadingSuggestions}
                            savedReports={savedReports}
                            onSaveReport={onSaveReport}
                            onLoadReport={onLoadReport}
                            onDeleteReport={onDeleteReport}
                        />
                    </div>
                </div>

                <footer className="px-8 py-4 border-t border-gray-200 bg-white flex justify-between items-center">
                    <button 
                        onClick={handleBack} 
                        disabled={currentPhaseIndex === 0 && activeStepIndex === 0}
                        className="px-6 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Back
                    </button>
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={handleNext}
                            className="px-8 py-2.5 rounded-lg bg-black text-white font-bold hover:bg-gray-800 shadow-md transition-all transform hover:-translate-y-0.5"
                        >
                            {currentPhaseIndex === PHASES.length - 1 && activeStepIndex === currentPhase.steps.length - 1 ? 'Generate Final Report' : 'Continue'}
                        </button>
                    </div>
                </footer>
            </div>
            
            <div className="w-80 flex-shrink-0 hidden xl:block bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-full">
                <Inquire params={params} />
            </div>
        </div>
    );
};

export default ReportGenerator;

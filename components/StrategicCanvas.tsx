
import React, { useState, useMemo } from 'react';
import type { ReportParameters, CanvasModule } from '../types';
import { STRATEGIC_INTENTS } from '../constants';
import { generateFastSuggestion } from '../services/nexusService';
import { 
    GlobeIcon, BrainCircuit, ShieldCheck, 
    TrendingUp, Users, Settings, FileText, 
    Target, Zap, MatchMakerIcon, CheckCircle,
    ActivityIcon, BarChart, RocketIcon
} from './Icons';

// Import all module components
import RROIDiagnosticStep from './RROIDiagnosticStep';
import SEAMEcosystemStep from './SEAMEcosystemStep';
import RegionalComfortIndex from './RegionalComfortIndex';
import GeopoliticalAnalysisStep from './GeopoliticalAnalysisStep';
import GovernanceAuditStep from './GovernanceAuditStep';
import DueDiligenceSuite from './DueDiligenceSuite';
import { SymbioticMatchmaking } from './SymbioticMatchmaking';
import PartnerIntelligenceDashboard from './PartnerIntelligenceDashboard';
import { DeepReasoningEngine } from './DeepReasoningEngine';
import { TradeDisruptionWidget } from './TradeDisruptionAnalyzer';
import PredictiveGrowthModel from './PredictiveGrowthModel';
import AlternativeLocationMatcher from './AlternativeLocationMatcher';
import StakeholderPerspectiveModule from './StakeholderPerspectiveModule';
import RelationshipBuilder from './RelationshipBuilder';
import { ReviewStep } from './ReviewStep';
import CulturalIntelligenceModule from './CulturalIntelligenceModule';
import MatchmakingEngine from './MatchmakingEngine';
import NegotiationAdvantageEngine from './NegotiationAdvantageEngine';
import MathematicalModelsEngine from './MathematicalModelsEngine';
import RocketEngineModule from './RocketEngineModule';
import { GLOBAL_CITY_DATABASE } from '../constants';

interface StrategicCanvasProps {
    params: ReportParameters;
    onParamsChange: (params: ReportParameters) => void;
    onBack: () => void;
}

// --- MODULE REGISTRY ---
// Maps IDs to Components and metadata
const MODULE_REGISTRY: Record<string, CanvasModule> = {
    // Phase 2: Macro-Strategic
    'geopolitics': { id: 'geopolitics', title: 'Geopolitical & Economic Forecast', icon: GlobeIcon, component: GeopoliticalAnalysisStep, status: 'inactive', phase: 'Macro-Strategy' },
    'rroi': { id: 'rroi', title: 'RROI Diagnostic', icon: TrendingUp, component: RROIDiagnosticStep, status: 'inactive', phase: 'Macro-Strategy' },
    'comfort_index': { id: 'comfort_index', title: 'Regional Comfort Index', icon: ShieldCheck, component: RegionalComfortIndex, status: 'inactive', phase: 'Macro-Strategy' },
    'math_models': { id: 'math_models', title: 'Mathematical Economic Models', icon: BarChart, component: MathematicalModelsEngine, status: 'inactive', phase: 'Macro-Strategy' },
    'rocket_engine': { id: 'rocket_engine', title: 'Nexus Rocket Engine (LAI/IVAS/SCF)', icon: RocketIcon, component: RocketEngineModule, status: 'inactive', phase: 'Macro-Strategy' },
    
    // Phase 3: Integrity
    'governance_audit': { id: 'governance_audit', title: 'Governance Integrity Audit', icon: FileText, component: GovernanceAuditStep, status: 'inactive', phase: 'Integrity' },
    'due_diligence': { id: 'due_diligence', title: 'Due Diligence Suite', icon: ShieldCheck, component: DueDiligenceSuite, status: 'inactive', phase: 'Integrity' },
    
    // Phase 4: Expansion
    'symbiotic_matchmaking': { id: 'symbiotic_matchmaking', title: 'Symbiotic Discovery', icon: MatchMakerIcon, component: SymbioticMatchmaking, status: 'inactive', phase: 'Expansion' },
    'matchmaking_engine': { id: 'matchmaking_engine', title: 'Global Matchmaking Engine', icon: Target, component: MatchmakingEngine, status: 'inactive', phase: 'Expansion' },
    'seam': { id: 'seam', title: 'Ecosystem Mapping (SEAM)', icon: Users, component: SEAMEcosystemStep, status: 'inactive', phase: 'Expansion' },
    'partner_intel': { id: 'partner_intel', title: 'Partner Intelligence', icon: Target, component: PartnerIntelligenceDashboard, status: 'inactive', phase: 'Expansion' },
    'deep_reasoning': { id: 'deep_reasoning', title: 'Deep Reasoning Engine', icon: BrainCircuit, component: DeepReasoningEngine, status: 'inactive', phase: 'Expansion' },
    'trade_disruption': { id: 'trade_disruption', title: 'Trade Simulation', icon: ActivityIcon, component: TradeDisruptionWidget, status: 'inactive', phase: 'Expansion' },
    'predictive_growth': { id: 'predictive_growth', title: 'Predictive Growth Model', icon: TrendingUp, component: PredictiveGrowthModel, status: 'inactive', phase: 'Expansion' },
    'alternative_locations': { id: 'alternative_locations', title: 'Location Alternatives', icon: GlobeIcon, component: AlternativeLocationMatcher, status: 'inactive', phase: 'Expansion' },
    
    // Phase 5: Execution
    'cultural_intel': { id: 'cultural_intel', title: 'Cultural Intelligence Brief', icon: GlobeIcon, component: CulturalIntelligenceModule, status: 'inactive', phase: 'Execution' },
    'negotiation_advantage': { id: 'negotiation_advantage', title: 'Negotiation Advantage', icon: Users, component: NegotiationAdvantageEngine, status: 'inactive', phase: 'Execution' },
    'stakeholder_analysis': { id: 'stakeholder_analysis', title: 'Stakeholder Analysis', icon: Users, component: StakeholderPerspectiveModule, status: 'inactive', phase: 'Execution' },
    'relationship_builder': { id: 'relationship_builder', title: 'Relationship Strategy', icon: MatchMakerIcon, component: RelationshipBuilder, status: 'inactive', phase: 'Execution' },
    'final_review': { id: 'final_review', title: 'Final Intelligence Output', icon: FileText, component: ReviewStep, status: 'inactive', phase: 'Execution' }
};

export const StrategicCanvas: React.FC<StrategicCanvasProps> = ({
    params,
    onParamsChange,
    onBack
}) => {
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [completedModules, setCompletedModules] = useState<string[]>([]);
    const [canvasModules, setCanvasModules] = useState<CanvasModule[]>([]);

    // Initialize modules based on selected Intent(s) - UPDATED FOR MULTI-SELECT
    useMemo(() => {
        const selectedIds = params.selectedIntents || [];
        
        // Aggregate all recommended modules from all selected intents
        const recommendedSet = new Set<string>();
        
        if (selectedIds.length > 0) {
            selectedIds.forEach(id => {
                const intent = STRATEGIC_INTENTS.find(i => i.id === id);
                if (intent) {
                    intent.recommendedModules.forEach(mod => recommendedSet.add(mod));
                }
            });
        } else {
            // Fallback if nothing selected
            recommendedSet.add('rroi');
            recommendedSet.add('seam');
            recommendedSet.add('partner_intel');
        }

        // Always include core modules
        const baseIds = ['geopolitics', 'final_review'];
        const allIds = Array.from(new Set([...baseIds, ...Array.from(recommendedSet)]));
        
        const initializedModules = allIds.map(id => ({
            ...MODULE_REGISTRY[id],
            status: (recommendedSet.has(id) ? 'recommended' : 'inactive') as CanvasModule['status']
        }));
        
        // Sort by phase for visual grouping
        const phaseOrder = { 'Macro-Strategy': 1, 'Integrity': 2, 'Expansion': 3, 'Execution': 4 };
        initializedModules.sort((a, b) => phaseOrder[a.phase as keyof typeof phaseOrder] - phaseOrder[b.phase as keyof typeof phaseOrder]);

        setCanvasModules(initializedModules);
    }, [params.selectedIntents, params.selectedIntent]);

    const handleModuleClick = (moduleId: string) => {
        setActiveModuleId(moduleId);
    };

    const handleModuleComplete = (moduleId: string) => {
        if (!completedModules.includes(moduleId)) {
            setCompletedModules([...completedModules, moduleId]);
        }
    };

    const renderActiveModule = () => {
        if (!activeModuleId) return null;
        
        const mod = MODULE_REGISTRY[activeModuleId];
        const Component = mod.component;
        
        // Prop mapping for different components
        const commonProps = { params };
        
        // Specific props mapping
        let specificProps = {};
        if (activeModuleId === 'comfort_index') {
            const regionParts = params.region.split(', ');
            specificProps = { region: regionParts[1] || params.region, country: regionParts[0] || '' };
        } else if (activeModuleId === 'due_diligence') {
            specificProps = { partnerName: params.idealPartnerProfile, partnerType: "Organization" };
        } else if (activeModuleId === 'symbiotic_matchmaking') {
            specificProps = { onPartnerSelect: (p: any) => onParamsChange({...params, idealPartnerProfile: p.entityName}) };
        } else if (activeModuleId === 'matchmaking_engine') {
            specificProps = { 
                params, 
                onMatchesFound: (matches: any) => console.log('Matches found:', matches) 
            };
        } else if (activeModuleId === 'math_models') {
            specificProps = { 
                regionData: { region: params.region?.split(', ')[1] || params.region, country: params.region?.split(', ')[0] },
                industryData: { industry: params.industry },
                onModelResults: (res: any) => console.log('Math model results:', res)
            };
        } else if (activeModuleId === 'cultural_intel') {
            specificProps = { targetCountry: params.region?.split(', ')[0] };
        } else if (activeModuleId === 'negotiation_advantage') {
            specificProps = { 
                params, 
                targetCountry: params.region?.split(', ')[0],
                proposedDeal: { score: 85, benefits: 'Market Access', economicImpact: 'High' } 
            };
        } else if (activeModuleId === 'deep_reasoning') {
            specificProps = { userOrg: params.organizationType, targetEntity: params.idealPartnerProfile, context: params.problemStatement };
        } else if (activeModuleId === 'trade_disruption') {
            specificProps = { mode: 'simulator' };
        } else if (activeModuleId === 'predictive_growth') {
            const country = params.region.split(', ')[0];
            specificProps = { location: GLOBAL_CITY_DATABASE[country] || { city: country, country: country }, timeHorizon: 5, onModelComplete: () => handleModuleComplete(activeModuleId) };
        } else if (activeModuleId === 'alternative_locations') {
            const country = params.region.split(', ')[0];
            specificProps = { originalLocation: GLOBAL_CITY_DATABASE[country], requirements: {} };
        } else if (activeModuleId === 'stakeholder_analysis') {
            specificProps = { selectedPerspectives: params.stakeholderPerspectives || [], onPerspectiveChange: (val: any) => onParamsChange({...params, stakeholderPerspectives: val}), primaryObjective: params.problemStatement };
        } else if (activeModuleId === 'relationship_builder') {
            specificProps = { partnerName: params.idealPartnerProfile, partnerType: 'org' };
        } else if (activeModuleId === 'rocket_engine') {
            specificProps = {};
        } else if (activeModuleId === 'final_review') {
            specificProps = {};
        }

        return (
            <div className="animate-fade-in h-full flex flex-col">
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 text-white rounded-lg">
                            <mod.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{mod.title}</h2>
                            <p className="text-sm text-gray-500">{mod.phase} Phase</p>
                        </div>
                    </div>
                    <button onClick={() => setActiveModuleId(null)} className="text-sm text-gray-500 hover:text-slate-900">
                        Close Module ✕
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto pr-2">
                    <Component {...commonProps} {...specificProps} />
                </div>
            </div>
        );
    };

    const phases = ['Macro-Strategy', 'Integrity', 'Expansion', 'Execution'];

    return (
        <div className="flex h-full bg-slate-50 overflow-hidden flex-col">
            {activeModuleId ? (
                <div className="flex-1 p-6 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden m-6">
                    {renderActiveModule()}
                </div>
            ) : (
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-8 py-6 bg-white border-b border-gray-200 flex justify-between items-center flex-shrink-0">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Strategic Intelligence Canvas</h2>
                            <p className="text-sm text-gray-500 mt-1">Activated Mission Modules for {params.reportName || 'Untitled Project'}</p>
                        </div>
                        <button onClick={onBack} className="text-sm font-bold text-slate-600 hover:text-slate-900">
                            ← Back to Strategy
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto p-8">
                        <div className="grid gap-8">
                            {phases.map(phase => {
                                const phaseModules = canvasModules.filter(m => m.phase === phase);
                                if (phaseModules.length === 0) return null;

                                return (
                                    <div key={phase} className="animate-fade-in">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="h-px flex-grow bg-gray-200"></div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{phase}</span>
                                            <div className="h-px flex-grow bg-gray-200"></div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {phaseModules.map(mod => (
                                                <button
                                                    key={mod.id}
                                                    onClick={() => handleModuleClick(mod.id)}
                                                    className={`flex flex-col items-start p-6 rounded-xl border-2 transition-all group relative overflow-hidden ${
                                                        completedModules.includes(mod.id) 
                                                        ? 'bg-green-50 border-green-200' 
                                                        : mod.status === 'recommended'
                                                            ? 'bg-white border-indigo-100 hover:border-indigo-600 hover:shadow-lg hover:-translate-y-1'
                                                            : 'bg-gray-50 border-gray-200 opacity-70 hover:opacity-100'
                                                    }`}
                                                >
                                                    {mod.status === 'recommended' && !completedModules.includes(mod.id) && (
                                                        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-600/5 rounded-bl-full -mr-8 -mt-8"></div>
                                                    )}
                                                    
                                                    <div className={`mb-4 p-3 rounded-lg ${
                                                        completedModules.includes(mod.id) ? 'bg-green-100 text-green-700' : 
                                                        mod.status === 'recommended' ? 'bg-slate-900 text-white' : 'bg-gray-200 text-gray-500'
                                                    }`}>
                                                        <mod.icon className="w-6 h-6" />
                                                    </div>
                                                    
                                                    <h3 className={`font-bold text-lg mb-1 text-left ${completedModules.includes(mod.id) ? 'text-green-800' : 'text-slate-900'}`}>
                                                        {mod.title}
                                                    </h3>
                                                    
                                                    {completedModules.includes(mod.id) && (
                                                        <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-bold text-green-600">
                                                            <CheckCircle className="w-4 h-4" /> Analysis Complete
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

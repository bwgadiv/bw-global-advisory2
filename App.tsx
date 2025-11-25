
import React, { useState, useCallback } from 'react';
import { IntelligenceDesignStudio } from './components/IntelligenceDesignStudio';
import Dashboard from './components/Dashboard';
import CommandCenter from './components/CommandCenter';
import { ReportParameters, UserProfile } from './types';
import { NexusLogo, GlobeIcon, LayoutDashboardIcon, ReportIcon } from './components/Icons';
import { LandingPage } from './components/LandingPage';
import useEscapeKey from './hooks/useEscapeKey';

const initialParams: ReportParameters = {
    reportName: '',
    userName: '',
    userDepartment: '',
    organizationType: 'Private Enterprise (MNC)',
    organizationSubType: '',
    userCountry: '',
    userTier: '',
    skillLevel: 'senior',
    region: 'Global',
    industry: [],
    customIndustry: '',
    idealPartnerProfile: '',
    problemStatement: '',
    analysisTimeframe: 'Last 12 Months',
    tier: ['Tier 1'],
    aiPersona: [],
    customAiPersona: '',
    reportId: '',
    createdAt: new Date().toISOString(),
    status: 'draft',
    analyticalModules: [],
    reportLength: 'standard',
    outputFormat: 'report',
    stakeholderPerspectives: [],
    includeCrossSectorMatches: false,
    matchCount: 5,
    partnershipSupportNeeds: [],
    partnerDiscoveryMode: false,
    strategicMode: 'discovery',
    searchScope: 'Regional',
    intentTags: [],
    comparativeContext: [],
    additionalContext: '',
    relationshipStage: 'Initial Outreach',
    dueDiligenceDepth: 'Standard',
    partnerCapabilities: [],
    operationalPriority: 'Balanced',
    riskTolerance: 'Moderate',
    expansionTimeline: '12-18 Months'
};

type ViewMode = 'command-center' | 'intelligence-system' | 'live-feed';

const App: React.FC = () => {
    // DEFAULT VIEW IS NOW THE INTELLIGENCE SYSTEM (GENERATOR)
    const [params, setParams] = useState<ReportParameters>(initialParams);
    const [viewMode, setViewMode] = useState<ViewMode>('intelligence-system');
    const [hasEntered, setHasEntered] = useState(false);
    const [savedReports, setSavedReports] = useState<ReportParameters[]>([]);
    
    // Enable Escape key to return to command center (repository)
    const handleEscape = useCallback(() => {
        if (viewMode !== 'command-center') {
            setViewMode('command-center');
        }
    }, [viewMode]);

    useEscapeKey(handleEscape);

    const handleParamsChange = (newParams: ReportParameters) => {
        setParams(newParams);
    };

    const handleProfileUpdate = (profile: UserProfile) => {
        console.log('Profile Updated:', profile);
    };

    const startNewMission = () => {
        const newReport = {
            ...initialParams, 
            reportId: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString()
        };
        setParams(newReport);
        // Do not auto-save to repository yet, wait for user action
        setViewMode('intelligence-system');
    };

    const loadReport = (report: ReportParameters) => {
        setParams(report);
        setViewMode('intelligence-system');
    };

    if (!hasEntered) {
        return <LandingPage onEnter={() => setHasEntered(true)} />;
    }

    return (
        <div className="h-screen w-full bg-slate-50 font-sans text-slate-900 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 z-50 shadow-sm h-16 flex-shrink-0 flex items-center justify-between px-6">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => setViewMode('intelligence-system')}>
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
                        <NexusLogo className="w-6 h-6 text-slate-800" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 leading-none tracking-tight">BW Global Advisory</h1>
                        <span className="text-xs text-slate-500 font-medium">Intelligence Platform</span>
                    </div>
                </div>

                <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                    {/* REORDERED NAVIGATION: Generator First, My Reports Second */}
                    <button 
                        onClick={() => setViewMode('intelligence-system')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                            viewMode === 'intelligence-system' 
                            ? 'bg-white text-slate-900 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <ReportIcon className="w-4 h-4" />
                        Report Generator
                    </button>
                    <button 
                        onClick={() => setViewMode('command-center')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                            viewMode === 'command-center' 
                            ? 'bg-white text-slate-900 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <LayoutDashboardIcon className="w-4 h-4" />
                        My Reports
                    </button>
                    <button 
                        onClick={() => setViewMode('live-feed')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                            viewMode === 'live-feed' 
                            ? 'bg-white text-slate-900 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <GlobeIcon className="w-4 h-4" />
                        Global Data Hub
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={startNewMission}
                        className="hidden lg:flex items-center gap-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-md transition-colors shadow-sm"
                    >
                        + New Analysis
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="flex-grow w-full overflow-hidden">
                {viewMode === 'command-center' && (
                    <CommandCenter 
                        savedReports={savedReports}
                        onCreateNew={startNewMission}
                        onLoadReport={loadReport}
                        onOpenInstant={() => setViewMode('live-feed')}
                        onOpenSimulator={() => setViewMode('live-feed')}
                    />
                )}
                {viewMode === 'intelligence-system' && (
                    <IntelligenceDesignStudio
                        params={params}
                        onParamsChange={handleParamsChange}
                        onProfileUpdate={handleProfileUpdate}
                    />
                )}
                {viewMode === 'live-feed' && (
                    <div className="h-full overflow-hidden">
                        <Dashboard 
                            onAnalyze={(item) => console.log("Analyzing", item)} 
                            onStartSymbiosis={(ctx) => console.log("Symbiosis", ctx)} 
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;

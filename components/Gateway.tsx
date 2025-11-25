
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ReportParameters, SkillLevel } from '../types';
import { ORGANIZATION_TYPES, ORGANIZATION_SUBTYPES, REGIONS_AND_COUNTRIES, INDUSTRIES, STRATEGIC_OBJECTIVES, STRATEGIC_LENSES, INDUSTRY_NICHES } from '../constants';
import { Zap, BrainCircuit, CheckCircle, GlobeIcon, CloseIcon, MatchMakerIcon, ShieldCheck, Users, FileText, MapPinIcon, Target } from './Icons';

interface GatewayProps {
    params: ReportParameters;
    onUpdate: (params: ReportParameters) => void;
    onComplete: () => void;
}

// --- DYNAMIC BENCHMARK DATABASE ---
const DYNAMIC_BENCHMARKS: Record<string, string[]> = {
    'Technology (Software/Hardware)': [
        "Silicon Valley (USA) - Global Innovation Capital",
        "Tel Aviv (Israel) - Cyber & Startup Ecosystem",
        "Bangalore (India) - IT Outsourcing Hub",
        "Shenzhen (China) - Hardware Innovation",
        "Berlin (Germany) - European Tech Hub",
        "Estonia - Digital Governance Model",
        "Singapore - Smart City Benchmark"
    ],
    'Finance': [
        "London (UK) - Global Fintech Center",
        "New York (USA) - Capital Markets",
        "Singapore - Asian Finance Hub",
        "Zurich (Switzerland) - Banking Stability",
        "Dubai (UAE) - MEA Financial Gateway",
        "Hong Kong - Asian Trade Finance"
    ],
    'Energy (Oil, Gas, Renewable)': [
        "Houston (USA) - Energy Capital",
        "Aberdeen (UK) - Offshore Excellence",
        "Stavanger (Norway) - Energy Transition",
        "Abu Dhabi (UAE) - Renewable & Trad. Energy",
        "Denmark - Wind Energy Hub",
        "Chile (Atacama) - Solar Benchmark"
    ],
    'Healthcare & Pharmaceuticals': [
        "Boston (USA) - Biotech Hub",
        "Basel (Switzerland) - Pharma Capital",
        "Singapore - Biomedical Sciences",
        "Hyderabad (India) - Genome Valley",
        "Oxford (UK) - Life Sciences Cluster"
    ],
    'Agriculture & Agribusiness': [
        "Netherlands (Food Valley) - AgriTech Innovation",
        "California (Central Valley) - High-Yield Farming",
        "Israel - Arid Climate Tech",
        "Brazil (Mato Grosso) - Scale Production",
        "New Zealand - Sustainable Dairy"
    ],
    'Manufacturing (Advanced)': [
        "Shenzhen (China) - Electronics Mfg",
        "Stuttgart (Germany) - Automotive Hub",
        "Tokyo (Japan) - Robotics & Precision",
        "Monterrey (Mexico) - Nearshoring Hub",
        "Detroit (USA) - Mobility Innovation"
    ],
    'Logistics & Transportation': [
        "Singapore - Maritime & Aviation Hub",
        "Rotterdam (Netherlands) - Port Efficiency",
        "Dubai (UAE) - Logistics Gateway",
        "Memphis (USA) - Freight Logistics",
        "Hamburg (Germany) - Trade Logistics"
    ],
    'Default': [
        "Singapore - Global Business Hub",
        "Dubai (UAE) - Trade & Logistics",
        "London (UK) - Financial Center",
        "New York (USA) - Corporate HQ",
        "Estonia - Digital Governance",
        "Silicon Valley (USA) - Tech Innovation",
        "Shanghai (China) - Commerce & Trade"
    ]
};

// Extended Deal Support Checklist
const DEAL_SUPPORT_CATEGORIES = [
    { category: "Government & Policy", options: ["Government Incentives & Grants", "Regulatory & Compliance Frameworks", "Policy Advocacy & Lobbying"] },
    { category: "Financial & Legal", options: ["Banking & Capital Structuring", "Tax Structuring & Optimization", "Legal Entity Formation"] },
    { category: "Operational & Technical", options: ["Technical Implementation Partners", "Site Selection & Land Acquisition", "Workforce & Talent Acquisition", "Supply Chain & Logistics"] }
];

// Strategic Intent Tags
const INTENT_TAGS = [
    "New Market Entry",
    "Relocation / HQ Shift",
    "Expansion (Organic)",
    "Mergers & Acquisitions",
    "Joint Venture / Partnership",
    "Supply Chain Resilience",
    "R&D Collaboration",
    "Investment Attraction"
];

// Partner Capabilities
const PARTNER_CAPABILITIES = [
    "Government Influence", "Distribution Network", "Manufacturing Capacity", 
    "IP / Technology", "Local Brand Equity", "Financial Strength", 
    "Regulatory Licenses", "Logistics Fleet"
];

// Helper for Searchable Multi-Select
const MegaMultiSelect = ({ 
    options, 
    selected, 
    onToggle, 
    label, 
    placeholder 
}: { 
    options: string[], 
    selected: string[], 
    onToggle: (val: string) => void, 
    label: string, 
    placeholder: string 
}) => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filtered = useMemo(() => options.filter(o => o.toLowerCase().includes(search.toLowerCase())), [options, search]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="block text-sm font-bold text-gray-800 mb-1">{label}</label>
            <div className="flex flex-wrap gap-2 mb-2">
                {selected.map(val => (
                    <span key={val} className="px-2 py-1 bg-slate-800 text-white text-xs rounded flex items-center gap-1 shadow-sm">
                        {val} <button onClick={() => onToggle(val)} className="hover:text-red-300 ml-1">×</button>
                    </span>
                ))}
            </div>
            <div className="relative">
                <input 
                    type="text" 
                    value={search}
                    onFocus={() => setIsOpen(true)}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 text-sm shadow-sm"
                    placeholder={placeholder}
                />
                {isOpen && (
                    <div className="absolute z-50 w-full bg-white border border-gray-200 shadow-2xl rounded-lg mt-1 max-h-60 overflow-y-auto flex flex-col">
                        <div className="flex justify-between items-center p-2 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
                            <span className="text-xs font-bold text-gray-500 px-2">{filtered.length} Options</span>
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-200 rounded-full">
                                <CloseIcon className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                        <div className="flex-grow overflow-y-auto">
                            {filtered.slice(0, 100).map(opt => (
                                <button 
                                    key={opt} 
                                    onClick={() => { onToggle(opt); setSearch(''); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex justify-between border-b border-gray-50 last:border-0 ${selected.includes(opt) ? 'bg-blue-50 text-blue-800 font-bold' : 'text-gray-700'}`}
                                >
                                    {opt}
                                    {selected.includes(opt) && <CheckCircle className="w-4 h-4" />}
                                </button>
                            ))}
                            {filtered.length === 0 && <div className="p-3 text-sm text-gray-500">No matches found.</div>}
                        </div>
                        <div className="p-2 border-t border-gray-200 bg-gray-50 sticky bottom-0 z-10">
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="w-full py-2 bg-slate-900 text-white rounded-md text-sm font-bold hover:bg-slate-800 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Gateway: React.FC<GatewayProps> = ({ params, onUpdate, onComplete }) => {
    const [step, setStep] = useState<1 | 2 | 3>(1);

    useEffect(() => {
        const container = document.getElementById('studio-scroll-container');
        if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    const update = (field: keyof ReportParameters, value: any) => {
        onUpdate({ ...params, [field]: value });
    };

    const handleOrgTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({
            ...params,
            organizationType: e.target.value,
            organizationSubType: '',
            customOrganizationType: '',
            customOrganizationSubType: ''
        });
    };

    const toggleArrayItem = (field: keyof ReportParameters, item: string) => {
        const current = (params[field] as string[]) || [];
        const updated = current.includes(item) ? current.filter(i => i !== item) : [...current, item];
        update(field, updated);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            update('uploadedFileName', file.name);
            update('uploadedDocument', true);
        }
    };

    const inputStyles = "w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all text-sm text-gray-900 shadow-sm placeholder-gray-400";
    const labelStyles = "block text-sm font-bold text-gray-800 mb-1 tracking-wide";

    const subTypes = ORGANIZATION_SUBTYPES[params.organizationType] || [];
    const showCustomTypeInput = params.organizationType === 'Custom';
    const showCustomCategoryInput = params.organizationType && (params.organizationSubType === 'Custom' || subTypes.length === 0);

    const allNiches = useMemo(() => {
        const industry = params.industry[0];
        if (industry && INDUSTRY_NICHES[industry]) return INDUSTRY_NICHES[industry];
        return Object.values(INDUSTRY_NICHES).flat();
    }, [params.industry]);

    const allObjectives = useMemo(() => {
        return Object.values(STRATEGIC_OBJECTIVES).flat().map(o => o.label);
    }, []);

    const relevantBenchmarks = useMemo(() => {
        const sector = params.industry[0];
        if (sector && DYNAMIC_BENCHMARKS[sector]) {
            return DYNAMIC_BENCHMARKS[sector];
        }
        return [];
    }, [params.industry]);

    const hasSelectedIndustry = params.industry.length > 0;
    const isCustomHub = params.comparisonHub && !relevantBenchmarks.some(h => h.startsWith(params.comparisonHub || ''));

    useEffect(() => {
        if (!params.strategicMode) update('strategicMode', 'discovery');
    }, []);

    return (
        <div id="gateway-container" className="min-h-full w-full flex flex-col items-center justify-start bg-slate-50 p-6 md:p-12">
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-12">
                
                <div className="bg-slate-900 text-white p-6 px-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Nexus Intelligence Report Generator</h1>
                        <p className="text-slate-400 text-sm">Strategic Configuration & Setup</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-white' : 'bg-slate-700'}`} />
                        <div className={`w-8 h-1 rounded-full ${step >= 2 ? 'bg-white' : 'bg-slate-700'}`} />
                        <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-white' : 'bg-slate-700'}`} />
                        <div className={`w-8 h-1 rounded-full ${step >= 3 ? 'bg-white' : 'bg-slate-700'}`} />
                        <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-white' : 'bg-slate-700'}`} />
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    
                    {/* STEP 1: IDENTITY PROFILE */}
                    {step === 1 && (
                        <div className="animate-fade-in space-y-8">
                            <div className="border-b border-gray-100 pb-6">
                                <h2 className="text-2xl font-bold text-slate-900">Step 1: Organization Identity</h2>
                                <p className="text-slate-500">Establish the identity driving this analysis.</p>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <label className="block text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Your Experience Level</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[{ id: 'novice', label: 'Novice', desc: 'I need guidance.' }, { id: 'experienced', label: 'Experienced', desc: 'Collaborate with me.' }, { id: 'expert', label: 'Expert', desc: 'Give me tools.' }].map((level) => (
                                        <button key={level.id} onClick={() => update('skillLevel', level.id as SkillLevel)} className={`p-4 rounded-xl border-2 text-left transition-all ${params.skillLevel === level.id ? 'border-slate-800 bg-white shadow-md ring-1 ring-slate-800' : 'border-slate-200 hover:border-slate-400 text-slate-600 bg-white'}`}>
                                            <div className={`font-bold text-base mb-1 ${params.skillLevel === level.id ? 'text-slate-900' : 'text-slate-800'}`}>{level.label}</div>
                                            <div className="text-xs text-slate-500">{level.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className={labelStyles}>Organization Type</label>
                                        <select value={params.organizationType} onChange={handleOrgTypeChange} className={inputStyles}>
                                            <option value="">Select Type...</option>
                                            {ORGANIZATION_TYPES.filter(t => t !== 'Other' && t !== 'Custom').map(t => <option key={t} value={t}>{t}</option>)}
                                            <option value="Custom">Other / Custom</option>
                                        </select>
                                        {showCustomTypeInput && <input type="text" value={params.customOrganizationType || ''} onChange={(e) => update('customOrganizationType', e.target.value)} className={`${inputStyles} mt-2 bg-yellow-50`} placeholder="Specify Organization Type..." />}
                                    </div>
                                    <div>
                                        <label className={labelStyles}>Organization Sub-Type</label>
                                        <select value={params.organizationSubType || ''} onChange={e => update('organizationSubType', e.target.value)} className={inputStyles} disabled={!params.organizationType}>
                                            <option value="">Select Structure...</option>
                                            {subTypes.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                            <option value="Custom">Other (Specify)</option>
                                        </select>
                                        {showCustomCategoryInput && <input type="text" value={params.customOrganizationSubType || ''} onChange={(e) => update('customOrganizationSubType', e.target.value)} className={`${inputStyles} mt-2 bg-yellow-50`} placeholder="Specify Structure..." />}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div><label className={labelStyles}>Full Name</label><input type="text" value={params.userName} onChange={e => update('userName', e.target.value)} className={inputStyles} placeholder="e.g. Jane Doe" /></div>
                                    <div><label className={labelStyles}>Role / Title</label><input type="text" value={params.userDepartment} onChange={e => update('userDepartment', e.target.value)} className={inputStyles} placeholder="e.g. Minister of Trade" /></div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div><label className={labelStyles}>Headquarters Country</label><select value={params.userCountry} onChange={(e) => update('userCountry', e.target.value)} className={inputStyles}><option value="">Select Country...</option>{REGIONS_AND_COUNTRIES.flatMap(r => r.countries).sort().map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                                <div><label className={labelStyles}>Headquarters City</label><input type="text" value={params.userCity || ''} onChange={e => update('userCity', e.target.value)} className={inputStyles} placeholder="e.g. Geneva" /></div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex justify-end">
                                <button onClick={() => setStep(2)} disabled={!params.organizationType || !params.userCountry} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-all shadow-md">Next: Strategy & Deal Architecture &rarr;</button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: STRATEGY & DEAL ARCHITECTURE */}
                    {step === 2 && (
                        <div className="animate-fade-in space-y-8">
                            <div className="border-b border-slate-100 pb-6">
                                <h2 className="text-2xl font-bold text-slate-900">Step 2: Strategy & Deal Architecture</h2>
                                <p className="text-slate-500">Configure your market entry, partner search scope, and deal support ecosystem.</p>
                            </div>

                            {/* 1. Market Scope */}
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelStyles}>Target Region / Market</label>
                                        <select value={params.region} onChange={e => update('region', e.target.value)} className={inputStyles}>
                                            <option value="">Select Target Region...</option>
                                            {REGIONS_AND_COUNTRIES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelStyles}>Primary Sector</label>
                                        <select className={inputStyles} onChange={(e) => update('industry', [e.target.value])} value={params.industry[0] || ''}>
                                            <option value="">Select Industry...</option>
                                            {INDUSTRIES.map(ind => <option key={ind.id} value={ind.id}>{ind.title}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {params.industry.length > 0 && (
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                        <MegaMultiSelect 
                                            label="Niche Specialization (Refine Focus)" 
                                            options={allNiches} 
                                            selected={params.nicheAreas || []} 
                                            onToggle={(val) => toggleArrayItem('nicheAreas', val)}
                                            placeholder="Search 100+ specialized niches..."
                                        />
                                    </div>
                                )}

                                {/* Benchmark Section */}
                                <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 shadow-sm">
                                    <div className="mb-4">
                                        <label className="block text-sm font-bold text-yellow-900 flex items-center gap-2">
                                            <GlobeIcon className="w-4 h-4 text-yellow-700" /> 
                                            Benchmark Reference
                                        </label>
                                        <p className="text-xs text-yellow-800 mt-1">
                                            Compare against a standard relevant to your chosen sector.
                                        </p>
                                    </div>
                                    
                                    {!hasSelectedIndustry ? (
                                        <div className="text-sm text-yellow-800 italic bg-yellow-100 p-3 rounded-md border border-yellow-300">
                                            Please select a <strong>Primary Sector</strong> above to view relevant benchmarks.
                                        </div>
                                    ) : (
                                        <select 
                                            value={isCustomHub ? 'Custom' : params.comparisonHub || ''} 
                                            onChange={(e) => {
                                                if(e.target.value === 'Custom') {
                                                    if(!isCustomHub) update('comparisonHub', '');
                                                } else {
                                                    update('comparisonHub', e.target.value.split(' - ')[0]);
                                                }
                                            }} 
                                            className={`${inputStyles} border-yellow-300 focus:ring-yellow-500 bg-white`}
                                        >
                                            <option value="">Select Benchmark for {params.industry[0]}...</option>
                                            {relevantBenchmarks.map(hub => (
                                                <option key={hub} value={hub.split(' - ')[0]}>{hub}</option>
                                            ))}
                                            <option value="Custom">Other / Custom Location...</option>
                                        </select>
                                    )}
                                    
                                    {(isCustomHub || (!params.comparisonHub && hasSelectedIndustry && document.activeElement?.tagName === "SELECT")) && (
                                        <div className="mt-3 animate-fade-in">
                                            <input 
                                                type="text" 
                                                value={isCustomHub ? params.comparisonHub : ''} 
                                                onChange={e => update('comparisonHub', e.target.value)} 
                                                className={`${inputStyles} bg-white border-yellow-300`} 
                                                placeholder="Enter custom benchmark (e.g. 'Medellin' or 'Estonia')" 
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 2. Strategic Mode Selector */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-6">
                                <label className="block text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-black" /> Strategic Mode
                                </label>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {[
                                        { id: 'specific', title: 'Analyze Specific Target', desc: 'Deep due diligence on a known entity.' },
                                        { id: 'discovery', title: 'Discover Partners', desc: 'Find new matches & opportunities.' },
                                        { id: 'expansion', title: 'Market Expansion', desc: 'Relocation & ecosystem analysis.' }
                                    ].map(mode => (
                                        <button 
                                            key={mode.id}
                                            onClick={() => update('strategicMode', mode.id as any)}
                                            className={`p-4 rounded-lg border text-left transition-all ${params.strategicMode === mode.id ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            <div className={`font-bold text-sm mb-1 ${params.strategicMode === mode.id ? 'text-blue-800' : 'text-slate-900'}`}>{mode.title}</div>
                                            <div className="text-xs text-slate-500">{mode.desc}</div>
                                        </button>
                                    ))}
                                </div>

                                {/* DYNAMIC MODE CONTENT */}
                                <div className="mt-6 p-5 bg-slate-50 rounded-lg border border-slate-200 animate-fade-in">
                                    
                                    {/* MODE 1: SPECIFIC TARGET */}
                                    {params.strategicMode === 'specific' && (
                                        <div className="space-y-5">
                                            <div>
                                                <label className={labelStyles}>Target Entity Name</label>
                                                <input 
                                                    type="text" 
                                                    value={params.targetPartner || ''} 
                                                    onChange={e => update('targetPartner', e.target.value)} 
                                                    className={inputStyles} 
                                                    placeholder="e.g. Tesla, Ministry of Energy..." 
                                                />
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className={labelStyles}>Relationship Stage</label>
                                                    <select 
                                                        value={params.relationshipStage || 'Initial Outreach'} 
                                                        onChange={e => update('relationshipStage', e.target.value)}
                                                        className={inputStyles}
                                                    >
                                                        <option>No Contact (Cold)</option>
                                                        <option>Initial Outreach</option>
                                                        <option>Active Negotiation</option>
                                                        <option>Existing Partner (Expansion)</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className={labelStyles}>Due Diligence Depth</label>
                                                    <select 
                                                        value={params.dueDiligenceDepth || 'Standard'} 
                                                        onChange={e => update('dueDiligenceDepth', e.target.value)}
                                                        className={inputStyles}
                                                    >
                                                        <option>Basic Screening</option>
                                                        <option>Standard (Reputation & Risk)</option>
                                                        <option>Deep Forensic (Financial & Legal)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex gap-6 pt-2 border-t border-slate-200">
                                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                                    <input type="checkbox" checked={(params.comparativeContext || []).includes('Regional Competitors')} onChange={() => toggleArrayItem('comparativeContext', 'Regional Competitors')} className="rounded text-blue-600 focus:ring-blue-500" />
                                                    Compare with Regional Competitors
                                                </label>
                                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                                    <input type="checkbox" checked={(params.comparativeContext || []).includes('Global Leaders')} onChange={() => toggleArrayItem('comparativeContext', 'Global Leaders')} className="rounded text-blue-600 focus:ring-blue-500" />
                                                    Benchmark against Global Leaders
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {/* MODE 2: DISCOVER PARTNERS */}
                                    {params.strategicMode === 'discovery' && (
                                        <div className="space-y-5">
                                            <div className="grid md:grid-cols-3 gap-6">
                                                <div>
                                                    <label className={labelStyles}>Search Scope</label>
                                                    <select value={params.searchScope || 'Regional'} onChange={e => update('searchScope', e.target.value)} className={inputStyles}>
                                                        <option value="Local">Local (Selected Country)</option>
                                                        <option value="Regional">Regional ({params.region})</option>
                                                        <option value="Global">Global Search</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className={labelStyles}>Match Count</label>
                                                    <select value={params.matchCount || 5} onChange={e => update('matchCount', parseInt(e.target.value))} className={inputStyles}>
                                                        <option value={1}>1 Best Match</option>
                                                        <option value={3}>Top 3 Options</option>
                                                        <option value={5}>Top 5 Options</option>
                                                        <option value={10}>Longlist (10)</option>
                                                    </select>
                                                </div>
                                                <div className="flex items-center pt-6">
                                                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-900">
                                                        <input type="checkbox" checked={params.includeCrossSectorMatches || false} onChange={e => update('includeCrossSectorMatches', e.target.checked)} className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500" />
                                                        Cross-Sector Scouting
                                                    </label>
                                                </div>
                                            </div>
                                            
                                            {/* Partner Capabilities */}
                                            <div>
                                                <label className={labelStyles}>Ideal Partner Capabilities (Required Assets)</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {PARTNER_CAPABILITIES.map(cap => (
                                                        <button
                                                            key={cap}
                                                            onClick={() => toggleArrayItem('partnerCapabilities', cap)}
                                                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                                                (params.partnerCapabilities || []).includes(cap)
                                                                ? 'bg-slate-900 text-white border-slate-900'
                                                                : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                                                            }`}
                                                        >
                                                            {cap} {(params.partnerCapabilities || []).includes(cap) && '✓'}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* MODE 3: EXPANSION */}
                                    {params.strategicMode === 'expansion' && (
                                        <div className="space-y-5">
                                            <p className="text-sm text-slate-600 italic mb-2">Analyze optimal locations for setup or relocation based on ecosystem factors.</p>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className={labelStyles}>Geographic Preference</label>
                                                    <select value={params.searchScope || 'Regional'} onChange={e => update('searchScope', e.target.value)} className={inputStyles}>
                                                        <option value="Regional">Within {params.region}</option>
                                                        <option value="Global">Global Comparison</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className={labelStyles}>Expansion Timeline</label>
                                                    <select value={params.expansionTimeline || '12-18 Months'} onChange={e => update('expansionTimeline', e.target.value)} className={inputStyles}>
                                                        <option>Immediate (&lt; 6 Months)</option>
                                                        <option>Short Term (6-12 Months)</option>
                                                        <option>Medium Term (12-24 Months)</option>
                                                        <option>Long Term (2+ Years)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className={labelStyles}>Operational Priority</label>
                                                    <select value={params.operationalPriority || 'Balanced'} onChange={e => update('operationalPriority', e.target.value)} className={inputStyles}>
                                                        <option>Cost Efficiency Focus</option>
                                                        <option>Innovation & Talent Focus</option>
                                                        <option>Speed to Market</option>
                                                        <option>Balanced Approach</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className={labelStyles}>Risk Appetite</label>
                                                    <select value={params.riskTolerance || 'Moderate'} onChange={e => update('riskTolerance', e.target.value)} className={inputStyles}>
                                                        <option>Conservative (Low Risk Only)</option>
                                                        <option>Moderate (Balanced)</option>
                                                        <option>Aggressive (High Growth/Risk)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* INTEGRATED INTENT & CONTEXT */}
                                    <div className="mt-6 pt-6 border-t border-slate-200">
                                        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><MatchMakerIcon className="w-4 h-4 text-purple-600" /> Strategic Intent & Context</h3>
                                        
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {INTENT_TAGS.map(tag => (
                                                <button 
                                                    key={tag}
                                                    onClick={() => toggleArrayItem('intentTags', tag)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                                        (params.intentTags || []).includes(tag) 
                                                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm' 
                                                        : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'
                                                    }`}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                        
                                        <div>
                                            <label className={labelStyles}>Mission Context (Tell the System)</label>
                                            <textarea 
                                                value={params.additionalContext || ''} 
                                                onChange={e => update('additionalContext', e.target.value)} 
                                                className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm min-h-[100px] resize-none focus:ring-2 focus:ring-slate-800" 
                                                placeholder="Describe specific goals, constraints, or unique requirements... (e.g. 'We need a partner with strong ESG credentials for a joint venture in renewable energy.')"
                                            />
                                            <div className="mt-3">
                                                <input type="file" id="doc-upload-step2" className="hidden" onChange={handleFileUpload} />
                                                <label htmlFor="doc-upload-step2" className="flex items-center gap-2 text-xs font-bold text-blue-600 cursor-pointer hover:text-blue-800 transition-colors">
                                                    <FileText className="w-4 h-4" /> 
                                                    {params.uploadedFileName ? `Attached: ${params.uploadedFileName}` : 'Upload Brief / RFP / Supporting Doc'}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Deal Support Ecosystem */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-600" /> Deal Setup & Support Requirements</h3>
                                <p className="text-xs text-slate-500 mb-4">Select areas where you need the system to identify support channels (funding, permits, etc.) to facilitate this deal.</p>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {DEAL_SUPPORT_CATEGORIES.map((group, idx) => (
                                        <div key={idx}>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">{group.category}</h4>
                                            <div className="space-y-2">
                                                {group.options.map(opt => (
                                                    <label key={opt} className="flex items-start gap-3 cursor-pointer group p-2 rounded hover:bg-slate-50 transition-colors">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={(params.partnershipSupportNeeds || []).includes(opt)}
                                                            onChange={() => toggleArrayItem('partnershipSupportNeeds', opt)}
                                                            className="mt-0.5 h-4 w-4 text-green-600 rounded border-slate-300 focus:ring-green-500 cursor-pointer"
                                                        />
                                                        <span className={`text-sm leading-tight ${
                                                            (params.partnershipSupportNeeds || []).includes(opt) ? 'font-bold text-slate-900' : 'font-medium text-slate-600'
                                                        }`}>
                                                            {opt}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex justify-between">
                                <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-900 text-sm font-medium">&larr; Back to Identity</button>
                                <button onClick={() => setStep(3)} disabled={!params.region || !params.industry.length} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-all shadow-md">Next: Strategic Intelligence &rarr;</button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: STRATEGIC INTELLIGENCE */}
                    {step === 3 && (
                        <div className="animate-fade-in space-y-8">
                            <div className="border-b border-slate-100 pb-6">
                                <h2 className="text-2xl font-bold text-slate-900">Step 3: Strategic Intelligence</h2>
                                <p className="text-slate-500">Define objectives and analytical methodologies. Deliverables are configured in the next step.</p>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <MegaMultiSelect 
                                    label="Strategic Objectives (Multi-Select)" 
                                    options={allObjectives}
                                    selected={params.strategicObjectives || []}
                                    onToggle={(val) => toggleArrayItem('strategicObjectives', val)}
                                    placeholder="Search objectives (e.g. Market Entry, Crisis Mitigation)..."
                                />
                            </div>

                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100 shadow-sm mb-8">
                                <label className="block text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2"><BrainCircuit className="w-6 h-6 text-indigo-600" /> Analytical Lenses</label>
                                <p className="text-sm text-indigo-700 mb-4">Select multiple methodologies for the Nexus Brain.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {STRATEGIC_LENSES.map((lens) => (
                                        <button
                                            key={lens.id}
                                            onClick={() => toggleArrayItem('strategicLens', lens.id)}
                                            className={`p-4 rounded-xl border text-left transition-all ${
                                                (params.strategicLens || []).includes(lens.id)
                                                ? 'bg-white border-indigo-500 ring-1 ring-indigo-500 shadow-md'
                                                : 'bg-white/60 border-indigo-100 hover:bg-white'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-sm">{lens.label}</span>
                                                {(params.strategicLens || []).includes(lens.id) && <CheckCircle className="w-4 h-4 text-indigo-600" />}
                                            </div>
                                            <div className="text-xs text-slate-500">{lens.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-8 flex justify-between items-center border-t border-slate-100">
                                <button onClick={() => setStep(2)} className="text-slate-500 hover:text-slate-900 text-sm font-medium">&larr; Back to Target</button>
                                <button onClick={onComplete} className="px-10 py-4 bg-slate-900 text-white font-bold text-lg rounded-xl hover:bg-slate-800 transition-all shadow-lg transform hover:-translate-y-0.5">
                                    Proceed to Mission Briefing &rarr;
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

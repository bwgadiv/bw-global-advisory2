
import React from 'react';
import { 
    MissionIcon, OpportunitiesIcon, ReportIcon, ComplianceIcon, VentureCapitalistIcon, 
    EconomistIcon, GeopoliticalStrategistIcon, EsgAnalystIcon, InfrastructurePlannerIcon, 
    SupplyChainAnalystIcon, WorkforceSpecialistIcon, TechnologyIcon, RenewableEnergyIcon, 
    InfrastructureIcon, HealthcareIcon, ManufacturingIcon, AgricultureIcon, FinanceIcon, 
    MiningIcon, LogisticsIcon, TourismIcon, EducationIcon, MatchMakerIcon, ManualIcon, 
    AerospaceIcon, DefenseIcon, AutomotiveIcon, RetailIcon, MediaIcon, RealEstateIcon, 
    LegalIcon, ChemicalIcon, PharmaIcon, TelecomIcon, FashionIcon, FoodBeverageIcon, 
    ShieldCheck, BrainCircuit, Users, GlobeIcon, Target, ActivityIcon, SearchIcon, ShieldCheckIcon, SymbiosisIcon,
    TrendingUp, Zap, Layers, BarChart
} from './components/Icons';
import type { View, PersonaOption, IndustryOption, GlobalCityData, StrategicIntent } from './types';

export const ORIGINAL_NAV_ITEMS: { id: View, title: string, description: string, icon: React.FC<any> }[] = [ 
    { id: 'who-we-are', title: 'Who Why & Need', description: 'About BWGA', icon: ManualIcon }, 
    { id: 'opportunities', title: 'Data Hub', description: 'Live Intelligence', icon: OpportunitiesIcon }, 
    { id: 'report-entry', title: 'BWGA Report System/T&C', description: 'Inquire & Report', icon: ReportIcon }, 
    { id: 'compliance', title: 'Compliance', description: 'Data & Security', icon: ComplianceIcon }, 
];

// --- STRATEGIC INTENTS (OPPORTUNITY CATALOG) - EXPANDED ---
export const STRATEGIC_INTENTS: StrategicIntent[] = [
    {
        id: 'attract_investment',
        title: 'Attract Foreign Investment (FDI)',
        description: 'Identify and profile ideal foreign investors for your region or project.',
        icon: <Target className="w-8 h-8" />, 
        recommendedModules: ['rocket_engine', 'rroi', 'seam', 'comfort_index', 'negotiation_advantage'],
        personaAlignment: ['Government', 'EDA', 'Project Developer', 'Special Economic Zone (SEZ) Authority']
    },
    {
        id: 'enter_market',
        title: 'Enter New Market',
        description: 'Assess and plan a strategic entry into a new geographic market.',
        icon: <GlobeIcon className="w-8 h-8" />,
        recommendedModules: ['rocket_engine', 'geopolitics', 'comfort_index', 'matchmaking_engine', 'cultural_intel'],
        personaAlignment: ['Private Enterprise', 'SME', 'MNC']
    },
    {
        id: 'derisk_supply_chain',
        title: 'De-Risk Supply Chain',
        description: 'Reduce reliance on single-source suppliers and find resilient alternatives.',
        icon: <ShieldCheckIcon className="w-8 h-8" />,
        recommendedModules: ['trade_disruption', 'alternative_locations', 'governance_audit', 'matchmaking_engine'],
        personaAlignment: ['Private Enterprise', 'Manufacturing', 'Logistics']
    },
    {
        id: 'forge_partnership',
        title: 'Forge Strategic Partnership',
        description: 'Find and vet a specific type of partner (technology, distribution, R&D).',
        icon: <Users className="w-8 h-8" />,
        recommendedModules: ['symbiotic_matchmaking', 'due_diligence', 'relationship_builder', 'negotiation_advantage', 'cultural_intel'],
        personaAlignment: ['All']
    },
    {
        id: 'assess_viability',
        title: 'Assess Project Viability',
        description: 'Deep-dive due diligence and predictive ROI analysis on a project.',
        icon: <ActivityIcon className="w-8 h-8" />,
        recommendedModules: ['predictive_growth', 'financial_feasibility', 'risk_assessment', 'deep_reasoning', 'math_models'],
        personaAlignment: ['Financial Institution', 'Investor', 'Private Equity']
    },
    {
        id: 'develop_policy',
        title: 'Develop Regional Policy',
        description: 'Model the economic and social impact of a new policy or infrastructure.',
        icon: <ManualIcon className="w-8 h-8" />,
        recommendedModules: ['rocket_engine', 'scf_simulation', 'stakeholder_analysis', 'rroi'],
        personaAlignment: ['Government', 'Think Tank', 'NGO']
    },
    {
        id: 'joint_venture',
        title: 'Explore Joint Venture / M&A',
        description: 'Identify and analyze potential acquisition or JV targets.',
        icon: <SymbiosisIcon className="w-8 h-8" />,
        recommendedModules: ['deep_reasoning', 'valuation', 'cultural_fit', 'negotiation_advantage', 'due_diligence'],
        personaAlignment: ['Private Enterprise', 'Private Equity', 'Venture Capital']
    },
    {
        id: 'crisis_response',
        title: 'Crisis Response & Mitigation',
        description: 'Immediate analysis of geopolitical or economic shockwaves and recovery paths.',
        icon: <ShieldCheck className="w-8 h-8" />,
        recommendedModules: ['geopolitics', 'trade_disruption', 'stakeholder_analysis', 'relationship_builder'],
        personaAlignment: ['Government', 'MNC', 'NGO']
    },
    {
        id: 'digital_transformation',
        title: 'Digital Transformation & AI',
        description: 'Blueprint for adopting national or corporate digital infrastructure.',
        icon: <BrainCircuit className="w-8 h-8" />,
        recommendedModules: ['rocket_engine', 'predictive_growth', 'math_models', 'seam'],
        personaAlignment: ['Government', 'Private Enterprise', 'Telco']
    },
    {
        id: 'workforce_development',
        title: 'Workforce & Talent Ecosystem',
        description: 'Analyze labor gaps, education needs, and talent attraction strategies.',
        icon: <Users className="w-8 h-8" />,
        recommendedModules: ['rroi', 'seam', 'cultural_intel', 'predictive_growth'],
        personaAlignment: ['Government', 'HR', 'Education']
    },
    {
        id: 'sustainability_audit',
        title: 'Sustainability & ESG Transition',
        description: 'Evaluate environmental impact, compliance, and green transition paths.',
        icon: <RenewableEnergyIcon className="w-8 h-8" />,
        recommendedModules: ['governance_audit', 'scf_simulation', 'stakeholder_analysis'],
        personaAlignment: ['All']
    },
    {
        id: 'sovereign_wealth',
        title: 'Sovereign Wealth & Fiscal Strategy',
        description: 'High-level asset allocation and national revenue diversification.',
        icon: <FinanceIcon className="w-8 h-8" />,
        recommendedModules: ['math_models', 'geopolitics', 'rocket_engine', 'deep_reasoning'],
        personaAlignment: ['Sovereign Wealth Fund', 'Central Bank', 'Treasury']
    },
    {
        id: 'innovation_hub',
        title: 'Innovation District Development',
        description: 'Plan and benchmark a new technology or research cluster.',
        icon: <Zap className="w-8 h-8" />,
        recommendedModules: ['seam', 'rocket_engine', 'matchmaking_engine', 'alternative_locations'],
        personaAlignment: ['Government', 'Real Estate', 'University']
    },
    {
        id: 'supply_chain_reengineering',
        title: 'Supply Chain Re-Engineering',
        description: 'Complete overhaul of logistics networks for efficiency and resilience.',
        icon: <LogisticsIcon className="w-8 h-8" />,
        recommendedModules: ['trade_disruption', 'alternative_locations', 'math_models'],
        personaAlignment: ['Logistics', 'Manufacturing', 'Retail']
    },
    {
        id: 'brand_soft_power',
        title: 'Brand & Soft Power Projection',
        description: 'Enhance national or corporate reputation globally.',
        icon: <MediaIcon className="w-8 h-8" />,
        recommendedModules: ['cultural_intel', 'stakeholder_analysis', 'comfort_index'],
        personaAlignment: ['Government', 'Tourism', 'MNC']
    },
    {
        id: 'ipo_capital_raising',
        title: 'IPO & Capital Raising',
        description: 'Prepare narrative and due diligence for public listing or major fundraising.',
        icon: <TrendingUp className="w-8 h-8" />,
        recommendedModules: ['financial_feasibility', 'governance_audit', 'deep_reasoning'],
        personaAlignment: ['Private Enterprise', 'Venture Capital', 'Financial Institution']
    },
    {
        id: 'political_risk',
        title: 'Political Risk & Governance',
        description: 'Deep analysis of regime stability, regulatory changes, and corruption.',
        icon: <LegalIcon className="w-8 h-8" />,
        recommendedModules: ['geopolitics', 'governance_audit', 'stakeholder_analysis'],
        personaAlignment: ['MNC', 'Investor', 'Insurance']
    }
];

// --- 1. EXPANDED AI PERSONA ROSTER (32+ AGENTS) ---
export const AI_PERSONAS: PersonaOption[] = [
    // Strategic & Economic Core
    { id: 'Regional Economist', title: 'Regional Economist', description: 'Macroeconomic trends, labor markets, fiscal policy.', icon: EconomistIcon, applicableOrgs: ['Government', 'NGO', 'Academic', 'Supra-National'], applicableIndustries: [] },
    { id: 'Venture Capitalist', title: 'Venture Capitalist', description: 'Market scalability, ROI modeling, exit strategy.', icon: VentureCapitalistIcon, applicableOrgs: ['Private', 'Financial'], applicableIndustries: ['Technology', 'FinTech', 'Pharma', 'BioTech'] },
    { id: 'Geopolitical Strategist', title: 'Geopolitical Strategist', description: 'Political risk, sanctions, trade relations.', icon: GeopoliticalStrategistIcon, applicableOrgs: ['Government', 'MNC', 'Sovereign Wealth Fund', 'Defense'], applicableIndustries: ['Defense', 'Energy', 'Mining'] },
    { id: 'ESG Analyst', title: 'ESG Analyst', description: 'Sustainability, social impact, governance compliance.', icon: EsgAnalystIcon, applicableOrgs: ['All'], applicableIndustries: ['Energy', 'Agriculture', 'Manufacturing'] },
    
    // Specialized Technical
    { id: 'Infrastructure Planner', title: 'Infrastructure Planner', description: 'Logistics, utilities, urban development.', icon: InfrastructurePlannerIcon, applicableOrgs: ['Government', 'Construction', 'Special Economic Zone'], applicableIndustries: ['Construction', 'Real Estate', 'Logistics'] },
    { id: 'Supply Chain Analyst', title: 'Supply Chain Analyst', description: 'Sourcing, logistics optimization, resilience.', icon: SupplyChainAnalystIcon, applicableOrgs: ['Manufacturing', 'Retail', 'Logistics'], applicableIndustries: ['Manufacturing', 'Retail', 'Automotive', 'Food'] },
    { id: 'Forensic Accountant', title: 'Forensic Accountant', description: 'Financial due diligence, fraud risk, audit.', icon: FinanceIcon, applicableOrgs: ['Financial', 'Legal', 'Government'], applicableIndustries: ['Finance', 'Legal', 'Banking'] },
    { id: 'IP Lawyer', title: 'IP Lawyer', description: 'Intellectual property protection, patents, trademarks.', icon: LegalIcon, applicableOrgs: ['Private', 'Research', 'Pharmaceuticals'], applicableIndustries: ['Technology', 'Pharma', 'Media'] },
    
    // Niche & Sector Specific
    { id: 'Agri-Economist', title: 'Agri-Economist', description: 'Crop yields, food security, commodity pricing.', icon: AgricultureIcon, applicableOrgs: ['Government', 'Private', 'NGO'], applicableIndustries: ['Agriculture', 'Food'] },
    { id: 'Energy Grid Architect', title: 'Energy Grid Architect', description: 'Power systems, renewables integration.', icon: RenewableEnergyIcon, applicableOrgs: ['Utilities', 'Government'], applicableIndustries: ['Energy'] },
    { id: 'Maritime Specialist', title: 'Maritime Specialist', description: 'Shipping routes, port operations, law of the sea.', icon: LogisticsIcon, applicableOrgs: ['Logistics', 'Government', 'Port Authority'], applicableIndustries: ['Logistics', 'Trade'] },
    { id: 'Public Health Official', title: 'Public Health Official', description: 'Epidemiology, health policy, systems planning.', icon: HealthcareIcon, applicableOrgs: ['Government', 'NGO', 'Hospital'], applicableIndustries: ['Healthcare'] },
    
    // Cultural & Diplomatic
    { id: 'Trade Diplomat', title: 'Trade Diplomat', description: 'G2G negotiations, tariff agreements, protocol.', icon: MatchMakerIcon, applicableOrgs: ['Government', 'Supra-National'], applicableIndustries: ['Public Sector'] },
    { id: 'Cultural Anthropologist', title: 'Cultural Anthropologist', description: 'Social norms, community engagement, indigenous relations.', icon: Users, applicableOrgs: ['NGO', 'Indigenous Corporation', 'Mining'], applicableIndustries: ['Mining', 'Infrastructure', 'Tourism'] },
    { id: 'Labor Relations Expert', title: 'Labor Relations Expert', description: 'Union negotiations, workforce laws, fair labor.', icon: WorkforceSpecialistIcon, applicableOrgs: ['Manufacturing', 'Government'], applicableIndustries: ['Manufacturing', 'Construction'] },
    { id: 'Tourism Developer', title: 'Tourism Developer', description: 'Destination marketing, hospitality infrastructure.', icon: TourismIcon, applicableOrgs: ['Government', 'Private'], applicableIndustries: ['Tourism', 'Hospitality'] },

    // Advanced & Future Tech
    { id: 'Space Systems Analyst', title: 'Space Systems Analyst', description: 'Satellite logistics, aerospace regulation.', icon: AerospaceIcon, applicableOrgs: ['Aerospace', 'Government'], applicableIndustries: ['Aerospace', 'Defense'] },
    { id: 'Cybersecurity Auditor', title: 'Cybersecurity Auditor', description: 'Digital threat assessment, data sovereignty.', icon: ShieldCheck, applicableOrgs: ['Financial', 'Tech', 'Government'], applicableIndustries: ['Technology', 'Finance', 'Defense'] },
    { id: 'Quantum Tech Strategist', title: 'Quantum Tech Strategist', description: 'Future computing impact, encryption risks.', icon: BrainCircuit, applicableOrgs: ['Tech', 'Defense', 'Research'], applicableIndustries: ['Technology', 'Research'] },
    { id: 'Bio-Ethics Consultant', title: 'Bio-Ethics Consultant', description: 'Genetic research ethics, clinical trial compliance.', icon: HealthcareIcon, applicableOrgs: ['Pharma', 'Research'], applicableIndustries: ['Healthcare', 'BioTech'] }
];

// --- 2. EXPANDED INDUSTRY LIST (GICS+) ---
export const INDUSTRIES: IndustryOption[] = [
    { id: 'Agriculture & Agribusiness', title: 'Agriculture & Agribusiness', icon: AgricultureIcon },
    { id: 'Aerospace & Defense', title: 'Aerospace & Defense', icon: AerospaceIcon },
    { id: 'Automotive & Mobility', title: 'Automotive & Mobility', icon: AutomotiveIcon },
    { id: 'Banking & Capital Markets', title: 'Banking & Capital Markets', icon: FinanceIcon },
    { id: 'Biotechnology & Life Sciences', title: 'Biotechnology & Life Sciences', icon: HealthcareIcon },
    { id: 'Chemicals & Materials', title: 'Chemicals & Materials', icon: ChemicalIcon },
    { id: 'Construction & Engineering', title: 'Construction & Engineering', icon: InfrastructureIcon },
    { id: 'Education & EdTech', title: 'Education & EdTech', icon: EducationIcon },
    { id: 'Energy (Oil, Gas, Renewable)', title: 'Energy (Oil, Gas, Renewable)', icon: RenewableEnergyIcon },
    { id: 'Fashion & Apparel', title: 'Fashion & Apparel', icon: FashionIcon },
    { id: 'Food & Beverage', title: 'Food & Beverage', icon: FoodBeverageIcon },
    { id: 'Healthcare & Pharmaceuticals', title: 'Healthcare & Pharmaceuticals', icon: PharmaIcon },
    { id: 'Hospitality & Tourism', title: 'Hospitality & Tourism', icon: TourismIcon },
    { id: 'Insurance & Reinsurance', title: 'Insurance', icon: ShieldCheck },
    { id: 'Legal & Professional Services', title: 'Legal & Professional Services', icon: LegalIcon },
    { id: 'Logistics & Transportation', title: 'Logistics & Transportation', icon: LogisticsIcon },
    { id: 'Manufacturing (Advanced)', title: 'Manufacturing (Advanced)', icon: ManufacturingIcon },
    { id: 'Media & Entertainment', title: 'Media & Entertainment', icon: MediaIcon },
    { id: 'Mining & Metals', title: 'Mining & Metals', icon: MiningIcon },
    { id: 'Real Estate & REITs', title: 'Real Estate & REITs', icon: RealEstateIcon },
    { id: 'Retail & E-Commerce', title: 'Retail & E-Commerce', icon: RetailIcon },
    { id: 'Technology (Software/Hardware)', title: 'Technology (Software/Hardware)', icon: TechnologyIcon },
    { id: 'Telecommunications', title: 'Telecommunications', icon: TelecomIcon },
    { id: 'Utilities & Waste Management', title: 'Utilities & Waste Management', icon: InfrastructurePlannerIcon },
    { id: 'Space & Satellite', title: 'Space & Satellite', icon: AerospaceIcon },
    { id: 'Quantum Computing', title: 'Quantum Computing', icon: BrainCircuit }
];

// --- 3. MASSIVE ORG TYPE TAXONOMY (UPDATED) ---
// Expanded to ensure no choice is reduced, specific entities added.
export const ORGANIZATION_TYPES = [
    'Government (National/Federal)',
    'Government (State/Provincial)',
    'Government (Local/Municipal)',
    'Government Agency / Regulator',
    'Intergovernmental / Supra-National',
    'Sovereign Wealth Fund',
    'Royal Family Office',
    'Single Family Office',
    'Multi-Family Office',
    'Private Enterprise (MNC)',
    'Private Enterprise (SME)',
    'Private Enterprise (Startup/Scaleup)',
    'Private Enterprise (Venture Builder)',
    'Financial Institution (Bank)',
    'Financial Institution (Non-Bank)',
    'Venture Capital / Private Equity',
    'Hedge Fund / Asset Manager',
    'Pension Fund',
    'Insurance / Reinsurance',
    'Academic / Research Institution',
    'Think Tank / Policy Institute',
    'Non-Governmental Organization (NGO)',
    'Non-Profit / Philanthropy',
    'Foundation / Trust',
    'Indigenous Corporation / Land Council',
    'Tribal Council',
    'State-Owned Enterprise (SOE)',
    'Special Economic Zone (SEZ) Authority',
    'Port / Airport Authority',
    'Trade Association / Chamber of Commerce',
    'Labor Union / Syndicate',
    'Religious Institution',
    'Cooperative / Mutual',
    'Media / Press Agency',
    'Consultancy / Advisory Firm',
    'Legal Firm',
    'Military / Defense Contractor',
    'Intelligence / Security Agency',
    'Utility Company (Power/Water/Waste)',
    'Accelerator / Incubator',
    'Custom'
];

export const ORGANIZATION_SUBTYPES: Record<string, string[]> = {
    'Government (National/Federal)': ['Ministry of Trade/Commerce', 'Ministry of Finance', 'Ministry of Foreign Affairs', 'Investment Promotion Agency (National)', 'Export Credit Agency', 'Central Bank', 'Regulatory Body', 'Defense Department', 'Intelligence Unit'],
    'Government (State/Provincial)': ['State Development Agency', 'Governor\'s Office', 'State Treasury', 'Infrastructure Authority', 'Tourism Board'],
    'Government (Local/Municipal)': ['Mayor\'s Office', 'City Council', 'Urban Planning Dept', 'Local Economic Dev. Unit', 'Smart City Unit'],
    'Intergovernmental / Supra-National': ['UN Agency', 'Development Bank (World Bank/ADB)', 'Trade Bloc Secretariat (EU/ASEAN)', 'Global Fund'],
    'Sovereign Wealth Fund': ['Strategic Investment Fund', 'Stabilization Fund', 'Development Fund', 'Pension Reserve Fund', 'Real Estate Arm'],
    'Royal Family Office': ['Private Investment Arm', 'Philanthropic Foundation', 'Strategic Holding Co', 'Direct Investment Unit'],
    'Private Enterprise (MNC)': ['Publicly Traded', 'Privately Held', 'Conglomerate', 'Holding Company', 'Subsidiary'],
    'Private Enterprise (SME)': ['Tech Startup', 'Family Business', 'Sole Proprietorship', 'Partnership', 'Export-Oriented'],
    'Private Enterprise (Venture Builder)': ['Corporate Venture Capital', 'Incubator', 'Accelerator', 'Innovation Lab'],
    'Financial Institution': ['Commercial Bank', 'Investment Bank', 'Asset Management Firm', 'Private Equity', 'Venture Capital', 'Insurance Company', 'Hedge Fund', 'Microfinance'],
    'Academic / Research': ['Public University', 'Private University', 'Think Tank', 'Vocational Institute', 'Research Laboratory', 'Innovation Park'],
    'Non-Governmental Organization (NGO)': ['Humanitarian Aid', 'Environmental Advocacy', 'Human Rights', 'Development Agency', 'Social Enterprise'],
    'Indigenous Corporation / Land Council': ['Land Trust', 'Native Title Body', 'Community Development Corp', 'Business Enterprise', 'Cultural Heritage Trust'],
    'Tribal Council': ['Economic Development Corp', 'Gaming/Hospitality Arm', 'Natural Resources Dept', 'Social Services'],
    'State-Owned Enterprise (SOE)': ['Utility Provider', 'Transport Operator (Rail/Air)', 'Energy Company', 'Postal Service', 'Telecommunications'],
    'Special Economic Zone (SEZ) Authority': ['Free Trade Zone', 'Export Processing Zone', 'Industrial Park Management', 'Logistics Hub', 'Technology Park'],
    'Port / Airport Authority': ['Seaport Operations', 'Airport Management', 'Logistics Corridor', 'Freeport Zone'],
    'Trade Association / Chamber': ['Industry Specific Association', 'Bilateral Chamber of Commerce', 'Export Council', 'Business Roundtable'],
    'Religious Institution': ['Faith-Based Charity', 'Religious Order', 'Community Center', 'Educational Trust', 'Endowment Fund'],
    'Cooperative / Mutual': ['Agricultural Co-op', 'Credit Union', 'Housing Co-op', 'Worker Cooperative']
};

export const REGIONS_AND_COUNTRIES = [
    { name: "North America", countries: ["USA", "Canada", "Mexico"] },
    { name: "Europe (Western)", countries: ["UK", "Germany", "France", "Italy", "Spain", "Netherlands", "Switzerland"] },
    { name: "Europe (Eastern)", countries: ["Poland", "Romania", "Czech Republic", "Hungary", "Ukraine"] },
    { name: "Asia-Pacific (Developed)", countries: ["Japan", "Australia", "South Korea", "Singapore", "New Zealand"] },
    { name: "Asia-Pacific (Emerging)", countries: ["China", "India", "Vietnam", "Indonesia", "Thailand", "Philippines", "Malaysia"] },
    { name: "Middle East", countries: ["UAE", "Saudi Arabia", "Qatar", "Israel", "Turkey", "Egypt"] },
    { name: "Latin America", countries: ["Brazil", "Argentina", "Chile", "Colombia", "Peru"] },
    { name: "Africa", countries: ["South Africa", "Nigeria", "Kenya", "Ghana", "Rwanda", "Ethiopia"] },
    { name: "Global / Multi-Region", countries: ["All Regions"] }
];

// --- 4. EXPANDED OBJECTIVE MATRIX ---
export const STRATEGIC_OBJECTIVES = {
    Growth: [
        { id: 'market_entry', label: 'New Market Entry', desc: 'Launch products in a new geography.' },
        { id: 'fdi_attraction', label: 'Economic Attraction Package', desc: 'Build specific land/tax/labor offer.' },
        { id: 'mergers_acquisitions', label: 'Mergers & Acquisitions', desc: 'Identify acquisition targets.' },
        { id: 'export_expansion', label: 'Export Expansion', desc: 'Increase international sales volume.' },
        { id: 'franchise_development', label: 'Franchise Development', desc: 'Scale via franchising models.' }
    ],
    Resilience: [
        { id: 'supply_chain', label: 'Supply Chain De-Risking', desc: 'Find alternative suppliers/hubs.' },
        { id: 'crisis_mitigation', label: 'Resilience & Continuity', desc: 'Manage supply shock or PR crisis.' },
        { id: 'regional_offset', label: 'Regional Offset Match', desc: 'Compare regional hub costs vs major cities.' },
        { id: 'inflation_hedging', label: 'Inflation Hedging', desc: 'Strategies to protect margins.' },
        { id: 'cyber_security', label: 'Cyber Resilience', desc: 'Protect digital assets and data.' }
    ],
    Diplomacy: [
        { id: 'g2g_partnership', label: 'G2G Partnership', desc: 'Form bilateral government alliances.' },
        { id: 'trade_policy', label: 'Trade Policy Advocacy', desc: 'Lobby for favorable tariffs/rules.' },
        { id: 'soft_power', label: 'Soft Power / Cultural Exchange', desc: 'Build regional influence.' },
        { id: 'regulatory_alignment', label: 'Regulatory Alignment', desc: 'Harmonize standards across borders.' },
        { id: 'protocol_advisory', label: 'Protocol Advisory', desc: 'Navigate high-level diplomatic etiquette.' }
    ],
    Infrastructure: [
        { id: 'project_finance', label: 'Project Finance', desc: 'Secure funding for major build-outs.' },
        { id: 'urban_planning', label: 'Urban / Regional Planning', desc: 'Design smart city/zone frameworks.' },
        { id: 'green_transition', label: 'Green Energy Transition', desc: 'Shift to renewable infrastructure.' },
        { id: 'digital_backbone', label: 'Digital Backbone', desc: 'Broadband and data center rollout.' },
        { id: 'logistics_hub', label: 'Logistics Hub Creation', desc: 'Develop ports, rail, and warehousing.' }
    ],
    Innovation: [
        { id: 'tech_transfer', label: 'Technology Transfer', desc: 'Import/Export IP and know-how.' },
        { id: 'r_and_d_collaboration', label: 'R&D Collaboration', desc: 'Joint research with universities.' },
        { id: 'talent_acquisition', label: 'Talent Acquisition', desc: 'Attract specialized workforce.' },
        { id: 'startup_ecosystem', label: 'Startup Ecosystem', desc: 'Foster local venture creation.' }
    ]
};

export const DELIVERABLE_OPTIONS = [
    { id: 'snapshot', label: 'Strategic Snapshot', pages: '2-3 Pages', desc: 'High-level feasibility check.' },
    { id: 'brief', label: 'Executive Brief', pages: '5-8 Pages', desc: 'Actionable roadmap & key risks.' },
    { id: 'comprehensive', label: 'Comprehensive Intelligence', pages: '15+ Pages', desc: 'Deep-dive analysis & appendices.' },
    { id: 'letter_only', label: 'Outreach Letter Only', pages: '1 Page', desc: 'Drafted intro for immediate use.' },
    { id: 'presentation', label: 'Pitch Deck / Presentation', pages: '10-15 Slides', desc: 'Visual summary for stakeholders.' },
    { id: 'mou_draft', label: 'Draft MOU / LOI', pages: '2-4 Pages', desc: 'Legal framework for partnership.' }
];

// --- 5. EXPANDED STRATEGIC LENSES ---
export const STRATEGIC_LENSES = [
    { id: 'standard', label: 'Core Analysis', desc: 'Best practices, market data, foundational metrics.' }, // Renamed from Standard
    { id: 'quantum', label: 'Quantum / 100-Year Gap', desc: 'Identify latent assets & reverse-engineer the deal.' },
    { id: 'risk_first', label: 'Risk-First Assessment', desc: 'Prioritize threats, compliance, and political stability.' },
    { id: 'blue_ocean', label: 'Blue Ocean Strategy', desc: 'Focus on uncontested market space and innovation.' },
    { id: 'esg_impact', label: 'ESG & Impact', desc: 'Analyze sustainability, social benefit, and governance.' },
    { id: 'rapid_entry', label: 'Rapid Market Entry', desc: 'Speed-to-market focus with lean operational setup.' },
    { id: 'conservative', label: 'Conservative / Defensive', desc: 'Capital preservation and low-risk partnerships.' },
    { id: 'disruptive', label: 'Disruptive Innovation', desc: 'Focus on displacing incumbents and new tech.' },
    { id: 'cost_leadership', label: 'Cost Leadership', desc: 'Focus on operational efficiency and price advantage.' },
    { id: 'customer_centric', label: 'Customer-Centric', desc: 'Deep dive into user needs and behavior.' },
    { id: 'geopolitical', label: 'Geopolitical Lens', desc: 'Focus on state-level relations and power dynamics.' },
    { id: 'technocratic', label: 'Technocratic / Data-Driven', desc: 'Pure quantitative analysis and modeling.' }
];

// --- 6. MASSIVE NICHE DATABASE ---
export const INDUSTRY_NICHES: Record<string, string[]> = {
    'Energy (Oil, Gas, Renewable)': [
        'Green Hydrogen', 'Solar PV Utility Scale', 'Offshore Wind', 'Grid Modernization', 'Carbon Capture (CCS)', 'LNG Infrastructure', 
        'Biofuels', 'Nuclear Small Modular Reactors', 'Battery Storage', 'Geothermal', 'Hydropower', 'Energy Trading', 'Smart Metering'
    ],
    'Technology (Software/Hardware)': [
        'SaaS Enterprise', 'Semiconductors', 'Cybersecurity Defense', 'Generative AI', 'Cloud Infrastructure', 'Data Centers', 
        'EdTech Platforms', 'FinTech Payments', 'Blockchain/Web3', 'IoT Industrial', 'Robotics', 'Quantum Computing', '5G Networking'
    ],
    'Agriculture & Agribusiness': [
        'Precision Agriculture', 'Vertical Farming', 'Aquaculture', 'Sustainable Forestry', 'Cold Chain Logistics', 'Fertilizer Production',
        'Seed Genetics', 'Livestock Management', 'Dairy Processing', 'Grain Trading', 'Agri-Insurance', 'Biomass Energy', 'Organic Certification'
    ],
    'Healthcare & Pharmaceuticals': [
        'Telemedicine', 'Medical Devices', 'Clinical Trials', 'Generic Manufacturing', 'Biotech R&D', 'Hospital Management',
        'Public Health Systems', 'Vaccine Distribution', 'Mental Health Services', 'Aged Care', 'Veterinary Medicine', 'Health Insurance'
    ],
    'Finance': [
        'Retail Banking', 'Investment Banking', 'Private Equity', 'Venture Capital', 'Microfinance', 'Insurance (Life/Non-Life)',
        'Wealth Management', 'Crypto Assets', 'Payment Gateways', 'Regulatory Tech (RegTech)', 'Sustainable Finance (Green Bonds)'
    ],
    'Manufacturing (Advanced)': [
        'Automotive Assembly', 'EV Battery Production', 'Textiles & Apparel', 'Electronics Assembly', 'Heavy Machinery', '3D Printing',
        'Chemical Processing', 'Plastics & Polymers', 'Food Processing', 'Packaging Solutions', 'Metal Fabrication', 'Aerospace Components'
    ],
    'Infrastructure & Construction': [
        'Residential Real Estate', 'Commercial Real Estate', 'Industrial Parks', 'Road & Highway', 'Rail & Transit', 'Airport Development',
        'Water Treatment', 'Waste Management', 'Smart City Systems', 'Affordable Housing', 'Port Infrastructure', 'Urban Regeneration'
    ],
    'Mining & Metals': [
        'Precious Metals (Gold/Silver)', 'Base Metals (Copper/Zinc)', 'Critical Minerals (Lithium/Cobalt)', 'Rare Earth Elements',
        'Coal Mining', 'Iron Ore', 'Gemstones', 'Mining Technology', 'Mine Rehabilitation', 'Smelting & Refining'
    ],
    'Tourism & Hospitality': [
        'Eco-Tourism', 'Luxury Resorts', 'Business Events (MICE)', 'Cultural Heritage', 'Adventure Travel', 'Cruise Tourism',
        'Hospitality Training', 'Travel Tech', 'Airline Operations', 'Theme Parks'
    ],
    'Default': [
        'General Operations', 'R&D', 'Manufacturing', 'Distribution', 'Sales & Marketing', 'Customer Support', 'Compliance', 
        'Logistics', 'Procurement', 'Human Resources', 'IT Support'
    ]
};

// Mapped mock data for cities with enriched metrics for matching
export const GLOBAL_CITY_DATABASE: Record<string, GlobalCityData> = {
  "USA": { 
      city: "New York", country: "USA", region: "North America", population: 8400000, gdp: 1800000000000, growthRate: 2.1,
      talentPool: { laborCosts: 10, educationLevel: 9, skillsAvailability: 9 },
      infrastructure: { transportation: 8, digital: 9, utilities: 8 },
      businessEnvironment: { easeOfDoingBusiness: 8, corruptionIndex: 2, regulatoryQuality: 8 },
      marketAccess: { domesticMarket: 10, exportPotential: 8 }
  },
  "Vietnam": { 
      city: "Ho Chi Minh City", country: "Vietnam", region: "Asia-Pacific", population: 9000000, gdp: 70000000000, growthRate: 6.5,
      talentPool: { laborCosts: 3, educationLevel: 6, skillsAvailability: 6 },
      infrastructure: { transportation: 5, digital: 6, utilities: 6 },
      businessEnvironment: { easeOfDoingBusiness: 6, corruptionIndex: 6, regulatoryQuality: 5 },
      marketAccess: { domesticMarket: 7, exportPotential: 9 }
  },
  "Australia": { 
      city: "Sydney", country: "Australia", region: "Asia-Pacific", population: 5300000, gdp: 350000000000, growthRate: 2.8,
      talentPool: { laborCosts: 9, educationLevel: 9, skillsAvailability: 8 },
      infrastructure: { transportation: 8, digital: 8, utilities: 9 },
      businessEnvironment: { easeOfDoingBusiness: 9, corruptionIndex: 1, regulatoryQuality: 9 },
      marketAccess: { domesticMarket: 6, exportPotential: 8 }
  },
  "UK": { 
      city: "London", country: "UK", region: "Europe", population: 9000000, gdp: 600000000000, growthRate: 1.5,
      talentPool: { laborCosts: 9, educationLevel: 9, skillsAvailability: 9 },
      infrastructure: { transportation: 9, digital: 9, utilities: 9 },
      businessEnvironment: { easeOfDoingBusiness: 9, corruptionIndex: 2, regulatoryQuality: 8 },
      marketAccess: { domesticMarket: 8, exportPotential: 8 }
  },
  "Germany": { 
      city: "Berlin", country: "Germany", region: "Europe", population: 3600000, gdp: 180000000000, growthRate: 1.2,
      talentPool: { laborCosts: 8, educationLevel: 8, skillsAvailability: 8 },
      infrastructure: { transportation: 9, digital: 8, utilities: 9 },
      businessEnvironment: { easeOfDoingBusiness: 8, corruptionIndex: 2, regulatoryQuality: 9 },
      marketAccess: { domesticMarket: 9, exportPotential: 9 }
  },
  "India": { 
      city: "Mumbai", country: "India", region: "Asia-Pacific", population: 20000000, gdp: 250000000000, growthRate: 7.1,
      talentPool: { laborCosts: 2, educationLevel: 6, skillsAvailability: 7 },
      infrastructure: { transportation: 5, digital: 7, utilities: 5 },
      businessEnvironment: { easeOfDoingBusiness: 6, corruptionIndex: 6, regulatoryQuality: 5 },
      marketAccess: { domesticMarket: 10, exportPotential: 7 }
  },
  "China": { 
      city: "Shanghai", country: "China", region: "Asia-Pacific", population: 26000000, gdp: 600000000000, growthRate: 5.5,
      talentPool: { laborCosts: 5, educationLevel: 7, skillsAvailability: 8 },
      infrastructure: { transportation: 9, digital: 9, utilities: 8 },
      businessEnvironment: { easeOfDoingBusiness: 7, corruptionIndex: 5, regulatoryQuality: 6 },
      marketAccess: { domesticMarket: 10, exportPotential: 10 }
  },
  "Japan": { 
      city: "Tokyo", country: "Japan", region: "Asia-Pacific", population: 37000000, gdp: 1600000000000, growthRate: 0.8,
      talentPool: { laborCosts: 9, educationLevel: 9, skillsAvailability: 9 },
      infrastructure: { transportation: 10, digital: 9, utilities: 10 },
      businessEnvironment: { easeOfDoingBusiness: 9, corruptionIndex: 1, regulatoryQuality: 8 },
      marketAccess: { domesticMarket: 9, exportPotential: 8 }
  },
  "UAE": { 
      city: "Dubai", country: "UAE", region: "Middle East", population: 3100000, gdp: 110000000000, growthRate: 3.5,
      talentPool: { laborCosts: 7, educationLevel: 7, skillsAvailability: 7 },
      infrastructure: { transportation: 9, digital: 9, utilities: 9 },
      businessEnvironment: { easeOfDoingBusiness: 8, corruptionIndex: 3, regulatoryQuality: 7 },
      marketAccess: { domesticMarket: 5, exportPotential: 9 }
  }
};

// UPDATED TIERS - SPECIFIC TO MATCHMAKING INTELLIGENCE DEPTH
const UNIVERSAL_AGENCY_TIERS = [
    { id: 'Tier 1', title: 'Global Scout (Rapid)', desc: 'High-velocity sweep of 50+ potential partners. Best for initial long-listing and market scanning.', agents: '5 Agents' },
    { id: 'Tier 2', title: 'Deep Symbiosis (Analysis)', desc: 'The Nexus Engine hunts for "unseen" value, calculating asymmetry, cost advantages, and hidden asset pairing.', agents: '20 Agents' },
    { id: 'Tier 3', title: 'Ecosystem Architecture (Strategic)', desc: 'Full-scale value chain design. Identifies suppliers, government allies, talent pools, and competitors in a single unified blueprint.', agents: 'Swarm Cluster' }
];

export const TIERS_BY_ORG_TYPE: any = {
    'Default': UNIVERSAL_AGENCY_TIERS,
    'Government': UNIVERSAL_AGENCY_TIERS,
    'Private Enterprise (MNC)': UNIVERSAL_AGENCY_TIERS,
    'Private Enterprise (SME)': UNIVERSAL_AGENCY_TIERS,
    'Financial Institution': UNIVERSAL_AGENCY_TIERS,
    'Academic / Research': UNIVERSAL_AGENCY_TIERS,
    'NGO': UNIVERSAL_AGENCY_TIERS
};

export const INDUSTRIES_BY_ORG_TYPE: any = {};
export const STEP_3_LABELS: any = { 'Default': { valueProp: 'Value Prop', objective: 'Objective' } };
export const SUCCESS_FACTORS = [
    { factor: 'Infrastructure Quality', weight: 0.25, description: 'Transport, digital, utilities', dataSources: ['World Bank'], measurement: 'Index 1-10' },
    { factor: 'Talent Availability', weight: 0.20, description: 'Skills, education, cost', dataSources: ['ILO'], measurement: 'Index 1-10' },
    { factor: 'Business Environment', weight: 0.20, description: 'Ease of doing business', dataSources: ['World Bank'], measurement: 'Ranking' },
    { factor: 'Market Access', weight: 0.15, description: 'Domestic & Export potential', dataSources: ['UN Comtrade'], measurement: 'USD Volume' },
    { factor: 'Innovation Ecosystem', weight: 0.10, description: 'Startups, R&D', dataSources: ['GII'], measurement: 'Index 1-100' },
    { factor: 'Cost Competitiveness', weight: 0.10, description: 'Labor, tax, utilities', dataSources: ['fDi Intelligence'], measurement: 'Index 1-10' },
];
export const STAKEHOLDER_PERSPECTIVES: Record<string, any> = {
    'Government': { persona: 'Government', priorities: ['Job Creation', 'Economic Growth'], concerns: ['Public Opinion'], successMetrics: ['Jobs'], riskFactors: ['Political Instability'], valueProposition: 'Boost Economy' },
    'Investor': { persona: 'Investor', priorities: ['ROI', 'Risk Mitigation'], concerns: ['Capital Loss'], successMetrics: ['IRR'], riskFactors: ['Market Volatility'], valueProposition: 'High Returns' }
};

// Flattened list of all countries for dropdowns
export const COUNTRIES = REGIONS_AND_COUNTRIES.flatMap(r => r.countries).sort();

export const DASHBOARD_CATEGORIES = [
    "Geopolitics",
    "Economics",
    "Technology",
    "Energy",
    "Trade"
];

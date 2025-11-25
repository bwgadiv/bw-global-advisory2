
export type SkillLevel = 'novice' | 'experienced' | 'expert';

export interface ReportParameters {
  reportName: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  userDepartment: string;
  organizationType: string;
  organizationSubType: string;
  customOrganizationType?: string;
  customOrganizationSubType?: string;
  userCountry: string;
  userCity?: string;
  userAddress?: string;
  userWebsite?: string;
  governmentLevel?: string;
  userTier: string;
  skillLevel: SkillLevel;
  region: string;
  country?: string;
  industry: string[];
  customIndustry: string;
  idealPartnerProfile: string;
  problemStatement: string;
  refinedProblemStatement?: string;
  analysisTimeframe: string;
  tier: string[];
  aiPersona: string[];
  customAiPersona: string;
  reportId: string;
  createdAt: string;
  status: 'draft' | 'generating' | 'complete' | 'failed';
  analyticalModules: string[];
  reportLength: 'brief' | 'standard' | 'detailed' | 'snapshot' | 'comprehensive';
  reportType?: string;
  outputFormat: 'report' | 'presentation' | 'memo';
  stakeholderPerspectives: string[];
  includeCrossSectorMatches: boolean;
  matchCount: number;
  partnershipSupportNeeds: string[];
  partnerDiscoveryMode: boolean;
  strategicMode: 'discovery' | 'analysis' | 'planning' | 'specific' | 'expansion';
  searchScope: 'Global' | 'Regional' | 'Domestic' | 'Local';
  intentTags: string[];
  comparativeContext: string[];
  additionalContext: string;
  relationshipStage: string;
  dueDiligenceDepth: string;
  partnerCapabilities: string[];
  operationalPriority: string;
  riskTolerance: string;
  expansionTimeline: string;
  targetPartner?: string;
  uploadedFileName?: string;
  uploadedDocument?: boolean;
  nicheAreas?: string[];
  comparisonHub?: string;
  strategicObjectives?: string[];
  strategicLens?: string[];
  persona?: string;
  organization?: string;
  valueProposition?: string;
  opportunityScore?: OpportunityScore;
  // New Fields for Design Studio
  initialThought?: string;
  selectedIntent?: string; // Legacy single select support
  selectedIntents?: string[]; // New multi-select support
}

export interface StrategicIntent {
    id: string;
    title: string;
    description: string;
    icon: any;
    recommendedModules: string[]; // IDs of modules to highlight
    personaAlignment: string[]; // Org types this is relevant for
}

export interface CanvasModule {
    id: string;
    title: string;
    icon: any;
    component: React.FC<any>;
    status: 'inactive' | 'recommended' | 'active' | 'complete';
    phase: string;
}

export interface UserProfile {
  name: string;
  role: string;
  department: string;
}

export interface GlobalCityData {
  city: string;
  country: string;
  region: string;
  population: number;
  gdp: number;
  growthRate: number;
  talentPool: { laborCosts: number; educationLevel: number; skillsAvailability: number };
  infrastructure: { transportation: number; digital: number; utilities: number };
  businessEnvironment: { easeOfDoingBusiness: number; corruptionIndex: number; regulatoryQuality: number };
  marketAccess: { domesticMarket: number; exportPotential: number };
}

export interface SuccessFactor {
  factor: string;
  weight: number;
  description: string;
  dataSources: string[];
  measurement: string;
}

export interface ComparativeAnalysis {
  primaryLocation: GlobalCityData;
  alternativeLocations: GlobalCityData[];
  successFactors: SuccessFactor[];
  comparativeScores: {
    location: string;
    totalScore: number;
    factorScores: Record<string, number>;
    strengths: string[];
    weaknesses: string[];
  }[];
  recommendations: {
    bestFit: string;
    rationale: string;
    riskLevel: string;
    investmentPotential: number;
  };
}

export type AgentType = 'scout' | 'strategist' | 'diplomat';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  agent?: AgentType;
  sources?: { title: string; uri: string }[];
}

export interface OpportunityScore {
  totalScore: number;
  marketPotential: number;
  riskFactors: number;
}

export interface ModuleScore {
  totalScore: number;
  complexityLevel: number;
  implementationTimeline: number;
}

export interface ComplexityScore {
  totalScore: number;
  technicalComplexity: number;
  regulatoryCompliance: number;
}

export interface Tier {
  id: string;
  name: string;
  description: string;
}

export interface AiSuggestion {
  text: string;
  rationale: string;
}

export interface LiveOpportunityItem {
  project_name: string;
  country: string;
  sector: string;
  value?: string;
  summary: string;
  source_url?: string;
  isUserAdded?: boolean;
  ai_feasibility_score?: number;
  ai_risk_assessment?: string;
}

export interface DashboardIntelligence {
    category: string;
    items: {
        company: string;
        details: string;
        implication: string;
        source: string;
        url: string;
    }[];
}

export interface SymbiosisContext {
    topic: string;
    originalContent: string;
}

export interface AgentHealthStatus {
  agentId: string;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'offline';
  lastResponseTime: number;
  errorCount: number;
  successRate: number;
  rateLimitRemaining: number;
  averageResponseTime: number;
}

export interface MultiAgentOrchestratorConfig {
  enabledAgents: string[];
  defaultConsensusMethod: 'confidence-weighted' | 'simple-majority' | 'unanimous';
  minConsensusThreshold: number;
  maxParallelTasks: number;
  taskTimeout: number;
  retryAttempts: number;
  fallbackToSingleAgent: boolean;
}

export interface AIAgentConfig {
  provider: string;
  model: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
  enabled: boolean;
  priority: number;
  specializations: string[];
  rateLimits: { requestsPerMinute: number; requestsPerHour: number };
}

export interface MultiAgentTask {
  id: string;
  prompt: string;
  requiredAgents: number;
  consensusMethod: 'confidence-weighted' | 'simple-majority' | 'unanimous';
  timeout: number;
  context?: any;
}

export interface AgentResponse {
  agentId: string;
  provider: string;
  model: string;
  content: string;
  confidence: number;
  reasoning: string;
  processingTime: number;
  tokensUsed: number;
  timestamp: string;
  metadata?: any;
}

export interface ConsensusResult {
  consensusContent: string;
  confidence: number;
  agreementLevel: 'unanimous' | 'majority' | 'split';
  participatingAgents: string[];
  dissentingOpinions: { agentId: string; alternativeContent: string; reasoning: string }[];
  metadata: {
    totalAgents: number;
    consensusMethod: string;
    processingTime: number;
  };
}

export interface MultiAgentAnalysis {
  task: MultiAgentTask;
  responses: AgentResponse[];
  consensus: ConsensusResult;
  status: 'processing' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  error?: string;
}

export interface AlternativeLocationMatch {
  originalLocation: GlobalCityData;
  matchedLocations: {
    location: GlobalCityData;
    matchScore: number;
    matchReasons: string[];
    improvementAreas: string[];
    transitionChallenges: string[];
  }[];
  relocationStrategy: {
    timeline: string;
    resourceRequirements: string[];
    riskMitigation: string[];
    successProbability: number;
  };
}

export interface GenerativeModel {
    modelName: string;
    description?: string;
    summary?: string;
    corePrinciples: { principle: string; rationale: string }[];
}

export type View = 'who-we-are' | 'opportunities' | 'report-entry' | 'compliance';

export interface PersonaOption {
    id: string;
    title: string;
    description: string;
    icon: any;
    applicableOrgs: string[];
    applicableIndustries: string[];
}

export interface IndustryOption {
    id: string;
    title: string;
    icon: any;
}

// --- New Types for AI/Agent Services ---

export interface MultiAgentResponse {
    agent: AgentType;
    content: string;
    sources?: { title: string; uri: string }[];
}

export interface IVASAnalysis {
    score: number;
    activationVelocity: string;
    regulatoryFriction: 'Low' | 'Medium' | 'High';
    politicalWill: number;
    catalystEvent: string;
}

export interface LAIAnalysis {
    latentAssets: {
        asset: string;
        potential: string;
        symbiosis: string;
    }[];
}

export interface SCFAnalysis {
    directJobs: number;
    indirectJobs: number;
    fiscalImpact: string;
    ecosystemRipple: string[];
}

export interface URPMetrics {
    economicPotential: number;
    marketAccessibility: number;
    infrastructureReadiness: number;
    regulatoryEnvironment: number;
    humanCapitalAvailability: number;
}

export interface NSILAnalysis {
    urpIndex: number;
    agerRiskScore: number;
    gsmPartnerMatches: number;
    recommendedTier: string;
    calculatedPrice: number;
    keyOpportunities: string[];
    keyRisks: string[];
    summary: string;
    confidenceScore: number;
    escalationRequired: boolean;
}

export interface SmartTradeOfficerResponse {
    guidance: string;
    actionItems: string[];
    timelineEstimate: string;
    riskFactors: string[];
    recommendedContacts: string[];
}

export type AnalysisMode = 'matchmaking' | 'market_analysis' | 'g2g_alignment';

export interface NSIL_ExecutiveSummary {
  overall_score: number;
  key_findings: string[];
  strategic_outlook: string;
}

export interface NSIL_MatchScore {
  value: number;
  confidence: 'High' | 'Medium' | 'Low';
  rationale: string;
}

export interface NSIL_CompanyProfile {
  name: string;
  origin: string;
  size: string;
  key_technologies: string[];
  target_markets: string[];
  strategic_focus: string;
}

export interface NSIL_SynergyAnalysis {
  strategic_alignment: number;
  complementary_strengths: string[];
  competitive_advantages: string[];
  risk_factors: string[];
  mitigation_strategies: string[];
}

export interface NSIL_RiskCategory {
  level: number;
  factors: string[];
}

export interface NSIL_RiskMap {
  overall_risk: 'Low' | 'Medium' | 'High';
  risk_categories: {
    geopolitical: NSIL_RiskCategory;
    market: NSIL_RiskCategory;
    operational: NSIL_RiskCategory;
    regulatory: NSIL_RiskCategory;
  };
  contingency_plans: string[];
}

export interface NSIL_Match {
  company_profile: NSIL_CompanyProfile;
  synergy_analysis: NSIL_SynergyAnalysis;
  risk_map: NSIL_RiskMap;
}

export interface NSIL_LQ_Analysis {
  industry: string;
  value: number;
  interpretation: string;
  benchmark_regions: string[];
  implications: string[];
}

export interface NSIL_ClusterAnalysis {
  anchor_industry: string;
  supporting_sectors: string[];
  supply_chain_gaps: string[];
  growth_potential: number;
  regional_advantages: string[];
}

export interface NSIL_RegionalImpact {
  effect: 'positive' | 'negative' | 'mixed';
  description: string;
}

export interface NSIL_Scenario {
  name: string;
  drivers: string[];
  regional_impact: NSIL_RegionalImpact;
  recommendation: string;
  probability: number;
}

export interface NSIL_FutureCast {
  scenarios: NSIL_Scenario[];
  key_uncertainties: string[];
  recommended_actions: string[];
}

export interface FinancialFeasibility {
  irr: number;
  npv: number;
  payback_period: number;
  risk_adjusted_return: number;
  funding_requirements: number;
  roi_projections: { year: number; value: number }[];
}

export interface DevelopmentBankAlignment {
  bank_name: string;
  mandate_match: number;
  eligible_programs: string[];
  application_requirements: string[];
  success_probability: number;
}

export interface ClimateImpactProjection {
  timeframe: string;
  physical_risks: {
    flooding_days_increase: number;
    temperature_rise: number;
    extreme_weather_events: string[];
  };
  economic_impacts: {
    asset_damage: number;
    productivity_loss: number;
    adaptation_costs: number;
  };
  mitigation_strategies: string[];
}

export interface GeopoliticalInstabilityForecast {
  current_stability: number;
  emerging_risks: {
    risk: string;
    probability: number;
    timeline: string;
    potential_impact: string;
  }[];
  early_warning_indicators: string[];
  contingency_planning: string[];
}

export interface PolicyRecommendation {
  policy_area: string;
  current_gap: string;
  recommended_actions: string[];
  successful_examples: {
    region: string;
    policy: string;
    outcomes: string[];
  }[];
  implementation_timeline: string;
  expected_impact: string;
}

export interface ESG_Framework {
  environmental_score: number;
  social_score: number;
  governance_score: number;
  key_indicators: {
    category: string;
    metric: string;
    current_value: number;
    target_value: number;
    action_plan: string;
  }[];
  compliance_status: {
    standard: string;
    compliance_level: number;
    gaps: string[];
    required_actions: string[];
  }[];
}

export interface NSIL_Report {
  mode: AnalysisMode;
  executive_summary: NSIL_ExecutiveSummary;
  source_attribution: string[];
  match_score?: NSIL_MatchScore;
  match?: NSIL_Match;
  lq_analysis?: NSIL_LQ_Analysis[];
  cluster_analysis?: NSIL_ClusterAnalysis[];
  future_cast?: NSIL_FutureCast;
  financial_feasibility?: FinancialFeasibility;
  development_bank_alignment?: DevelopmentBankAlignment[];
  climate_impact?: ClimateImpactProjection;
  geopolitical_forecast?: GeopoliticalInstabilityForecast;
  policy_recommendations?: PolicyRecommendation[];
  esg_framework?: ESG_Framework;
}

export interface ReportSuggestions {
    objectives: string[];
    partners: string[];
}

export interface RROI_Component {
    name: string;
    score: number;
    analysis: string;
  }

export interface RROI_Index {
    overallScore: number;
    summary: string;
    components: Record<string, RROI_Component>;
}

export interface SEAM_Partner {
    entity: string;
    type: string; // e.g. Government, NGO, Tech Partner
    rationale: string;
}

export interface SEAM_Blueprint {
    ecosystemSummary: string;
    partners: SEAM_Partner[];
}

// New Types for Symbiotic Matching & Deep Reasoning
export interface SymbioticPartner {
    entityName: string;
    entityType: string;
    location: string;
    symbiosisScore: number; // 0-100
    asymmetryAnalysis: string; // Why the small guy matches the big guy
    mutualBenefit: string; // The win-win
    riskFactors: string[];
}

export interface DeepReasoningAnalysis {
    verdict: 'Strong Buy' | 'Cautious Proceed' | 'Hard Pass';
    dealKillers: string[];
    hiddenGems: string[];
    reasoningChain: string[]; // Step-by-step logic
    counterIntuitiveInsight: string; // "Why everyone else is wrong about this"
}

// --- Geopolitical & Governance Types ---

export interface GeopoliticalAnalysisResult {
    stabilityScore: number; // 0-100
    forecast: string; // Narrative
    currencyRisk: 'Low' | 'Medium' | 'High' | 'Volatile';
    inflationTrend: 'Stable' | 'Rising' | 'Hyper';
    regionalConflictRisk: number; // 0-100
    tradeBarriers: string[];
}

export interface GovernanceAuditResult {
    governanceScore: number; // 0-100
    corruptionRisk: 'Low' | 'Medium' | 'High' | 'Critical';
    regulatoryFriction: number; // 0-100 (High is bad)
    transparencyIndex: number; // 0-100
    redFlags: string[];
    complianceRoadmap: string[];
}

// --- Latent Asset Types ---
export interface RawFeature {
  name: string;
  rarityScore?: number; // 0..10
  relevanceScore?: number; // 0..10
  marketProxy?: number; // heuristic numeric
}

export interface RegionProfile {
  id: string;
  name: string;
  country?: string;
  rawFeatures?: RawFeature[];
  population?: number;
  gdp?: number;
}

export interface LatentAsset {
  id: string;
  title: string;
  description: string;
  components: string[];
  synergyScore: number;
  marketEstimateUSD: number;
  recommendedNextSteps: string[];
}

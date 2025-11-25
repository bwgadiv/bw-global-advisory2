
export interface MarketShare {
  country: string;
  share: number; // percentage 0-100
}

export interface MarketOpportunity {
  country: string;
  region: string;
  opportunityScore: number; // 0-100
  marketSize: string;
  growthRate: number; // percentage
  easeOfEntry: number; // 0-100
  regulatoryFriction: number; // 0-100 (Lower is better)
  talentAvailability: number; // 0-100
  innovationIndex: number; // 0-100
  recommendedStrategy: 'Direct Export' | 'Strategic Partnership' | 'Joint Venture' | 'Acquisition' | 'Greenfield Investment';
  rationale: string;
  keySectors: string[];
}

export interface DiversificationAnalysis {
  hhiScore: number; // Herfindahl-Hirschman Index
  riskLevel: 'Diversified' | 'Moderate Concentration' | 'High Concentration' | 'Critical Dependency';
  concentrationAnalysis: string;
  recommendedMarkets: MarketOpportunity[];
}

export class MarketDiversificationEngine {
  
  /**
   * Calculates the Herfindahl-Hirschman Index (HHI) to measure market concentration.
   * HHI < 1500: Diversified
   * 1500 <= HHI < 2500: Moderate Concentration
   * HHI >= 2500: High Concentration
   */
  static analyzeConcentration(markets: MarketShare[]): DiversificationAnalysis {
    const squares = markets.map(m => Math.pow(m.share, 2));
    const hhi = squares.reduce((a, b) => a + b, 0);
    
    let riskLevel: DiversificationAnalysis['riskLevel'];
    let analysis: string;

    if (hhi < 1500) {
      riskLevel = 'Diversified';
      analysis = "Healthy market spread. Low vulnerability to single-market shocks.";
    } else if (hhi < 2500) {
      riskLevel = 'Moderate Concentration';
      analysis = "Developing dependencies. Specific regional shocks could impact revenue stability.";
    } else if (hhi < 4000) {
      riskLevel = 'High Concentration';
      analysis = "Significant reliance on key markets. Strategic diversification is recommended.";
    } else {
      riskLevel = 'Critical Dependency';
      analysis = "Critical vulnerability. Immediate expansion into uncorrelated markets is required.";
    }

    const recommendations = this.generateRecommendations(markets);

    return {
      hhiScore: hhi,
      riskLevel,
      concentrationAnalysis: analysis,
      recommendedMarkets: recommendations
    };
  }

  private static generateRecommendations(currentMarkets: MarketShare[]): MarketOpportunity[] {
    // Pool of potential high-growth markets
    const candidateMarkets: MarketOpportunity[] = [
      {
        country: 'Vietnam',
        region: 'APAC',
        opportunityScore: 88,
        marketSize: '$430B',
        growthRate: 6.5,
        easeOfEntry: 60,
        regulatoryFriction: 45,
        talentAvailability: 75,
        innovationIndex: 55,
        recommendedStrategy: 'Strategic Partnership',
        rationale: "Alternative manufacturing hub with preferential trade agreements.",
        keySectors: ['Manufacturing', 'Textiles', 'Electronics']
      },
      {
        country: 'India',
        region: 'South Asia',
        opportunityScore: 92,
        marketSize: '$3.5T',
        growthRate: 7.2,
        easeOfEntry: 50,
        regulatoryFriction: 60,
        talentAvailability: 90,
        innovationIndex: 85,
        recommendedStrategy: 'Joint Venture',
        rationale: "Massive domestic demand and unmatched tech talent pool.",
        keySectors: ['Tech', 'Pharma', 'Services']
      },
      {
        country: 'Poland',
        region: 'Europe',
        opportunityScore: 78,
        marketSize: '$680B',
        growthRate: 4.1,
        easeOfEntry: 80,
        regulatoryFriction: 30,
        talentAvailability: 82,
        innovationIndex: 70,
        recommendedStrategy: 'Direct Export',
        rationale: "Gateway to EU with lower operational costs than Western Europe.",
        keySectors: ['Logistics', 'Automotive', 'IT']
      },
      {
        country: 'Saudi Arabia',
        region: 'MENA',
        opportunityScore: 85,
        marketSize: '$1.1T',
        growthRate: 5.4,
        easeOfEntry: 65,
        regulatoryFriction: 50,
        talentAvailability: 60,
        innovationIndex: 65,
        recommendedStrategy: 'Greenfield Investment',
        rationale: "Vision 2030 incentives create high ROI for infrastructure and tech.",
        keySectors: ['Energy', 'Construction', 'Tourism']
      },
      {
        country: 'Brazil',
        region: 'LATAM',
        opportunityScore: 72,
        marketSize: '$1.9T',
        growthRate: 3.0,
        easeOfEntry: 55,
        regulatoryFriction: 70,
        talentAvailability: 70,
        innovationIndex: 60,
        recommendedStrategy: 'Acquisition',
        rationale: "Dominant regional player; acquisition bypasses complex local bureaucracy.",
        keySectors: ['Agriculture', 'Fintech', 'Mining']
      },
      {
        country: 'Indonesia',
        region: 'APAC',
        opportunityScore: 81,
        marketSize: '$1.3T',
        growthRate: 5.1,
        easeOfEntry: 58,
        regulatoryFriction: 55,
        talentAvailability: 65,
        innovationIndex: 62,
        recommendedStrategy: 'Joint Venture',
        rationale: "Largest economy in Southeast Asia with rapidly growing middle class.",
        keySectors: ['E-commerce', 'Infrastructure', 'Mining']
      }
    ];

    // Filter out markets where the company already has > 5% share
    const currentCountries = currentMarkets.filter(m => m.share > 5).map(m => m.country);
    return candidateMarkets
      .filter(m => !currentCountries.includes(m.country))
      .sort((a, b) => b.opportunityScore - a.opportunityScore)
      .slice(0, 3);
  }
}


import React, { useState, useEffect } from 'react';
import type { GlobalCityData, AlternativeLocationMatch } from '../types';
import { GLOBAL_CITY_DATABASE } from '../constants';
import { GeospatialIcon, ShieldCheckIcon, QuestionMarkCircleIcon, MapPinIcon } from './Icons';

interface AlternativeLocationMatcherProps {
  originalLocation: GlobalCityData;
  requirements: {
    minPopulation?: number;
    maxCost?: number;
    minInfrastructure?: number;
    preferredRegion?: string;
    businessFocus?: string[];
  };
  onMatchesFound?: (matches: AlternativeLocationMatch) => void;
}

const AlternativeLocationMatcher: React.FC<AlternativeLocationMatcherProps> = ({
  originalLocation,
  requirements,
  onMatchesFound = () => {}
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [matches, setMatches] = useState<AlternativeLocationMatch | null>(null);
  const [searchCriteria, setSearchCriteria] = useState(requirements);

  const calculateMatchScore = (candidate: GlobalCityData, original: GlobalCityData): number => {
    let score = 0;
    let maxScore = 0;

    // Population match (if specified)
    if (searchCriteria.minPopulation) {
      maxScore += 20;
      if (candidate.population >= searchCriteria.minPopulation) {
        score += 20;
      } else {
        score += (candidate.population / searchCriteria.minPopulation) * 20;
      }
    }

    // Cost competitiveness (if specified)
    if (searchCriteria.maxCost !== undefined) {
      maxScore += 15;
      const costScore = Math.max(0, 10 - candidate.talentPool.laborCosts);
      if (costScore >= searchCriteria.maxCost) {
        score += 15;
      } else {
        score += (costScore / searchCriteria.maxCost) * 15;
      }
    }

    // Infrastructure quality
    maxScore += 25;
    const infraScore = (
      candidate.infrastructure.transportation +
      candidate.infrastructure.digital +
      candidate.infrastructure.utilities
    ) / 3;
    const requiredInfra = searchCriteria.minInfrastructure || 7;
    if (infraScore >= requiredInfra) {
      score += 25;
    } else {
      score += (infraScore / requiredInfra) * 25;
    }

    // Business environment
    maxScore += 20;
    const businessScore = (
      candidate.businessEnvironment.easeOfDoingBusiness +
      candidate.businessEnvironment.corruptionIndex +
      candidate.businessEnvironment.regulatoryQuality
    ) / 3;
    score += (businessScore / 10) * 20;

    // Regional preference
    maxScore += 10;
    if (!searchCriteria.preferredRegion || candidate.region === searchCriteria.preferredRegion) {
      score += 10;
    } else {
      // Partial credit for same continent
      score += 5;
    }

    // Market access
    maxScore += 10;
    const marketScore = (
      candidate.marketAccess.domesticMarket +
      candidate.marketAccess.exportPotential
    ) / 2;
    score += (marketScore / 10) * 10;

    return maxScore > 0 ? (score / maxScore) * 100 : 0;
  };

  const findAlternativeLocations = async () => {
    setIsSearching(true);

    try {
      // Simulate search time
      await new Promise(resolve => setTimeout(resolve, 2500));

      const candidates = Object.values(GLOBAL_CITY_DATABASE)
        .filter(city => city.city !== originalLocation?.city)
        .map(city => ({
          location: city,
          matchScore: calculateMatchScore(city, originalLocation || { city: '', region: '', population: 0, talentPool: { laborCosts: 0 }, infrastructure: { transportation: 0, digital: 0, utilities: 0 }, businessEnvironment: { easeOfDoingBusiness: 0, corruptionIndex: 0, regulatoryQuality: 0 }, marketAccess: { domesticMarket: 0, exportPotential: 0 } } as any),
          matchReasons: generateMatchReasons(city, originalLocation || {} as any),
          improvementAreas: generateImprovementAreas(city, originalLocation || {} as any),
          transitionChallenges: generateTransitionChallenges(city, originalLocation || {} as any)
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5); // Top 5 matches

      const relocationStrategy = {
        timeline: '18-24 months',
        resourceRequirements: [
          'Legal and regulatory compliance team',
          'Local partnership development',
          'Infrastructure assessment and planning',
          'Workforce transition and training',
          'Supply chain reconfiguration'
        ],
        riskMitigation: [
          'Phased transition approach',
          'Parallel operations during transition',
          'Local market expertise acquisition',
          'Regulatory compliance assurance',
          'Stakeholder communication plan'
        ],
        successProbability: candidates[0]?.matchScore > 80 ? 85 :
                           candidates[0]?.matchScore > 70 ? 75 :
                           candidates[0]?.matchScore > 60 ? 65 : 55
      };

      const alternativeMatch: AlternativeLocationMatch = {
        originalLocation: originalLocation || {} as any,
        matchedLocations: candidates,
        relocationStrategy
      };

      setMatches(alternativeMatch);
      onMatchesFound(alternativeMatch);

    } catch (error) {
      console.error('Alternative location matching failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const generateMatchReasons = (candidate: GlobalCityData, original: GlobalCityData): string[] => {
    const reasons: string[] = [];

    if (candidate.infrastructure && original.infrastructure && candidate.infrastructure.transportation > original.infrastructure.transportation) {
      reasons.push('Superior transportation infrastructure');
    }
    if (candidate.talentPool && original.talentPool && candidate.talentPool.laborCosts < original.talentPool.laborCosts) {
      reasons.push('Lower operational costs');
    }
    if (candidate.businessEnvironment && original.businessEnvironment && candidate.businessEnvironment.corruptionIndex > original.businessEnvironment.corruptionIndex) {
      reasons.push('Better governance and lower corruption');
    }
    if (candidate.marketAccess && original.marketAccess && candidate.marketAccess.exportPotential > original.marketAccess.exportPotential) {
      reasons.push('Stronger export market access');
    }
    if (candidate.talentPool && original.talentPool && candidate.talentPool.educationLevel > original.talentPool.educationLevel) {
      reasons.push('Higher quality education system');
    }

    return reasons;
  };

  const generateImprovementAreas = (candidate: GlobalCityData, original: GlobalCityData): string[] => {
    const areas: string[] = [];

    if (candidate.population < (original.population || 0) * 0.5) {
      areas.push('Smaller market size may limit domestic opportunities');
    }
    if (candidate.businessEnvironment && original.businessEnvironment && candidate.businessEnvironment.regulatoryQuality < original.businessEnvironment.regulatoryQuality) {
      areas.push('More complex regulatory environment');
    }
    if (candidate.infrastructure && original.infrastructure && candidate.infrastructure.digital < original.infrastructure.digital) {
      areas.push('Less developed digital infrastructure');
    }
    if (candidate.talentPool && original.talentPool && candidate.talentPool.skillsAvailability < original.talentPool.skillsAvailability) {
      areas.push('Potential skills gap in specialized areas');
    }

    return areas;
  };

  const generateTransitionChallenges = (candidate: GlobalCityData, original: GlobalCityData): string[] => {
    const challenges: string[] = [];

    if (candidate.region !== original.region) {
      challenges.push('Cross-regional relocation logistics');
    }
    if (candidate.businessEnvironment && original.businessEnvironment && Math.abs(candidate.businessEnvironment.regulatoryQuality - original.businessEnvironment.regulatoryQuality) > 2) {
      challenges.push('Regulatory environment adaptation');
    }
    if (candidate.talentPool && original.talentPool && candidate.talentPool.laborCosts < original.talentPool.laborCosts * 0.7) {
      challenges.push('Potential quality vs cost trade-offs');
    }
    challenges.push('Local partnership and network development');
    challenges.push('Cultural and business practice adaptation');

    return challenges;
  };

  useEffect(() => {
    setSearchCriteria(requirements);
  }, [requirements]);

  const updateCriteria = (key: string, value: any) => {
    setSearchCriteria(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shadow-md border border-orange-200">
          <GeospatialIcon className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Alternative Location Matcher</h3>
          <p className="text-gray-600 text-sm">Find better-matched locations for your requirements</p>
        </div>
      </div>

      {/* Search Criteria */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Search Criteria</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Population
            </label>
            <input
              type="number"
              value={searchCriteria.minPopulation || ''}
              onChange={(e) => updateCriteria('minPopulation', parseInt(e.target.value) || undefined)}
              placeholder="e.g., 1000000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Labor Cost (1-10 scale)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={searchCriteria.maxCost || ''}
              onChange={(e) => updateCriteria('maxCost', parseInt(e.target.value) || undefined)}
              placeholder="e.g., 7"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Infrastructure Score
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={searchCriteria.minInfrastructure || ''}
              onChange={(e) => updateCriteria('minInfrastructure', parseInt(e.target.value) || undefined)}
              placeholder="e.g., 7"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Region
            </label>
            <select
              value={searchCriteria.preferredRegion || ''}
              onChange={(e) => updateCriteria('preferredRegion', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              title="Select preferred region"
            >
              <option value="">Any Region</option>
              <option value="Asia-Pacific">Asia-Pacific</option>
              <option value="Europe">Europe</option>
              <option value="North America">North America</option>
              <option value="South America">South America</option>
              <option value="Middle East & North Africa">Middle East & North Africa</option>
              <option value="Sub-Saharan Africa">Sub-Saharan Africa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className="mb-6">
        <button
          onClick={findAlternativeLocations}
          disabled={isSearching}
          className="w-full bg-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isSearching ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Finding Alternative Locations...
            </>
          ) : (
            <>
              <GeospatialIcon className="w-5 h-5" />
              Find Alternative Locations
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {matches && (
        <div className="space-y-6">
          {/* Top Match Highlight */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
            <ShieldCheckIcon className="w-5 h-5 text-green-600" />
            <h4 className="text-lg font-semibold text-green-800">Best Alternative Found</h4>
          </div>
            <div className="bg-white p-3 rounded border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="font-bold text-gray-900">{matches.matchedLocations[0].location.city}</h5>
                  <p className="text-sm text-gray-600">{matches.matchedLocations[0].location.country}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {matches.matchedLocations[0].matchScore.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">Match Score</div>
                </div>
              </div>
              <div className="text-sm text-gray-700">
                <strong>Why it matches:</strong> {matches.matchedLocations[0].matchReasons.join(', ')}
              </div>
            </div>
          </div>

          {/* All Matches */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">All Alternative Locations</h4>
            {matches.matchedLocations.map((match, index) => (
              <div key={match.location.city} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-green-100 text-green-800' :
                      index === 1 ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">{match.location.city}</h5>
                      <p className="text-sm text-gray-600">{match.location.country} • {match.location.region}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      match.matchScore >= 80 ? 'text-green-600' :
                      match.matchScore >= 70 ? 'text-blue-600' :
                      match.matchScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {match.matchScore.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Match Score</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-700 mb-1">Match Reasons:</div>
                    <ul className="text-gray-600 space-y-1">
                      {match.matchReasons.map((reason, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <ShieldCheckIcon className="w-3 h-3 text-green-500 flex-shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700 mb-1">Considerations:</div>
                    <ul className="text-gray-600 space-y-1">
                      {match.improvementAreas.map((area, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <QuestionMarkCircleIcon className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="font-medium text-gray-700 mb-1">Transition Challenges:</div>
                  <div className="text-sm text-gray-600">
                    {match.transitionChallenges.join(' • ')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Relocation Strategy */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-800 mb-3">Relocation Strategy</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-blue-900 mb-2">Timeline & Resources</h5>
                <div className="text-sm text-blue-700 space-y-1">
                  <div><strong>Timeline:</strong> {matches.relocationStrategy.timeline}</div>
                  <div><strong>Success Probability:</strong> {matches.relocationStrategy.successProbability}%</div>
                </div>
                <div className="mt-2">
                  <div className="font-medium text-blue-900 mb-1">Resource Requirements:</div>
                  <ul className="text-xs text-blue-700 space-y-1">
                    {matches.relocationStrategy.resourceRequirements.map((resource, i) => (
                      <li key={i}>• {resource}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <h5 className="font-medium text-blue-900 mb-2">Risk Mitigation</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  {matches.relocationStrategy.riskMitigation.map((mitigation, i) => (
                    <li key={i}>• {mitigation}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {!matches && !isSearching && (
        <div className="text-center py-12 text-gray-500">
          <MapPinIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Configure your requirements above and click "Find Alternative Locations"</p>
          <p className="text-sm mt-2">We'll analyze global cities to find better matches for your needs</p>
        </div>
      )}
    </div>
  );
};

export default AlternativeLocationMatcher;

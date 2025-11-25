
import React, { useState, useEffect } from 'react';
import type { GlobalCityData, ComparativeAnalysis, SuccessFactor } from '../types.ts';
import { GLOBAL_CITY_DATABASE, SUCCESS_FACTORS } from '../constants.tsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface GlobalComparativeEngineProps {
  primaryLocation: GlobalCityData;
  onAnalysisComplete: (analysis: ComparativeAnalysis) => void;
}

const GlobalComparativeEngine: React.FC<GlobalComparativeEngineProps> = ({
  primaryLocation,
  onAnalysisComplete
}) => {
  const [selectedAlternatives, setSelectedAlternatives] = useState<GlobalCityData[]>([]);
  const [analysis, setAnalysis] = useState<ComparativeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Get potential alternative locations based on region and characteristics
  const getAlternativeLocations = (primary: GlobalCityData): GlobalCityData[] => {
    const alternatives = Object.values(GLOBAL_CITY_DATABASE)
      .filter(city => city.city !== primary.city)
      .sort((a, b) => {
        // Score based on similarity to primary location
        const scoreA = calculateSimilarityScore(primary, a);
        const scoreB = calculateSimilarityScore(primary, b);
        return scoreB - scoreA;
      })
      .slice(0, 5); // Top 5 alternatives

    return alternatives;
  };

  const calculateSimilarityScore = (primary: GlobalCityData, alternative: GlobalCityData): number => {
    let score = 0;

    // Regional proximity (higher score for same region)
    if (primary.region === alternative.region) score += 20;

    // Economic similarity
    const gdpDiff = Math.abs(primary.gdp - alternative.gdp) / Math.max(primary.gdp, alternative.gdp);
    score += (1 - gdpDiff) * 15;

    // Population similarity
    const popDiff = Math.abs(primary.population - alternative.population) / Math.max(primary.population, alternative.population);
    score += (1 - popDiff) * 10;

    // Infrastructure compatibility
    const infraScore = (
      (10 - Math.abs(primary.infrastructure.transportation - alternative.infrastructure.transportation)) +
      (10 - Math.abs(primary.infrastructure.digital - alternative.infrastructure.digital)) +
      (10 - Math.abs(primary.infrastructure.utilities - alternative.infrastructure.utilities))
    ) / 3;
    score += infraScore * 2;

    return score;
  };

  const performComparativeAnalysis = async () => {
    setIsAnalyzing(true);

    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const comparativeScores = [primaryLocation, ...selectedAlternatives].map(location => {
        const factorScores: Record<string, number> = {};

        SUCCESS_FACTORS.forEach(factor => {
          let score = 0;

          switch (factor.factor) {
            case 'Infrastructure Quality':
              score = (
                location.infrastructure.transportation +
                location.infrastructure.digital +
                location.infrastructure.utilities
              ) / 3;
              break;
            case 'Talent Availability':
              score = (
                location.talentPool.educationLevel +
                location.talentPool.skillsAvailability
              ) / 2;
              break;
            case 'Business Environment':
              score = (
                location.businessEnvironment.easeOfDoingBusiness +
                location.businessEnvironment.corruptionIndex +
                location.businessEnvironment.regulatoryQuality
              ) / 3;
              break;
            case 'Market Access':
              score = (
                location.marketAccess.domesticMarket +
                location.marketAccess.exportPotential
              ) / 2;
              break;
            case 'Innovation Ecosystem':
              score = 7.5; // Placeholder - would need real innovation data
              break;
            case 'Cost Competitiveness':
              score = 10 - location.talentPool.laborCosts; // Inverse relationship
              break;
          }

          factorScores[factor.factor] = score * factor.weight;
        });

        const totalScore = Object.values(factorScores).reduce((sum, score) => sum + score, 0);

        return {
          location: location.city,
          totalScore: Math.round(totalScore * 10) / 10,
          factorScores,
          strengths: getLocationStrengths(location, factorScores),
          weaknesses: getLocationWeaknesses(location, factorScores)
        };
      });

      const bestAlternative = comparativeScores
        .filter(score => score.location !== primaryLocation.city)
        .sort((a, b) => b.totalScore - a.totalScore)[0];

      const comparativeAnalysis: ComparativeAnalysis = {
        primaryLocation,
        alternativeLocations: selectedAlternatives,
        successFactors: SUCCESS_FACTORS,
        comparativeScores,
        recommendations: {
          bestFit: bestAlternative ? bestAlternative.location : primaryLocation.city,
          rationale: bestAlternative ? generateRecommendationRationale(primaryLocation, bestAlternative) : "Primary location remains the best fit.",
          riskLevel: bestAlternative && bestAlternative.totalScore > 7 ? 'Low' : 'Medium',
          investmentPotential: bestAlternative ? bestAlternative.totalScore : 5
        }
      };

      setAnalysis(comparativeAnalysis);
      onAnalysisComplete(comparativeAnalysis);

    } catch (error) {
      console.error('Comparative analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getLocationStrengths = (location: GlobalCityData, factorScores: Record<string, number>): string[] => {
    const strengths: string[] = [];

    if (location.infrastructure.transportation > 8) strengths.push('Excellent transportation infrastructure');
    if (location.talentPool.educationLevel > 8.5) strengths.push('High-quality education system');
    if (location.businessEnvironment.corruptionIndex > 8) strengths.push('Strong governance and low corruption');
    if (location.marketAccess.exportPotential > 8.5) strengths.push('Excellent export market access');

    return strengths;
  };

  const getLocationWeaknesses = (location: GlobalCityData, factorScores: Record<string, number>): string[] => {
    const weaknesses: string[] = [];

    if (location.talentPool.laborCosts > 8) weaknesses.push('High labor costs');
    if (location.businessEnvironment.regulatoryQuality < 7) weaknesses.push('Complex regulatory environment');
    if (location.infrastructure.digital < 7.5) weaknesses.push('Limited digital infrastructure');

    return weaknesses;
  };

  const generateRecommendationRationale = (primary: GlobalCityData, alternative: any): string => {
    return `${alternative.location} offers similar characteristics to ${primary.city} with potentially better growth opportunities and cost efficiencies.`;
  };

  useEffect(() => {
    const alternatives = getAlternativeLocations(primaryLocation);
    setSelectedAlternatives(alternatives.slice(0, 3)); // Auto-select top 3
  }, [primaryLocation]);

  const chartData = analysis?.comparativeScores.map(score => ({
    location: score.location,
    score: score.totalScore,
    ...score.factorScores
  })) || [];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-md border border-blue-200">
          <span className="text-2xl">🌍</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Global Comparative Analysis</h3>
          <p className="text-gray-600 text-sm">Compare {primaryLocation.city} with alternative locations worldwide</p>
        </div>
      </div>

      {/* Alternative Locations Selection */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Alternative Locations</h4>
        <div className="grid md:grid-cols-3 gap-4">
          {getAlternativeLocations(primaryLocation).map((location) => (
            <label key={location.city} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedAlternatives.some(alt => alt.city === location.city)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedAlternatives([...selectedAlternatives, location]);
                  } else {
                    setSelectedAlternatives(selectedAlternatives.filter(alt => alt.city !== location.city));
                  }
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div>
                <div className="font-medium text-gray-900">{location.city}</div>
                <div className="text-sm text-gray-500">{location.country}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Analysis Button */}
      <div className="mb-6">
        <button
          onClick={performComparativeAnalysis}
          disabled={isAnalyzing || selectedAlternatives.length === 0}
          className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalyzing ? 'Analyzing Locations...' : `Compare ${primaryLocation.city} with ${selectedAlternatives.length} Alternatives`}
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Comparative Scores Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Comparative Performance Scores</h4>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#3B82F6" name="Total Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="text-lg font-semibold text-green-800 mb-3">Strategic Recommendation</h4>
            <div className="space-y-2">
              <p className="text-green-700 font-medium">
                Best Alternative: <span className="font-bold">{analysis.recommendations.bestFit}</span>
              </p>
              <p className="text-green-700 text-sm">{analysis.recommendations.rationale}</p>
              <div className="flex gap-4 text-sm">
                <span className={`px-2 py-1 rounded ${analysis.recommendations.riskLevel === 'Low' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                  Risk Level: {analysis.recommendations.riskLevel}
                </span>
                <span className="px-2 py-1 rounded bg-blue-200 text-blue-800">
                  Investment Potential: {analysis.recommendations.investmentPotential.toFixed(1)}/10
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalComparativeEngine;

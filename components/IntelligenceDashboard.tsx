
import React from 'react';
import type { ReportParameters, OpportunityScore, ModuleScore, ComplexityScore } from '../types.ts';

interface IntelligenceDashboardProps {
  params: ReportParameters;
  opportunityScore?: OpportunityScore;
  moduleScore?: ModuleScore;
  complexityScore?: ComplexityScore;
}

export const IntelligenceDashboard: React.FC<IntelligenceDashboardProps> = ({
  params,
  opportunityScore,
  moduleScore,
  complexityScore
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-gray-900">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white shadow-sm">
          <span className="text-lg">📊</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Intelligence Dashboard</h3>
          <p className="text-sm text-gray-500">Real-time analytics and scoring insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Opportunity Score */}
        {opportunityScore && (
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Opportunity Score</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-medium">Overall</span>
                <span className={`text-lg font-extrabold ${getScoreColor(opportunityScore.totalScore)}`}>
                  {opportunityScore.totalScore}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getScoreBarColor(opportunityScore.totalScore)}`}
                  style={{ width: `${opportunityScore.totalScore}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs border-t border-gray-200 pt-3 mt-2">
                <div>
                  <span className="text-gray-500 block mb-1">Market Potential</span>
                  <span className={`font-bold ${getScoreColor(opportunityScore.marketPotential)}`}>
                    {opportunityScore.marketPotential}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Risk Mitigation</span>
                  <span className={`font-bold ${getScoreColor(100 - opportunityScore.riskFactors)}`}>
                    {100 - opportunityScore.riskFactors}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Module Score */}
        {moduleScore && (
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Module Score</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-medium">Overall</span>
                <span className={`text-lg font-extrabold ${getScoreColor(moduleScore.totalScore)}`}>
                  {moduleScore.totalScore}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getScoreBarColor(moduleScore.totalScore)}`}
                  style={{ width: `${moduleScore.totalScore}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs border-t border-gray-200 pt-3 mt-2">
                <div>
                  <span className="text-gray-500 block mb-1">Complexity</span>
                  <span className={`font-bold ${getScoreColor(100 - moduleScore.complexityLevel)}`}>
                    {100 - moduleScore.complexityLevel}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Timeline</span>
                  <span className={`font-bold ${getScoreColor(100 - moduleScore.implementationTimeline)}`}>
                    {100 - moduleScore.implementationTimeline}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Complexity Score */}
        {complexityScore && (
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Complexity Score</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-medium">Overall</span>
                <span className={`text-lg font-extrabold ${getScoreColor(complexityScore.totalScore)}`}>
                  {complexityScore.totalScore}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getScoreBarColor(complexityScore.totalScore)}`}
                  style={{ width: `${complexityScore.totalScore}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs border-t border-gray-200 pt-3 mt-2">
                <div>
                  <span className="text-gray-500 block mb-1">Technical</span>
                  <span className={`font-bold ${getScoreColor(100 - complexityScore.technicalComplexity)}`}>
                    {100 - complexityScore.technicalComplexity}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Regulatory</span>
                  <span className={`font-bold ${getScoreColor(100 - complexityScore.regulatoryCompliance)}`}>
                    {100 - complexityScore.regulatoryCompliance}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Key Insights */}
      <div className="mt-6 bg-gray-50 rounded-xl p-5 border border-gray-200">
        <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Key Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-100">
              <span className="text-blue-600 font-bold">🎯</span>
              <span className="text-xs text-gray-600 font-medium">
                <span className="text-gray-400 uppercase text-[10px] block">Focus Area</span>
                {params.region} - {params.industry.join(', ')}
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-100">
              <span className="text-blue-600 font-bold">👥</span>
              <span className="text-xs text-gray-600 font-medium">
                <span className="text-gray-400 uppercase text-[10px] block">Analyst Team</span>
                {params.aiPersona?.length || 0} AI analysts engaged
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-100">
              <span className="text-blue-600 font-bold">📈</span>
              <span className="text-xs text-gray-600 font-medium">
                <span className="text-gray-400 uppercase text-[10px] block">Service Level</span>
                {params.userTier} access level
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-100">
              <span className="text-green-600 font-bold">⚡</span>
              <span className="text-xs text-gray-600 font-medium">
                <span className="text-gray-400 uppercase text-[10px] block">System Status</span>
                Real-time intelligence active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceDashboard;

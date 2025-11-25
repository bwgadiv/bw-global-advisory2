
import React, { useState, useEffect } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip
} from 'recharts';
import { MarketDiversificationEngine, DiversificationAnalysis, MarketShare, MarketOpportunity } from '../services/MarketDiversificationEngine';

interface Props {
  initialMarkets?: MarketShare[];
  sector?: string;
}

const defaultMarkets: MarketShare[] = [
  { country: 'USA', share: 55 },
  { country: 'China', share: 25 },
  { country: 'Germany', share: 15 },
  { country: 'Other', share: 5 }
];

export const MarketDiversificationDashboard: React.FC<Props> = ({ 
  initialMarkets = defaultMarkets, 
  sector = 'General' 
}) => {
  const [analysis, setAnalysis] = useState<DiversificationAnalysis | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<MarketOpportunity | null>(null);
  const [markets, setMarkets] = useState<MarketShare[]>(initialMarkets);

  useEffect(() => {
    const result = MarketDiversificationEngine.analyzeConcentration(markets);
    setAnalysis(result);
    if (result.recommendedMarkets.length > 0) {
      setSelectedOpportunity(result.recommendedMarkets[0]);
    }
  }, [markets]);

  if (!analysis) return <div className="p-8 text-center text-slate-400">Loading Diversification Engine...</div>;

  // Prepare data for Radar Chart
  const radarData = selectedOpportunity ? [
    { subject: 'Growth', A: selectedOpportunity.growthRate * 15, fullMark: 100 }, // Scale growth for visual
    { subject: 'Entry Ease', A: selectedOpportunity.easeOfEntry, fullMark: 100 },
    { subject: 'Talent', A: selectedOpportunity.talentAvailability, fullMark: 100 },
    { subject: 'Innovation', A: selectedOpportunity.innovationIndex, fullMark: 100 },
    { subject: 'Stability', A: 100 - selectedOpportunity.regulatoryFriction, fullMark: 100 },
  ] : [];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Diversified': return 'text-green-500';
      case 'Moderate Concentration': return 'text-yellow-500';
      case 'High Concentration': return 'text-orange-500';
      case 'Critical Dependency': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  const getHhiColor = (score: number) => {
    if (score < 1500) return '#22c55e';
    if (score < 2500) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Market Diversification Intelligence
          </h3>
          <p className="text-xs text-slate-500">Sector: {sector} • Active Markets: {markets.length}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-semibold text-slate-400 uppercase">Concentration Risk</span>
          <span className={`text-sm font-bold ${getRiskColor(analysis.riskLevel)}`}>{analysis.riskLevel}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 flex-grow">
        {/* Left Column: Metrics & HHI */}
        <div className="p-6 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-center">
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-slate-700 mb-4">Portfolio Concentration (HHI)</h4>
            <div className="relative pt-4">
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden w-full">
                 <div 
                   className="h-full transition-all duration-700 ease-out"
                   style={{ 
                     width: `${Math.min(100, (analysis.hhiScore / 5000) * 100)}%`,
                     backgroundColor: getHhiColor(analysis.hhiScore) 
                   }}
                 />
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-mono">
                <span>0 (Perfectly Diversified)</span>
                <span>2500+ (High Risk)</span>
              </div>
              <div className="mt-4 p-3 bg-slate-50 rounded text-xs text-slate-600 italic border border-slate-200">
                "{analysis.concentrationAnalysis}"
              </div>
            </div>
          </div>

          <div>
             <h4 className="text-sm font-semibold text-slate-700 mb-4">Current Market Split</h4>
             <div className="space-y-3">
               {markets.map((m, i) => (
                 <div key={i} className="flex items-center gap-3">
                    <div className="w-20 text-xs font-medium text-slate-600 truncate" title={m.country}>{m.country}</div>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400" style={{ width: `${m.share}%` }}></div>
                    </div>
                    <div className="w-8 text-xs text-slate-500 text-right">{m.share}%</div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Middle Column: Opportunity Radar */}
        <div className="p-6 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Opportunity Profile: <span className="text-purple-600">{selectedOpportunity?.country}</span></h4>
          <div className="flex-grow min-h-[250px] relative -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name={selectedOpportunity?.country}
                  dataKey="A"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="#8b5cf6"
                  fillOpacity={0.2}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [value.toFixed(0), 'Score']} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
             <div className="text-center p-2 bg-slate-50 rounded border border-slate-100">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Growth Rate</div>
                <div className="text-lg font-bold text-slate-800">{selectedOpportunity?.growthRate}%</div>
             </div>
             <div className="text-center p-2 bg-slate-50 rounded border border-slate-100">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Market Size</div>
                <div className="text-lg font-bold text-slate-800">{selectedOpportunity?.marketSize}</div>
             </div>
          </div>
        </div>

        {/* Right Column: Recommendations & Action */}
        <div className="p-6 bg-slate-50/50 flex flex-col h-full">
          <h4 className="text-sm font-semibold text-slate-700 mb-4">Strategic Recommendations</h4>
          <div className="space-y-3 mb-6 flex-grow overflow-y-auto">
            {analysis.recommendedMarkets.map((market) => (
              <div 
                key={market.country}
                onClick={() => setSelectedOpportunity(market)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedOpportunity?.country === market.country 
                  ? 'bg-white border-purple-400 shadow-md ring-1 ring-purple-100 transform scale-[1.02]' 
                  : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-800 text-sm">{market.country}</span>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                    Score: {market.opportunityScore}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{market.rationale}</p>
              </div>
            ))}
          </div>
          
          {selectedOpportunity && (
            <div className="bg-gradient-to-br from-purple-900 to-slate-900 text-white p-4 rounded-lg shadow-lg mt-auto">
              <h5 className="text-[10px] font-bold text-purple-300 uppercase mb-2 tracking-wider">Recommended Strategy</h5>
              <div className="text-lg font-bold mb-2">{selectedOpportunity.recommendedStrategy}</div>
              <p className="text-xs text-purple-100 opacity-90 leading-relaxed mb-3">
                {selectedOpportunity.rationale}
              </p>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold rounded transition-colors backdrop-blur-sm">
                Generate Execution Roadmap
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Wrapper for dashboard usage
export const MarketDiversificationWidget = () => (
  <MarketDiversificationDashboard />
);

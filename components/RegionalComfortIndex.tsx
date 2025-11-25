
import React, { useState, useEffect } from 'react';
import { ShieldCheck, GlobeIcon, Users, TruckIcon, CheckCircle, AlertTriangleIcon, MessageSquareIcon } from './Icons';

interface RegionalComfortMetrics {
  safetyIndex: number; // 0-100
  politicalStability: number; // 0-100
  businessEnvironment: number; // 0-100
  infrastructure: number; // 0-100
  healthcare: number; // 0-100
  connectivity: number; // 0-100
  costOfLiving: number; // 0-100 (lower is better)
  easeOfDoingBusiness: number; // 0-100
}

interface CulturalInsights {
  greeting: string;
  businessHours: string;
  holidays: string[];
  communication: {
    directness: 'high' | 'medium' | 'low';
    hierarchy: 'high' | 'medium' | 'low';
    relationshipBuilding: string;
  };
  etiquette: string[];
  taboos: string[];
}

interface LogisticsSupport {
  visaRequirements: string;
  transportation: string[];
  accommodation: string[];
  emergencyContacts: Array<{
    service: string;
    number: string;
    english: boolean;
  }>;
  insurance: string[];
}

interface RegionalComfortData {
  region: string;
  country: string;
  metrics: RegionalComfortMetrics;
  culturalInsights: CulturalInsights;
  logisticsSupport: LogisticsSupport;
  comfortScore: number; // Overall 0-100
  lastUpdated: string;
}

interface RegionalComfortIndexProps {
  region?: string;
  country?: string;
  onComfortUpdate?: (comfortData: RegionalComfortData) => void;
}

// Helper functions explicitly defined outside component
const getScoreColor = (score: number, invert: boolean = false) => {
  const effectiveScore = invert ? 100 - score : score;
  if (effectiveScore >= 80) return 'text-emerald-600';
  if (effectiveScore >= 60) return 'text-amber-600';
  return 'text-red-600';
};

const MetricBar = ({ label, value, invert = false }: { label: string; value: number; invert?: boolean }) => (
  <div className="bg-white p-3 rounded border border-slate-200">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className={`text-sm font-bold ${getScoreColor(value, invert)}`}>{value}/100</span>
    </div>
    <div className="w-full bg-slate-100 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-500 ${
          invert
            ? 'bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500'
            : 'bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500'
        }`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const RegionalComfortIndex: React.FC<RegionalComfortIndexProps> = ({
  region,
  country,
  onComfortUpdate
}) => {
  const [comfortData, setComfortData] = useState<RegionalComfortData | null>(null);
  const [selectedAspect, setSelectedAspect] = useState<'overview' | 'safety' | 'culture' | 'logistics'>('overview');

  // Mock data - in real implementation, this would come from API
  useEffect(() => {
    if (!region || !country) return;

    const mockData: RegionalComfortData = {
      region: region,
      country: country,
      metrics: {
        safetyIndex: 72,
        politicalStability: 68,
        businessEnvironment: 75,
        infrastructure: 71,
        healthcare: 65,
        connectivity: 78,
        costOfLiving: 45, // Lower is better
        easeOfDoingBusiness: 73
      },
      culturalInsights: {
        greeting: `${country} has a rich cultural heritage. Business culture emphasizes relationship-building and respect for hierarchy.`,
        businessHours: "Monday-Friday: 8:00 AM - 5:00 PM, Lunch: 1:00-2:00 PM",
        holidays: ["New Year's Day", "Good Friday", "Easter Monday", "Labour Day", "Independence Day", "Christmas Day"],
        communication: {
          directness: 'medium',
          hierarchy: 'high',
          relationshipBuilding: 'Personal relationships are crucial for business success'
        },
        etiquette: [
          "Always greet elders and superiors first",
          "Use titles and surnames until invited to use first names",
          "Business cards are exchanged with both hands",
          "Punctuality is appreciated but flexibility is common",
          "Gift giving is common but avoid expensive items initially"
        ],
        taboos: [
          "Avoid discussing politics unless you know the person's views",
          "Don't use left hand for eating or giving items",
          "Avoid showing soles of feet",
          "Don't point with index finger"
        ]
      },
      logisticsSupport: {
        visaRequirements: "Tourist/Business Visa available. Business visas often require invitation letter and company documentation.",
        transportation: [
          "International Airports available in major cities",
          "Minibus taxis for local transport",
          "Ride-hailing apps often available",
          "Rail connection in key corridors"
        ],
        accommodation: [
          "International hotels in major cities",
          "Serviced apartments for longer stays",
          "Budget guesthouses in rural areas",
          "Home stays for cultural immersion"
        ],
        emergencyContacts: [
          { service: "Police Emergency", number: "999 / 112", english: true },
          { service: "Fire Emergency", number: "999 / 112", english: true },
          { service: "Ambulance", number: "999 / 112", english: true },
          { service: "Tourist Police", number: "Local Number", english: true },
          { service: "National Airline", number: "Local Number", english: true }
        ],
        insurance: [
          "Travel insurance mandatory for visa",
          "Medical evacuation coverage recommended",
          "Business interruption insurance",
          "Political risk insurance for investments"
        ]
      },
      comfortScore: 71,
      lastUpdated: new Date().toISOString()
    };

    setComfortData(mockData);
    onComfortUpdate?.(mockData);
  }, [region, country, onComfortUpdate]);

  if (!region || !country) {
      return (
        <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <GlobeIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Awaiting Regional Context</h3>
            <p className="text-slate-600 text-sm">Please select a Target Region and Jurisdiction in the "Strategic Context" phase to generate the Comfort Index.</p>
        </div>
      );
  }

  if (!comfortData) {
    return (
      <div className="regional-comfort-loading bg-white p-6 rounded-xl border border-slate-200">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-100 rounded w-1/2"></div>
          <div className="h-32 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="regional-comfort-index space-y-6 text-slate-900">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-slate-700" />
              Regional Comfort Index
            </h2>
            <p className="text-slate-600 mt-1">
              {comfortData.country}, {comfortData.region} - Building confidence for successful engagement
            </p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getScoreColor(comfortData.comfortScore)}`}>
              {comfortData.comfortScore}
            </div>
            <div className="text-sm text-slate-500">Comfort Score</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          {[
            { id: 'overview', label: 'Overview', icon: GlobeIcon },
            { id: 'safety', label: 'Safety & Environment', icon: ShieldCheck },
            { id: 'culture', label: 'Culture & Etiquette', icon: Users },
            { id: 'logistics', label: 'Logistics & Support', icon: TruckIcon }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedAspect(tab.id as any)}
              className={`px-4 py-3 rounded-t-lg font-bold text-sm transition-colors flex items-center gap-2 border-t border-x ${
                selectedAspect === tab.id
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Areas */}
        {selectedAspect === 'overview' && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Welcome to {comfortData.country}</h3>
              <p className="text-slate-700 text-sm leading-relaxed">{comfortData.culturalInsights.greeting}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Key Comfort Indicators</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricBar label="Safety Index" value={comfortData.metrics.safetyIndex} />
                <MetricBar label="Business Environment" value={comfortData.metrics.businessEnvironment} />
                <MetricBar label="Infrastructure" value={comfortData.metrics.infrastructure} />
                <MetricBar label="Healthcare" value={comfortData.metrics.healthcare} />
                <MetricBar label="Connectivity" value={comfortData.metrics.connectivity} />
                <MetricBar label="Cost of Living" value={comfortData.metrics.costOfLiving} invert />
                <MetricBar label="Political Stability" value={comfortData.metrics.politicalStability} />
                <MetricBar label="Ease of Doing Business" value={comfortData.metrics.easeOfDoingBusiness} />
              </div>
            </div>

            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Confidence Building Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Start with local partners who understand both cultures</li>
                <li>Schedule initial meetings during standard business hours</li>
                <li>Prepare for relationship-focused communication style</li>
                <li>Have contingency plans for transportation and connectivity</li>
                <li>Research local customs and appropriate business attire</li>
              </ul>
            </div>
          </div>
        )}

        {selectedAspect === 'safety' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Safety & Security</h3>
                <div className="space-y-4">
                  <MetricBar label="Overall Safety" value={comfortData.metrics.safetyIndex} />
                  <MetricBar label="Political Stability" value={comfortData.metrics.politicalStability} />
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-2 text-sm">Safety Recommendations</h4>
                    <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                      <li>Use reputable transportation services</li>
                      <li>Stay in well-established areas</li>
                      <li>Keep emergency contacts readily available</li>
                      <li>Register with your embassy if required</li>
                      <li>Purchase comprehensive travel insurance</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Business Environment</h3>
                <div className="space-y-4">
                  <MetricBar label="Business Environment" value={comfortData.metrics.businessEnvironment} />
                  <MetricBar label="Ease of Doing Business" value={comfortData.metrics.easeOfDoingBusiness} />
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-2 text-sm">Business Considerations</h4>
                    <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                      <li>Understand local regulatory requirements</li>
                      <li>Build relationships before formal agreements</li>
                      <li>Be prepared for bureaucratic processes</li>
                      <li>Consider local business partners</li>
                      <li>Plan for currency and banking differences</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedAspect === 'culture' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Communication & Business Culture</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-slate-50 rounded">
                  <div className="text-xl font-bold text-slate-900 capitalize">
                    {comfortData.culturalInsights.communication.directness}
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Directness</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded">
                  <div className="text-xl font-bold text-slate-900 capitalize">
                    {comfortData.culturalInsights.communication.hierarchy}
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hierarchy</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded">
                  <div className="text-xl font-bold text-slate-900">
                    Relationship
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Focus</div>
                </div>
              </div>
              <p className="text-sm text-slate-700 italic border-t border-slate-100 pt-3">
                "{comfortData.culturalInsights.communication.relationshipBuilding}"
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Business Etiquette</h3>
                <ul className="space-y-2">
                  {comfortData.culturalInsights.etiquette.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded border border-slate-100">
                      <span className="text-slate-400 mt-0.5">•</span>
                      <span className="text-sm text-slate-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Cultural Considerations</h3>
                <div className="space-y-3">
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <h4 className="font-bold text-slate-800 text-xs uppercase mb-1">Business Hours</h4>
                    <p className="text-sm text-slate-600">{comfortData.culturalInsights.businessHours}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <h4 className="font-bold text-slate-800 text-xs uppercase mb-1">Major Holidays</h4>
                    <p className="text-sm text-slate-600">{comfortData.culturalInsights.holidays.slice(0, 3).join(', ')}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded border border-red-100">
                    <h4 className="font-bold text-red-800 text-xs uppercase mb-1 flex items-center gap-2"><AlertTriangleIcon className="w-3 h-3" /> Important Taboos</h4>
                    <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                      {comfortData.culturalInsights.taboos.map((taboo, index) => (
                        <li key={index}>{taboo}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedAspect === 'logistics' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Travel & Visa Requirements</h3>
                <div className="space-y-3">
                  <div className="bg-slate-50 p-4 rounded border border-slate-200">
                    <h4 className="font-bold text-slate-800 text-xs uppercase mb-2">Visa Information</h4>
                    <p className="text-sm text-slate-600">{comfortData.logisticsSupport.visaRequirements}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded border border-slate-200">
                    <h4 className="font-bold text-slate-800 text-xs uppercase mb-2">Transportation Options</h4>
                    <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                      {comfortData.logisticsSupport.transportation.map((option, index) => (
                        <li key={index}>{option}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Accommodation & Insurance</h3>
                <div className="space-y-3">
                  <div className="bg-slate-50 p-4 rounded border border-slate-200">
                    <h4 className="font-bold text-slate-800 text-xs uppercase mb-2">Accommodation Options</h4>
                    <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                      {comfortData.logisticsSupport.accommodation.map((option, index) => (
                        <li key={index}>{option}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-slate-50 p-4 rounded border border-slate-200">
                    <h4 className="font-bold text-slate-800 text-xs uppercase mb-2">Recommended Insurance</h4>
                    <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                      {comfortData.logisticsSupport.insurance.map((type, index) => (
                        <li key={index}>{type}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Emergency Contacts</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comfortData.logisticsSupport.emergencyContacts.map((contact, index) => (
                  <div key={index} className="bg-red-50 p-4 rounded border border-red-100">
                    <h4 className="font-bold text-red-900 mb-1 text-sm">{contact.service}</h4>
                    <p className="text-lg font-mono text-red-700 font-bold mb-1">{contact.number}</p>
                    <p className="text-xs text-red-500 uppercase font-bold tracking-wider">
                      {contact.english ? 'English Speaker Available' : 'Local Language'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span>LAST UPDATED: {new Date(comfortData.lastUpdated).toLocaleDateString().toUpperCase()}</span>
            <span>SOURCE: WORLD BANK / UN / LOCAL AUTH</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalComfortIndex;

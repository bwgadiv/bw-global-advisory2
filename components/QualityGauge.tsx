
import React from 'react';

interface QualityGaugeProps {
  score: number; // 0 to 100
  recommendations: string[];
}

const QualityGauge: React.FC<QualityGaugeProps> = ({ score, recommendations }) => {
  const getScoreColor = (s: number) => {
    if (s > 80) return '#10b981'; // green-500
    if (s > 50) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const color = getScoreColor(score);
  const circumference = 2 * Math.PI * 45; // r = 45
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg flex flex-col md:flex-row items-center gap-6">
      <div className="relative w-32 h-32 flex-shrink-0">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
          <text x="50" y="55" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#111827">{score}</text>
        </svg>
      </div>
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Configuration Quality</h4>
        <p className="text-sm text-gray-600 mb-3">Based on your inputs, the AI has a {score}% confidence in generating a high-quality, specific report. For better results:</p>
        <ul className="list-disc list-outside ml-4 text-xs text-gray-600 space-y-1">{recommendations.map((rec, i) => <li key={i}>{rec}</li>)}</ul>
      </div>
    </div>
  );
};

export default QualityGauge;

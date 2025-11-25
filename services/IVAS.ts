
import type { LatentAsset } from '../types';

export type IVASResult = {
  ivasScore: number; // 0..100
  activationMonths: number;
  breakdown: {
    opportunityQuantum: number; // 0..100
    symbioticConfidence: number; // 0..100
    activationFriction: number; // 0..100 (lower friction => faster)
  };
  rationale: string;
};

/**
 * Compute a rudimentary IVAS score.
 * Replace heuristics with a learned or LLM-based estimator later.
 */
export function computeIVAS(asset: LatentAsset, context: { regionAmbition?: number, regulatoryFriction?: number }): IVASResult {
  const opportunityQuantum = Math.min(100, Math.log1p(asset.marketEstimateUSD) * 10);
  const symbioticConfidence = Math.min(100, (context.regionAmbition ?? 50) + (asset.synergyScore * 5));
  const activationFriction = Math.min(100, (context.regulatoryFriction ?? 40));

  // combine: high quantum, high confidence, low friction -> high IVAS
  const ivasScore = Math.round(
    0.45 * opportunityQuantum +
    0.4 * symbioticConfidence +
    0.15 * (100 - activationFriction)
  );

  // translate friction to months (simple mapping)
  const activationMonths = Math.max(6, Math.round(48 * (activationFriction / 100)));

  const rationale = `IVAS combines opportunity ($${asset.marketEstimateUSD}), local confidence (${Math.round(symbioticConfidence)}), and friction (${Math.round(activationFriction)}).`;

  return {
    ivasScore,
    activationMonths,
    breakdown: {
      opportunityQuantum: Math.round(opportunityQuantum),
      symbioticConfidence: Math.round(symbioticConfidence),
      activationFriction: Math.round(activationFriction),
    },
    rationale
  };
}

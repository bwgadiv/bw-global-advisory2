
import type { RegionProfile, LatentAsset, RawFeature } from '../types';

export function generateFeaturePairs(features: RawFeature[]) {
  const pairs: Array<[RawFeature, RawFeature]> = [];
  for (let i = 0; i < features.length; i++) {
    for (let j = i + 1; j < features.length; j++) {
      pairs.push([features[i], features[j]]);
    }
  }
  return pairs;
}

/**
 * Minimal LAI: finds interesting pairs/triples, ranks by simple heuristic.
 * In practice this will be replaced by a multi-agent LLM workflow.
 */
export function identifyLatentAssets(region: RegionProfile): LatentAsset[] {
  const features = region.rawFeatures || [];
  const pairs = generateFeaturePairs(features);

  const candidates = pairs.map(([a, b], idx) => {
    const synergyScore =
      (a.rarityScore || 1) * (b.rarityScore || 1) *
      (1 + Math.log(1 + (a.relevanceScore || 0) + (b.relevanceScore || 0)));

    const marketEstimateUSD = Math.round((a.marketProxy || 1) * (b.marketProxy || 1) * 1000);

    return {
      id: `lai-${idx}`,
      title: `${a.name} + ${b.name} → Symbiotic Opportunity`,
      description: `Symbiosis between ${a.name} and ${b.name} in ${region.name}.`,
      components: [a.name, b.name],
      synergyScore,
      marketEstimateUSD,
      recommendedNextSteps: [
        'Run IVAS scoring',
        'Validate with local stakeholders',
        'Quick feasibility call with local partner'
      ]
    } as LatentAsset;
  });

  // sort descending by score
  candidates.sort((x, y) => y.synergyScore - x.synergyScore);
  return candidates.slice(0, 10);
}

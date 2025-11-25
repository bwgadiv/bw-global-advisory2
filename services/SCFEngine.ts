
export type SCFInput = {
  capitalInvestmentUSD: number;
  localLaborShare?: number; // % of spend that goes to local labor (0..1)
  supplyChainLocalMultiplier?: number; // multiplier for local supply chain integration
  years?: number;
};

export type SCFOutput = {
  directJobs: number;
  indirectJobs: number;
  inducedJobs: number;
  totalEconomicImpactUSD: number;
  annualizedImpact: number;
};

export function runSCF(input: SCFInput): SCFOutput {
  const years = input.years ?? 5;
  // heuristics: $100k capital creates 1 direct job (example)
  const directJobs = Math.round(input.capitalInvestmentUSD / 100000 * (0.7 + (input.localLaborShare ?? 0.5)));
  const indirectJobs = Math.round(directJobs * (input.supplyChainLocalMultiplier ?? 1.8));
  const inducedJobs = Math.round((directJobs + indirectJobs) * 0.6);
  const totalEconomicImpactUSD = Math.round(input.capitalInvestmentUSD * (1 + (input.supplyChainLocalMultiplier ?? 1.8) * 0.6 + 0.5)); // rough approximation of multiplier effect
  const annualizedImpact = Math.round(totalEconomicImpactUSD / years);

  return { directJobs, indirectJobs, inducedJobs, totalEconomicImpactUSD, annualizedImpact };
}

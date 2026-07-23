const DEFAULT_PROPERTY_RUNS = 100;
const PROPERTY_SEED = 0x5eed;

const requestedRuns = Number(process.env.VISUAL_REFRESH_PBT_RUNS ?? DEFAULT_PROPERTY_RUNS);

export const propertyParameters = {
  seed: PROPERTY_SEED,
  numRuns: Number.isInteger(requestedRuns) && requestedRuns > 0 ? requestedRuns : DEFAULT_PROPERTY_RUNS,
  verbose: true,
} as const;
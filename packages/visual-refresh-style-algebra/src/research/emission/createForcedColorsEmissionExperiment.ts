import type { ForcedColorsContract } from '../domain/ForcedColorsContract';
import { emitForcedColors } from './emitForcedColors';
import type {
  EmissionResult,
  ForcedColorsEmissionTarget,
} from './ForcedColorsEmission';

/**
 * Synthetic corpus for studying repeated style-hook output. It is not a claim
 * about Griffel's exact emitted CSS.
 */
export const createForcedColorsEmissionExperiment = (
  contract: ForcedColorsContract,
  target: ForcedColorsEmissionTarget
): EmissionResult => {
  const emitted = emitForcedColors(contract, target);
  const appearance = emitted.rules[0];

  return {
    rules: [
      ...emitted.rules,
      {
        ...appearance,
        sourceRules: ['synthetic-product-style-hook-copy'],
      },
      {
        ...appearance,
        selectorScope: `${appearance.selectorScope}:focus-visible`,
        sourceRules: ['synthetic-contextual-lookalike'],
      },
    ],
    diagnostics: [],
  };
};

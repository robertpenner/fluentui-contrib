import type { CapButtonSemanticObservation } from './CapButtonObservation';
import type { CapModelEvidence } from './evidence';

export interface CapButtonContract extends CapButtonSemanticObservation {
  readonly provenance: readonly CapModelEvidence[];
}

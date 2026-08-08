import type { SystemColorRole } from './SemanticColorRole';

/**
 * Accessibility policy for a resolved forced-colors snapshot. This contract is
 * independent of CSS selectors, media queries, generated classes, and order.
 */
export interface ForcedColorsContract {
  foregroundRole: SystemColorRole;
  backgroundRole: SystemColorRole;
  borderRole: SystemColorRole;
  focusRole: SystemColorRole;
  focusVisible: boolean;
  disabledDistinguishable: boolean;
  visibleBoundary: boolean;
}

import type { CapButtonMotionContract } from './CapButtonMotion';

const transitionProperties = ['background', 'border', 'color'] as const;

export const resolveCapButtonMotion = (
  prefersReducedMotion: boolean
): CapButtonMotionContract => ({
  transitions: transitionProperties.map((property) => ({
    property,
    durationMs: prefersReducedMotion ? 0.01 : 100,
  })),
});

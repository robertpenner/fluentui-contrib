import type { CapButtonMotionContract } from './CapButtonMotion';

export interface CapButtonMotionDifference {
  readonly path: string;
  readonly production: unknown;
  readonly cleanRoom: unknown;
}

export const compareCapButtonMotion = (
  production: CapButtonMotionContract,
  cleanRoom: CapButtonMotionContract
): readonly CapButtonMotionDifference[] => {
  const differences: CapButtonMotionDifference[] = [];
  const compare = (
    path: string,
    productionValue: unknown,
    cleanRoomValue: unknown
  ): void => {
    if (productionValue !== cleanRoomValue) {
      differences.push({
        path,
        production: productionValue,
        cleanRoom: cleanRoomValue,
      });
    }
  };

  compare(
    'transitions.length',
    production.transitions.length,
    cleanRoom.transitions.length
  );

  const transitionCount = Math.min(
    production.transitions.length,
    cleanRoom.transitions.length
  );

  for (let index = 0; index < transitionCount; index += 1) {
    compare(
      `transitions.${index}.property`,
      production.transitions[index].property,
      cleanRoom.transitions[index].property
    );
    compare(
      `transitions.${index}.durationMs`,
      production.transitions[index].durationMs,
      cleanRoom.transitions[index].durationMs
    );
  }

  return differences;
};

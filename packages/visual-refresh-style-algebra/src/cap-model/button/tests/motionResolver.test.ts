import { compareCapButtonMotion } from '../compareCapButtonMotion';
import type { CapButtonMotionContract } from '../CapButtonMotion';
import { capButtonMotionMatrix } from '../enumerateCapButtonMotionMatrix';
import { projectCapButtonMotion } from '../projectCapButtonMotion';
import { resolveCapButtonMotion } from '../resolveCapButtonMotion';

describe('CAP Button motion contract', () => {
  it.each([
    [
      false,
      [
        { property: 'background', durationMs: 100 },
        { property: 'border', durationMs: 100 },
        { property: 'color', durationMs: 100 },
      ],
    ],
    [
      true,
      [
        { property: 'background', durationMs: 0.01 },
        { property: 'border', durationMs: 0.01 },
        { property: 'color', durationMs: 0.01 },
      ],
    ],
  ] as const)(
    'resolves prefersReducedMotion=%s without appearance or theme input',
    (prefersReducedMotion, transitions) => {
      expect(resolveCapButtonMotion(prefersReducedMotion)).toEqual({
        transitions,
      });
    }
  );

  it('reports focused transition property and duration paths', () => {
    const expected = resolveCapButtonMotion(false);
    const mutations: ReadonlyArray<readonly [CapButtonMotionContract, string]> =
      expected.transitions.flatMap((transition, index) => [
        [
          {
            transitions: expected.transitions.map((candidate, candidateIndex) =>
              candidateIndex === index
                ? { ...candidate, property: 'opacity' }
                : candidate
            ),
          },
          `transitions.${index}.property`,
        ],
        [
          {
            transitions: expected.transitions.map((candidate, candidateIndex) =>
              candidateIndex === index
                ? { ...candidate, durationMs: transition.durationMs + 1 }
                : candidate
            ),
          },
          `transitions.${index}.durationMs`,
        ],
      ]);

    for (const [actual, path] of mutations) {
      expect(
        compareCapButtonMotion(actual, expected).map(
          (difference) => difference.path
        )
      ).toEqual([path]);
    }
  });

  it('normalizes and aligns computed CSS transition lists structurally', () => {
    expect(projectCapButtonMotion('background, border, color', '0.1s')).toEqual(
      resolveCapButtonMotion(false)
    );
    expect(
      projectCapButtonMotion(
        'background, border, color',
        '0.01ms, 0.01ms, 0.01ms'
      )
    ).toEqual(resolveCapButtonMotion(true));
  });

  it('covers every appearance and availability under both preferences independently', () => {
    expect(capButtonMotionMatrix).toHaveLength(36);
    expect(
      capButtonMotionMatrix.filter((entry) => entry.prefersReducedMotion)
    ).toHaveLength(18);
    expect(
      capButtonMotionMatrix.every(
        (entry) =>
          !('theme' in entry) &&
          !('direction' in entry) &&
          !('forcedColors' in entry)
      )
    ).toBe(true);
  });
});

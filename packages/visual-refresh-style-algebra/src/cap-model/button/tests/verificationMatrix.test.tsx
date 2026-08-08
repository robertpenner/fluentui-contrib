import type { CapButtonContract } from '../CapButtonContract';
import { compareCapButton } from '../compareCapButton';
import { compareCapButtonForcedColors } from '../compareCapButtonForcedColors';
import { compareCapButtonInteraction } from '../compareCapButtonInteraction';
import { compareCapButtonMotion } from '../compareCapButtonMotion';
import {
  compareCapButtonLogicalGeometry,
  normalizeCapButtonGeometry,
} from '../CapButtonDirection';
import { compareCapButtonThemeInput } from '../CapButtonTheme';
import { resolveCapButtonForcedColors } from '../resolveCapButtonForcedColors';
import { resolveCapButtonInteraction } from '../resolveCapButtonInteraction';
import { resolveCapButtonMotion } from '../resolveCapButtonMotion';
import { resolveCleanRoomCapButton } from '../resolveCleanRoomCapButton';
import { compareCapButtonSemanticProfiles } from '../semanticProfiles';
import {
  capButtonContractGroups,
  classifyCapButtonVerification,
  type CapButtonContractGroup,
} from '../versionedVerification';
import {
  observeCapButtonProductionScenarios,
  tracedCapButtonConditions,
  tracedCapButtonScenario,
  tracedCapButtonTheme,
} from './productionAdapter';
import { capButtonLightThemeFixture } from './themeFixtures';

interface VerificationMutation {
  readonly contractGroup: CapButtonContractGroup;
  readonly differences: readonly { readonly path: string }[];
  readonly expectedPaths: readonly string[];
}

describe('CAP Button verification mutation matrix', () => {
  const [production] = observeCapButtonProductionScenarios(
    [tracedCapButtonScenario],
    tracedCapButtonConditions
  );
  const cleanRoom = resolveCleanRoomCapButton(
    tracedCapButtonScenario,
    tracedCapButtonConditions,
    tracedCapButtonTheme
  );

  it('localizes one independent clean-room regression in every contract group', () => {
    const normalizationMutation: CapButtonContract = {
      ...cleanRoom,
      normalized: { ...cleanRoom.normalized, appearance: 'secondary' },
    };
    const anatomyMutation: CapButtonContract = {
      ...cleanRoom,
      anatomy: ['content', 'icon'],
    };
    const geometryMutation: CapButtonContract = {
      ...cleanRoom,
      geometry: {
        ...cleanRoom.geometry,
        root: { ...cleanRoom.geometry.root, paddingTop: 'mutation' },
      },
    };
    const appearanceMutation: CapButtonContract = {
      ...cleanRoom,
      rootAppearance: {
        ...cleanRoom.rootAppearance,
        background: 'mutation',
      },
    };

    const interaction = resolveCapButtonInteraction(
      'primary',
      'enabled',
      tracedCapButtonConditions
    );
    const interactionMutation = {
      ...interaction,
      surface: { ...interaction.surface, background: 'mutation' },
    };

    const forcedColors = resolveCapButtonForcedColors('primary', 'enabled', {
      forcedColors: true,
      focusVisible: true,
    });
    if (!forcedColors.applies) {
      throw new Error('Expected active forced-colors verification fixture');
    }
    const forcedColorsMutation = {
      ...forcedColors,
      authored: { ...forcedColors.authored, forcedColorAdjust: null },
    };

    const theme = capButtonLightThemeFixture.semanticTokens;
    const themeMutation = { ...theme, colorBrandBackground: 'mutation' };

    const direction = normalizeCapButtonGeometry(production.geometry, 'ltr');
    const directionMutation = {
      ...direction,
      root: { ...direction.root, paddingInlineStart: 'mutation' },
    };

    const motion = resolveCapButtonMotion(false);
    const motionMutation = {
      transitions: motion.transitions.map((transition, index) =>
        index === 0
          ? { ...transition, durationMs: transition.durationMs + 1 }
          : transition
      ),
    };

    const matrix: readonly VerificationMutation[] = [
      {
        contractGroup: 'normalization',
        differences: compareCapButton(production, normalizationMutation),
        expectedPaths: ['normalized.appearance'],
      },
      {
        contractGroup: 'anatomy',
        differences: compareCapButton(production, anatomyMutation),
        expectedPaths: ['anatomy'],
      },
      {
        contractGroup: 'geometry',
        differences: compareCapButton(production, geometryMutation),
        expectedPaths: ['geometry.root.paddingTop'],
      },
      {
        contractGroup: 'appearance',
        differences: compareCapButton(production, appearanceMutation),
        expectedPaths: ['rootAppearance.background'],
      },
      {
        contractGroup: 'interaction',
        differences: compareCapButtonInteraction(
          interactionMutation,
          interaction
        ),
        expectedPaths: ['surface.background'],
      },
      {
        contractGroup: 'forcedColors',
        differences: compareCapButtonForcedColors(
          forcedColorsMutation,
          forcedColors
        ),
        expectedPaths: ['authored.forcedColorAdjust'],
      },
      {
        contractGroup: 'theme',
        differences: compareCapButtonThemeInput(themeMutation, theme),
        expectedPaths: ['theme.colorBrandBackground'],
      },
      {
        contractGroup: 'direction',
        differences: compareCapButtonLogicalGeometry(
          directionMutation,
          direction
        ),
        expectedPaths: ['root.paddingInlineStart'],
      },
      {
        contractGroup: 'motion',
        differences: compareCapButtonMotion(motion, motionMutation),
        expectedPaths: ['transitions.0.durationMs'],
      },
    ];

    expect(matrix.map(({ contractGroup }) => contractGroup)).toEqual(
      capButtonContractGroups
    );

    for (const mutation of matrix) {
      expect(mutation.differences.map(({ path }) => path)).toEqual(
        mutation.expectedPaths
      );
      expect(
        classifyCapButtonVerification(
          mutation.contractGroup,
          'clean-room',
          mutation.differences
        )
      ).toEqual({
        status: 'failed',
        kind: 'clean-room-regression',
        contractGroup: mutation.contractGroup,
        differences: mutation.expectedPaths.map((path) => ({ path })),
      });
    }
  });

  it('classifies a changed production observation as baseline drift', () => {
    const changedProduction = {
      ...production,
      rootAppearance: {
        ...production.rootAppearance,
        background: 'changed-production-observation',
      },
    };
    const differences = compareCapButtonSemanticProfiles(
      production,
      changedProduction
    );

    expect(
      classifyCapButtonVerification('appearance', 'production', differences)
    ).toEqual({
      status: 'failed',
      kind: 'production-baseline-drift',
      contractGroup: 'appearance',
      differences: [{ path: 'rootAppearance.background' }],
    });
  });
});

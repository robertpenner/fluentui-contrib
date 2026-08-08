import {
  capButtonDarkThemeFixture,
  capButtonLightThemeFixture,
  type CapButtonThemeFixture,
} from './themeFixtures';
import {
  capButtonAppearances,
  capButtonShapes,
  capButtonSizes,
  type CapButtonScenario,
} from '../CapButtonScenario';
import {
  capButtonDirectionObservedEquivalence,
  compareCapButtonLogicalGeometry,
  normalizeCapButtonGeometry,
} from '../CapButtonDirection';
import { compareCapButton } from '../compareCapButton';
import { resolveCapButtonForcedColors } from '../resolveCapButtonForcedColors';
import { resolveCleanRoomCapButton } from '../resolveCleanRoomCapButton';
import {
  observeCapButtonProductionScenarios,
  tracedCapButtonConditions,
  tracedCapButtonScenario,
} from './productionAdapter';

const themeFixtures = [
  capButtonLightThemeFixture,
  capButtonDarkThemeFixture,
] as const;
const directions = ['ltr', 'rtl'] as const;

const appearanceScenarios = capButtonAppearances.flatMap((appearance) => [
  {
    ...tracedCapButtonScenario,
    appearance,
    disabled: false,
    content: {
      icon: 'absent' as const,
      children: 'present' as const,
      iconPosition: 'omitted' as const,
    },
  },
  {
    ...tracedCapButtonScenario,
    appearance,
    disabled: true,
    content: {
      icon: 'absent' as const,
      children: 'present' as const,
      iconPosition: 'omitted' as const,
    },
  },
]);

const directionContents = [
  { icon: 'absent', children: 'absent', iconPosition: 'omitted' },
  { icon: 'absent', children: 'present', iconPosition: 'omitted' },
  { icon: 'present', children: 'absent', iconPosition: 'omitted' },
  { icon: 'present', children: 'present', iconPosition: 'before' },
  { icon: 'present', children: 'present', iconPosition: 'after' },
] as const satisfies readonly CapButtonScenario['content'][];

const directionScenarios = capButtonSizes.flatMap((size) =>
  capButtonShapes.flatMap((shape) =>
    directionContents.map(
      (content): CapButtonScenario => ({
        ...tracedCapButtonScenario,
        size,
        shape,
        content,
      })
    )
  )
);

const conditionsFor = (direction: 'ltr' | 'rtl') => ({
  ...tracedCapButtonConditions,
  direction,
});

const fixtureValues: Readonly<
  Record<CapButtonThemeFixture['name'], CapButtonThemeFixture['semanticTokens']>
> = {
  'web-light-with-cap': {
    colorBrandBackground: '#0f6cbd',
    colorBrandBackground2: '#ebf3fc',
    colorBrandStroke2: '#b4d6fa',
    colorCompoundBrandForeground1: '#0f6cbd',
    colorNeutralBackground3: '#f5f5f5',
    colorNeutralBackgroundDisabled: '#f0f0f0',
    colorNeutralForeground3: '#616161',
    colorNeutralForegroundDisabled: '#bdbdbd',
    colorNeutralForegroundOnBrand: '#ffffff',
    colorNeutralStroke4: '#ebebeb',
    colorNeutralStrokeDisabled: '#e0e0e0',
    colorNeutralStrokeOnBrand: '#ffffff',
    colorStrokeFocus1: '#ffffff',
    colorStrokeFocus2: '#000000',
    colorTransparentBackground: 'transparent',
    colorTransparentStroke: 'transparent',
    strokeWidthThick: '2px',
    strokeWidthThin: '1px',
  },
  'web-dark-with-cap': {
    colorBrandBackground: '#115ea3',
    colorBrandBackground2: '#082338',
    colorBrandStroke2: '#0e4775',
    colorCompoundBrandForeground1: '#479ef5',
    colorNeutralBackground3: '#141414',
    colorNeutralBackgroundDisabled: '#141414',
    colorNeutralForeground3: '#adadad',
    colorNeutralForegroundDisabled: '#5c5c5c',
    colorNeutralForegroundOnBrand: '#ffffff',
    colorNeutralStroke4: '#ebebeb',
    colorNeutralStrokeDisabled: '#424242',
    colorNeutralStrokeOnBrand: '#292929',
    colorStrokeFocus1: '#000000',
    colorStrokeFocus2: '#ffffff',
    colorTransparentBackground: 'transparent',
    colorTransparentStroke: 'transparent',
    strokeWidthThick: '2px',
    strokeWidthThin: '1px',
  },
};

describe('CAP Button theme and provider direction', () => {
  it('pins named provider fixtures to actual Fluent and CAP token values', () => {
    for (const fixture of themeFixtures) {
      expect(fixture.semanticTokens).toEqual(fixtureValues[fixture.name]);
      expect('theme' in tracedCapButtonScenario).toBe(false);
      expect('theme' in tracedCapButtonConditions).toBe(false);
    }
  });

  it('matches all appearances in light and dark, LTR and RTL', () => {
    for (const fixture of themeFixtures) {
      for (const direction of directions) {
        const conditions = conditionsFor(direction);
        const production = observeCapButtonProductionScenarios(
          appearanceScenarios,
          conditions,
          fixture.providerTheme
        );

        for (const observation of production) {
          const cleanRoom = resolveCleanRoomCapButton(
            observation.scenario,
            observation.conditions,
            fixture.semanticTokens
          );

          expect(compareCapButton(observation, cleanRoom)).toEqual([]);
        }
      }
    }
  });

  it('records observed LTR/RTL equivalence over the grounded geometry matrix', () => {
    const fixture = capButtonLightThemeFixture;
    const ltr = observeCapButtonProductionScenarios(
      directionScenarios,
      conditionsFor('ltr'),
      fixture.providerTheme
    );
    const rtl = observeCapButtonProductionScenarios(
      directionScenarios,
      conditionsFor('rtl'),
      fixture.providerTheme
    );

    expect(ltr).toHaveLength(45);
    expect(rtl).toHaveLength(45);

    for (let index = 0; index < ltr.length; index++) {
      const ltrLogical = normalizeCapButtonGeometry(ltr[index].geometry, 'ltr');
      const rtlLogical = normalizeCapButtonGeometry(rtl[index].geometry, 'rtl');

      expect(compareCapButtonLogicalGeometry(rtlLogical, ltrLogical)).toEqual(
        []
      );
    }

    expect(capButtonDirectionObservedEquivalence).toMatchObject({
      kind: 'observed-equivalence',
      directions: ['ltr', 'rtl'],
      scenarioCount: 45,
      support: 'unknown',
    });
  });

  it('makes an incorrect direction fail only at discriminating inline fields', () => {
    const scenario: CapButtonScenario = {
      ...tracedCapButtonScenario,
      content: {
        icon: 'present',
        children: 'present',
        iconPosition: 'before',
      },
    };
    const [production] = observeCapButtonProductionScenarios(
      [scenario],
      conditionsFor('rtl'),
      capButtonLightThemeFixture.providerTheme
    );
    const expected = normalizeCapButtonGeometry(production.geometry, 'rtl');
    const mutation = normalizeCapButtonGeometry(production.geometry, 'ltr');

    expect(
      compareCapButtonLogicalGeometry(mutation, expected).map(
        (difference) => difference.path
      )
    ).toEqual([
      'root.paddingInlineStart',
      'root.paddingInlineEnd',
      'icon.marginInlineStart',
      'icon.marginInlineEnd',
    ]);
  });

  it('keeps theme, direction, and forced colors independently composable', () => {
    const ordinaryConditions = conditionsFor('rtl');
    const forcedColors = resolveCapButtonForcedColors('primary', 'enabled', {
      forcedColors: true,
      focusVisible: false,
    });
    const ordinary = resolveCleanRoomCapButton(
      tracedCapButtonScenario,
      ordinaryConditions,
      capButtonDarkThemeFixture.semanticTokens
    );
    const forcedConditionStatic = resolveCleanRoomCapButton(
      tracedCapButtonScenario,
      { ...ordinaryConditions, forcedColors: true },
      capButtonDarkThemeFixture.semanticTokens
    );

    expect(forcedConditionStatic).toEqual(ordinary);
    expect(forcedColors.applies).toBe(true);
    expect('forcedColors' in capButtonDarkThemeFixture.semanticTokens).toBe(
      false
    );
    expect('theme' in ordinaryConditions).toBe(false);
    expect('direction' in forcedColors.conditions).toBe(false);
  });
});
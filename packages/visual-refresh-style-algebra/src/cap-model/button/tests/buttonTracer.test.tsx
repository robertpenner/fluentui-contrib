import type { CapButtonObservation } from '../CapButtonObservation';
import { compareCapButton } from '../compareCapButton';
import { capButtonProductionBaseline } from '../evidence';
import { resolveCleanRoomCapButton } from '../resolveCleanRoomCapButton';
import {
  observeCapButtonProduction,
  tracedCapButtonConditions,
  tracedCapButtonScenario,
} from './productionAdapter';

describe('production-faithful CAP Button tracer', () => {
  it('matches one production observation through the clean-room model', () => {
    const production = observeCapButtonProduction(
      tracedCapButtonScenario,
      tracedCapButtonConditions
    );
    const cleanRoom = resolveCleanRoomCapButton(
      tracedCapButtonScenario,
      tracedCapButtonConditions
    );

    expect(capButtonProductionBaseline).toEqual({
      id: 'fluent-button-9.70.0__cap-theme-0.5.1',
      sources: [
        {
          packageName: '@fluentui/react-components',
          version: '9.70.0',
          symbols: ['ButtonProps', 'useButton_unstable'],
        },
        {
          packageName: '@fluentui-contrib/react-cap-theme',
          version: '0.5.1',
          symbols: ['CAP_STYLE_HOOKS.useButtonStyles_unstable'],
        },
      ],
    });
    expect(production).toMatchObject({
      productionBaseline: capButtonProductionBaseline.id,
      normalized: {
        iconPosition: 'before',
        iconOnly: false,
        hasIcon: true,
        hasChildren: true,
      },
      anatomy: ['icon', 'content'],
      styleSelections: {
        root: {
          appearance: 'primary',
          size: 'medium',
          shape: 'rounded',
          availability: 'enabled',
          focus: 'primary',
          content: 'textAndIcon.before',
        },
        icon: {
          size: 'medium',
          position: 'before',
        },
      },
    });
    expect(compareCapButton(production, cleanRoom)).toEqual([]);
  });

  it('reports a focused difference for a deliberate observation mutation', () => {
    const production = observeCapButtonProduction(
      tracedCapButtonScenario,
      tracedCapButtonConditions
    );
    const cleanRoom = resolveCleanRoomCapButton(
      tracedCapButtonScenario,
      tracedCapButtonConditions
    );
    const mutation: CapButtonObservation = {
      ...production,
      normalized: {
        ...production.normalized,
        iconOnly: true,
      },
    };

    expect(compareCapButton(mutation, cleanRoom)).toEqual([
      {
        path: 'normalized.iconOnly',
        production: true,
        cleanRoom: false,
        evidence: cleanRoom.provenance,
      },
    ]);
  });
});

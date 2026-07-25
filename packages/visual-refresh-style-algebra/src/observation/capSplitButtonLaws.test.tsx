import * as React from 'react';
import { render } from '@testing-library/react';
import {
  CapFixtureProvider,
  CapSplitButtonFixtures,
  capButtonAppearances,
  capSplitButtonConditions,
  type CapButtonAppearance,
  type CapSplitButtonCondition,
} from '../fixtures/capButtonFamily';
import { buttonColorModes } from './observeButtonSurface';
import { capColors, capGeometry, observeCapSurface } from './capSurface';

type Direction = 'ltr' | 'rtl';
type Action = 'primary' | 'menu';

const directions: readonly Direction[] = ['ltr', 'rtl'];
const actions: readonly Action[] = ['primary', 'menu'];

/**
 * The corner that must survive, and the corner that must be squared away, for
 * each action in each writing direction.
 *
 * A SplitButton is two buttons pretending to be one. The pretence only works if
 * the joined edge is flat and the outer edge keeps the family's radius — and
 * which physical edge is "joined" depends on the writing direction.
 */
const joinedCorners: Record<Direction, Record<Action, readonly string[]>> = {
  ltr: {
    primary: ['border-top-right-radius', 'border-bottom-right-radius'],
    menu: ['border-top-left-radius', 'border-bottom-left-radius'],
  },
  rtl: {
    primary: ['border-top-left-radius', 'border-bottom-left-radius'],
    menu: ['border-top-right-radius', 'border-bottom-right-radius'],
  },
};

const outerCorners: Record<Direction, Record<Action, readonly string[]>> = {
  ltr: {
    primary: ['border-top-left-radius', 'border-bottom-left-radius'],
    menu: ['border-top-right-radius', 'border-bottom-right-radius'],
  },
  rtl: {
    primary: ['border-top-right-radius', 'border-bottom-right-radius'],
    menu: ['border-top-left-radius', 'border-bottom-left-radius'],
  },
};

/** The physical edge the divider is drawn on, per writing direction. */
const dividerEdge: Record<Direction, string> = {
  ltr: 'border-right-color',
  rtl: 'border-left-color',
};

/**
 * The edge each action gives up so the pair reads as one control.
 *
 * Its border width is zero there, so whatever colour is declared for it paints
 * nothing. A colour law that included it would compare invisible pixels.
 */
const joinedEdge: Record<Direction, Record<Action, string>> = {
  ltr: {
    primary: 'border-right-color',
    menu: 'border-left-color',
  },
  rtl: {
    primary: 'border-left-color',
    menu: 'border-right-color',
  },
};

/** The edge each action keeps: the outside of the pair. */
const outerEdge: Record<Direction, Record<Action, string>> = {
  ltr: {
    primary: 'border-left-color',
    menu: 'border-right-color',
  },
  rtl: {
    primary: 'border-right-color',
    menu: 'border-left-color',
  },
};

/**
 * The colours an action actually paints, named by role rather than by side.
 *
 * The surrendered edge is dropped because its border width is zero, so whatever
 * colour is declared there paints nothing. The kept edge is renamed, because the
 * two actions keep *opposite* physical sides — comparing them by side would
 * report the mirror image as a difference.
 */
const paintedColors = (
  direction: Direction,
  action: Action,
  surface: Parameters<typeof capColors>[0]
) => {
  const colors = capColors(surface);
  const surrendered = joinedEdge[direction][action];
  const outer = outerEdge[direction][action];

  return {
    ...Object.fromEntries(
      Object.entries(colors).filter(
        ([property]) => property !== surrendered && property !== outer
      )
    ),
    'border-outer-color': colors[outer],
  };
};

const testId = (
  direction: Direction,
  appearance: CapButtonAppearance,
  condition: CapSplitButtonCondition,
  action: Action
) => `${direction}-${appearance}-${condition}-${action}`;

const elementFor = (
  direction: Direction,
  appearance: CapButtonAppearance,
  condition: CapSplitButtonCondition,
  action: Action
): HTMLElement => {
  const element = document.querySelector(
    `[data-testid="${testId(direction, appearance, condition, action)}"]`
  );

  if (!(element instanceof HTMLElement)) {
    throw new Error(
      `fixture ${testId(direction, appearance, condition, action)} not rendered`
    );
  }

  return element;
};

const surfaceFor = (
  direction: Direction,
  appearance: CapButtonAppearance,
  condition: CapSplitButtonCondition,
  action: Action
) => observeCapSurface(elementFor(direction, appearance, condition, action));

const dividerFor = (
  direction: Direction,
  appearance: CapButtonAppearance,
  condition: CapSplitButtonCondition
) =>
  observeCapSurface(elementFor(direction, appearance, condition, 'primary'), {
    pseudoElement: '::after',
  });

const cases = capButtonAppearances.flatMap((appearance) =>
  capSplitButtonConditions.map(
    (condition) => [appearance, condition] as const
  )
);

beforeEach(() => {
  render(
    <>
      {directions.map((direction) => (
        <CapFixtureProvider key={direction} dir={direction}>
          <CapSplitButtonFixtures prefix={direction} />
        </CapFixtureProvider>
      ))}
    </>
  );
});

describe('CAP SplitButton inherited Button guarantees', () => {
  it.each(directions)('renders both actions as native buttons in %s', (direction) => {
    for (const [appearance, condition] of cases) {
      for (const action of actions) {
        const element = elementFor(direction, appearance, condition, action);

        expect(element.tagName).toBe('BUTTON');
        expect(element.getAttribute('type')).toBe('button');
      }
    }
  });

  it.each(directions)('draws a focus indicator on both actions in %s', (direction) => {
    for (const [appearance, condition] of cases) {
      for (const action of actions) {
        const { effective } = surfaceFor(direction, appearance, condition, action);

        for (const mode of buttonColorModes) {
          expect(effective[mode].focusVisible['outline-style']).toBe('solid');
        }
      }
    }
  });

  it.each(directions)(
    'suppresses hover and pressed feedback on both disabled actions in %s',
    (direction) => {
      for (const appearance of capButtonAppearances) {
        for (const action of actions) {
          const { effective } = surfaceFor(direction, appearance, 'disabled', action);

          for (const mode of buttonColorModes) {
            const rest = paintedColors(direction, action, effective[mode].rest);

            expect(
              paintedColors(direction, action, effective[mode].hover)
            ).toEqual(rest);
            expect(
              paintedColors(direction, action, effective[mode].active)
            ).toEqual(rest);
          }
        }
      }
    }
  );
});

describe('CAP SplitButton propagation laws', () => {
  it.each(directions)(
    'propagates the disabled state to both actions in %s',
    (direction) => {
      for (const appearance of capButtonAppearances) {
        for (const action of actions) {
          const disabled = elementFor(direction, appearance, 'disabled', action);

          expect(disabled.hasAttribute('disabled')).toBe(true);

          // A disabled-focusable split button must stay reachable on *both*
          // actions, or keyboard users lose the menu without being told why.
          const focusable = elementFor(
            direction,
            appearance,
            'disabledFocusable',
            action
          );

          expect(focusable.hasAttribute('disabled')).toBe(false);
          expect(focusable.getAttribute('aria-disabled')).toBe('true');
          expect(focusable.tabIndex).toBe(0);
        }
      }
    }
  );

  it.each(directions)(
    'gives both actions the same treatment for a given state in %s',
    (direction) => {
      for (const [appearance, condition] of cases) {
        const primary = surfaceFor(direction, appearance, condition, 'primary');
        const menu = surfaceFor(direction, appearance, condition, 'menu');

        for (const mode of buttonColorModes) {
          expect(
            paintedColors(direction, 'menu', menu.effective[mode].rest)
          ).toEqual(
            paintedColors(direction, 'primary', primary.effective[mode].rest)
          );
        }
      }
    }
  );
});

describe('CAP SplitButton joined-edge laws', () => {
  it.each(directions)('squares the joined edge in %s', (direction) => {
    for (const [appearance, condition] of cases) {
      for (const action of actions) {
        const { effective } = surfaceFor(direction, appearance, condition, action);
        const geometry = capGeometry(effective.ordinary.rest);

        for (const corner of joinedCorners[direction][action]) {
          expect([corner, geometry[corner]]).toEqual([corner, '0']);
        }
      }
    }
  });

  it.each(directions)('keeps the outer corners rounded in %s', (direction) => {
    for (const [appearance, condition] of cases) {
      for (const action of actions) {
        const { effective } = surfaceFor(direction, appearance, condition, action);
        const geometry = capGeometry(effective.ordinary.rest);

        for (const corner of outerCorners[direction][action]) {
          // An outer corner is usually left to the shared `border-radius`, so
          // "rounded" means "not squared", not "separately declared".
          const radius = geometry[corner] ?? geometry['border-radius'];

          expect([corner, radius]).not.toEqual([corner, '0']);
          expect([corner, radius]).not.toEqual([corner, undefined]);
        }
      }
    }
  });

  it.each(directions)(
    'keeps a visible boundary between the actions in %s',
    (direction) => {
      for (const [appearance, condition] of cases) {
        const { effective } = dividerFor(direction, appearance, condition);

        for (const mode of buttonColorModes) {
          const boundary = capColors(effective[mode].rest)[
            dividerEdge[direction]
          ];

          expect([appearance, condition, mode, boundary]).not.toEqual([
            appearance,
            condition,
            mode,
            undefined,
          ]);
          expect(boundary).not.toBe('transparent');
        }
      }
    }
  );
});

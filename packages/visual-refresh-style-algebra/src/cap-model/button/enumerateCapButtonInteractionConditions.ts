import type { CapButtonObservationConditions } from './CapButtonScenario';
import {
  capButtonInteractionBrowserBaseline,
  capButtonInteractionConditionEvidence,
  type CapModelEvidence,
} from './evidence';

export interface CapButtonInteractionConditionLedgerEntry {
  readonly id:
    | 'rest'
    | 'hover'
    | 'active'
    | 'focus-visible'
    | 'hover-focus-visible'
    | 'active-focus-visible';
  readonly conditions: CapButtonObservationConditions;
  readonly productionAction: string;
  readonly evidence: CapModelEvidence;
}

export interface CapButtonInteractionConditionExclusion {
  readonly id:
    | 'active-without-hover'
    | 'pointer-focus-visible'
    | 'forced-colors'
    | 'reduced-motion'
    | 'rtl'
    | 'non-chromium';
  readonly reason: string;
  readonly evidence: CapModelEvidence;
}

const fixedConditions = {
  forcedColors: false,
  prefersReducedMotion: false,
  direction: 'ltr',
} as const;

const condition = (
  hover: boolean,
  active: boolean,
  focusVisible: boolean
): CapButtonObservationConditions => ({
  hover,
  active,
  focusVisible,
  ...fixedConditions,
});

export const capButtonInteractionConditionLedger: readonly CapButtonInteractionConditionLedgerEntry[] =
  [
    {
      id: 'rest',
      conditions: condition(false, false, false),
      productionAction: 'mount without pointer or keyboard interaction',
      evidence: capButtonInteractionConditionEvidence,
    },
    {
      id: 'hover',
      conditions: condition(true, false, false),
      productionAction: 'move the Chromium pointer over the Button',
      evidence: capButtonInteractionConditionEvidence,
    },
    {
      id: 'active',
      conditions: condition(true, true, false),
      productionAction: 'hold the primary pointer button over the Button',
      evidence: capButtonInteractionConditionEvidence,
    },
    {
      id: 'focus-visible',
      conditions: condition(false, false, true),
      productionAction:
        'reach the Button by keyboard Tab with the pointer away',
      evidence: capButtonInteractionConditionEvidence,
    },
    {
      id: 'hover-focus-visible',
      conditions: condition(true, false, true),
      productionAction:
        'keyboard-focus the Button, then move the pointer over it',
      evidence: capButtonInteractionConditionEvidence,
    },
    {
      id: 'active-focus-visible',
      conditions: condition(true, true, true),
      productionAction:
        'keyboard-focus and hover the Button, then hold Space; Fluent suppresses the painted outline during activation',
      evidence: capButtonInteractionConditionEvidence,
    },
  ];

export const capButtonInteractionConditions: readonly CapButtonObservationConditions[] =
  capButtonInteractionConditionLedger.map((entry) => entry.conditions);

const exclusion = (
  id: CapButtonInteractionConditionExclusion['id'],
  reason: string
): CapButtonInteractionConditionExclusion => ({
  id,
  reason,
  evidence: capButtonInteractionConditionEvidence,
});

export const capButtonInteractionConditionExclusions: readonly CapButtonInteractionConditionExclusion[] =
  [
    exclusion(
      'active-without-hover',
      'Chromium pointer activation over the target also matches :hover; synthesizing :active alone would not be browser-realistic.'
    ),
    exclusion(
      'pointer-focus-visible',
      'Pointer focus does not stably satisfy Chromium focus-visible heuristics; keyboard Tab is the pinned production action.'
    ),
    exclusion(
      'forced-colors',
      'Forced-colors is modeled by the independent capButtonForcedColorsMatrix projection; it is not a seventh ordinary interaction condition.'
    ),
    exclusion(
      'reduced-motion',
      'Reduced-motion transition behavior belongs to issue #16.'
    ),
    exclusion('rtl', 'Writing-direction behavior belongs to issue #15.'),
    exclusion(
      'non-chromium',
      `The pinned evidence is ${capButtonInteractionBrowserBaseline.engine} ${capButtonInteractionBrowserBaseline.version} on ${capButtonInteractionBrowserBaseline.platform}; cross-engine focus-visible and computed-style serialization remain unknown.`
    ),
  ];

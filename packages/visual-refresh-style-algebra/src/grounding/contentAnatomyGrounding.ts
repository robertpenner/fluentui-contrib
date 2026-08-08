export type ButtonContentPresence = 'absent' | 'present';
export type ProductionIconPosition = 'omitted' | 'before' | 'after';
export type ButtonContentSlot = 'icon' | 'content';
export type GroundedContentKind = 'text' | 'iconOnly' | 'textAndIcon';
export type GroundedIconPlacement = 'none' | 'before' | 'after' | 'only';
export type CapStyleEffect =
  | 'base'
  | 'iconOnly'
  | 'textAndIconBefore'
  | 'textAndIconAfter';
export type ButtonContentObservationField =
  | 'baselineId'
  | 'scenarioId'
  | 'normalizedState'
  | 'renderedAnatomy'
  | 'capStyleEffect';

export interface ProductionEvidenceSource {
  readonly packageName: string;
  readonly version: string;
  readonly symbols: readonly string[];
}

export interface ProductionEvidenceBaseline {
  readonly id: string;
  readonly sources: readonly ProductionEvidenceSource[];
}

export const buttonContentEvidenceBaseline: ProductionEvidenceBaseline = {
  id: 'fluent-button-9.70.0__cap-theme-0.5.1',
  sources: [
    {
      packageName: '@fluentui/react-components',
      version: '9.70.0',
      symbols: ['ButtonProps', 'useButton_unstable', 'renderButton_unstable'],
    },
    {
      packageName: '@fluentui-contrib/react-cap-theme',
      version: '0.5.1',
      symbols: ['CAP_STYLE_HOOKS.useButtonStyles_unstable'],
    },
  ],
};

export interface ButtonContentScenario {
  readonly id: string;
  readonly icon: ButtonContentPresence;
  readonly children: ButtonContentPresence;
  readonly iconPosition: ProductionIconPosition;
}

const presences = ['absent', 'present'] as const;
const productionIconPositions = ['omitted', 'before', 'after'] as const;

export const buttonContentScenarios: readonly ButtonContentScenario[] =
  presences.flatMap((icon) =>
    presences.flatMap((children) =>
      productionIconPositions.map((iconPosition) => ({
        id: `icon-${icon}__children-${children}__position-${iconPosition}`,
        icon,
        children,
        iconPosition,
      }))
    )
  );

export interface ButtonContentProductionObservation {
  readonly baselineId: string;
  readonly scenarioId: string;
  readonly normalizedState: {
    readonly effectiveIconPosition: 'before' | 'after';
    readonly hasIconSlot: boolean;
    readonly hasRootChildren: boolean;
    readonly iconOnly: boolean;
  };
  readonly renderedAnatomy: {
    readonly slots: readonly ButtonContentSlot[];
  };
  readonly capStyleEffect: CapStyleEffect;
}

export type GroundedContentConfiguration = {
  readonly contentKind: GroundedContentKind;
  readonly iconPlacement: GroundedIconPlacement;
};

export type ButtonContentObservationMapping =
  | {
      readonly status: 'represented';
      readonly content: GroundedContentConfiguration;
      readonly evidence: readonly ProductionEvidenceBoundary[];
    }
  | {
      readonly status: 'canonicalized';
      readonly content: GroundedContentConfiguration;
      readonly discardedDistinctions: readonly string[];
      readonly evidence: readonly ProductionEvidenceBoundary[];
    }
  | {
      readonly status: 'excluded';
      readonly reason: string;
      readonly evidence: readonly ProductionEvidenceBoundary[];
    }
  | {
      readonly status: 'unrepresented';
      readonly reason: string;
      readonly evidence: readonly ProductionEvidenceBoundary[];
    };

export type ProductionEvidenceBoundary =
  | 'fluent-normalization'
  | 'fluent-rendering'
  | 'cap-style-classification';

export interface ButtonContentEvidenceRow {
  readonly scenario: ButtonContentScenario;
  readonly observation: ButtonContentProductionObservation;
  readonly support: 'unknown';
  readonly mapping: ButtonContentObservationMapping;
}

export interface ReactChildEdgeCase {
  readonly id:
    | 'null'
    | 'false'
    | 'zero'
    | 'emptyString'
    | 'emptyFragment'
    | 'whitespace';
  readonly label: string;
  readonly inputTruthy: boolean;
  readonly expectedIconOnly: boolean;
  readonly expectedCapStyleEffect: CapStyleEffect;
  readonly expectedRenderedText: string;
  readonly interpretation:
    | 'iconOnly'
    | 'textAndIcon'
    | 'classificationWithoutRenderedContent';
}

export const reactChildEdgeCases: readonly ReactChildEdgeCase[] = [
  {
    id: 'null',
    label: 'null',
    inputTruthy: false,
    expectedIconOnly: true,
    expectedCapStyleEffect: 'iconOnly',
    expectedRenderedText: '',
    interpretation: 'iconOnly',
  },
  {
    id: 'false',
    label: 'false',
    inputTruthy: false,
    expectedIconOnly: true,
    expectedCapStyleEffect: 'iconOnly',
    expectedRenderedText: '',
    interpretation: 'iconOnly',
  },
  {
    id: 'zero',
    label: '0',
    inputTruthy: false,
    expectedIconOnly: true,
    expectedCapStyleEffect: 'iconOnly',
    expectedRenderedText: '',
    interpretation: 'iconOnly',
  },
  {
    id: 'emptyString',
    label: "''",
    inputTruthy: false,
    expectedIconOnly: true,
    expectedCapStyleEffect: 'iconOnly',
    expectedRenderedText: '',
    interpretation: 'iconOnly',
  },
  {
    id: 'emptyFragment',
    label: '<></>',
    inputTruthy: true,
    expectedIconOnly: false,
    expectedCapStyleEffect: 'textAndIconBefore',
    expectedRenderedText: '',
    interpretation: 'classificationWithoutRenderedContent',
  },
  {
    id: 'whitespace',
    label: "' '",
    inputTruthy: true,
    expectedIconOnly: false,
    expectedCapStyleEffect: 'textAndIconBefore',
    expectedRenderedText: ' ',
    interpretation: 'textAndIcon',
  },
];

const mappingEvidence = ['fluent-normalization', 'fluent-rendering'] as const;

const scenarioById = (id: string): ButtonContentScenario => {
  const scenario = buttonContentScenarios.find(
    (candidate) => candidate.id === id
  );

  if (!scenario) {
    throw new Error(`Unknown button content scenario: ${id}`);
  }

  return scenario;
};

const represented = (
  contentKind: GroundedContentKind,
  iconPlacement: GroundedIconPlacement
): ButtonContentObservationMapping => ({
  status: 'represented',
  content: { contentKind, iconPlacement },
  evidence: mappingEvidence,
});

const canonicalized = (
  contentKind: GroundedContentKind,
  iconPlacement: GroundedIconPlacement,
  discardedDistinctions: readonly string[]
): ButtonContentObservationMapping => ({
  status: 'canonicalized',
  content: { contentKind, iconPlacement },
  discardedDistinctions,
  evidence: mappingEvidence,
});

const unrepresented = (reason: string): ButtonContentObservationMapping => ({
  status: 'unrepresented',
  reason,
  evidence: mappingEvidence,
});

const observation = (
  scenarioId: string,
  normalizedState: ButtonContentProductionObservation['normalizedState'],
  slots: readonly ButtonContentSlot[],
  capStyleEffect: CapStyleEffect
): ButtonContentProductionObservation => ({
  baselineId: buttonContentEvidenceBaseline.id,
  scenarioId,
  normalizedState,
  renderedAnatomy: { slots },
  capStyleEffect,
});

const evidenceRow = (
  scenarioId: string,
  productionObservation: ButtonContentProductionObservation,
  mapping: ButtonContentObservationMapping
): ButtonContentEvidenceRow => ({
  scenario: scenarioById(scenarioId),
  observation: productionObservation,
  support: 'unknown',
  mapping,
});

const withoutIcon = (
  hasRootChildren: boolean
): ButtonContentProductionObservation['normalizedState'] => ({
  effectiveIconPosition: 'before',
  hasIconSlot: false,
  hasRootChildren,
  iconOnly: false,
});

const iconOnly = (
  effectiveIconPosition: 'before' | 'after'
): ButtonContentProductionObservation['normalizedState'] => ({
  effectiveIconPosition,
  hasIconSlot: true,
  hasRootChildren: false,
  iconOnly: true,
});

const textAndIcon = (
  effectiveIconPosition: 'before' | 'after'
): ButtonContentProductionObservation['normalizedState'] => ({
  effectiveIconPosition,
  hasIconSlot: true,
  hasRootChildren: true,
  iconOnly: false,
});

const emptyReason =
  'Production renders a button root with no content slots; the clean-room content domain has no empty case.';
const irrelevantPosition = (
  position: 'before' | 'after'
): readonly string[] => [
  `iconPosition '${position}' has no rendered effect without an icon`,
];
const iconOnlyPosition = (
  position: ProductionIconPosition
): readonly string[] => [
  position === 'omitted'
    ? "omitted iconPosition defaults to 'before' and has no rendered effect for icon-only anatomy"
    : `iconPosition '${position}' has no rendered effect for icon-only anatomy`,
];

export const buttonContentEvidenceRows: readonly ButtonContentEvidenceRow[] = [
  evidenceRow(
    'icon-absent__children-absent__position-omitted',
    observation(
      'icon-absent__children-absent__position-omitted',
      withoutIcon(false),
      [],
      'base'
    ),
    unrepresented(emptyReason)
  ),
  evidenceRow(
    'icon-absent__children-absent__position-before',
    observation(
      'icon-absent__children-absent__position-before',
      withoutIcon(false),
      [],
      'base'
    ),
    unrepresented(emptyReason)
  ),
  evidenceRow(
    'icon-absent__children-absent__position-after',
    observation(
      'icon-absent__children-absent__position-after',
      {
        ...withoutIcon(false),
        effectiveIconPosition: 'after',
      },
      [],
      'base'
    ),
    unrepresented(emptyReason)
  ),
  evidenceRow(
    'icon-absent__children-present__position-omitted',
    observation(
      'icon-absent__children-present__position-omitted',
      withoutIcon(true),
      ['content'],
      'base'
    ),
    represented('text', 'none')
  ),
  evidenceRow(
    'icon-absent__children-present__position-before',
    observation(
      'icon-absent__children-present__position-before',
      withoutIcon(true),
      ['content'],
      'base'
    ),
    canonicalized('text', 'none', irrelevantPosition('before'))
  ),
  evidenceRow(
    'icon-absent__children-present__position-after',
    observation(
      'icon-absent__children-present__position-after',
      {
        ...withoutIcon(true),
        effectiveIconPosition: 'after',
      },
      ['content'],
      'base'
    ),
    canonicalized('text', 'none', irrelevantPosition('after'))
  ),
  evidenceRow(
    'icon-present__children-absent__position-omitted',
    observation(
      'icon-present__children-absent__position-omitted',
      iconOnly('before'),
      ['icon'],
      'iconOnly'
    ),
    canonicalized('iconOnly', 'only', iconOnlyPosition('omitted'))
  ),
  evidenceRow(
    'icon-present__children-absent__position-before',
    observation(
      'icon-present__children-absent__position-before',
      iconOnly('before'),
      ['icon'],
      'iconOnly'
    ),
    canonicalized('iconOnly', 'only', iconOnlyPosition('before'))
  ),
  evidenceRow(
    'icon-present__children-absent__position-after',
    observation(
      'icon-present__children-absent__position-after',
      iconOnly('after'),
      ['icon'],
      'iconOnly'
    ),
    canonicalized('iconOnly', 'only', iconOnlyPosition('after'))
  ),
  evidenceRow(
    'icon-present__children-present__position-omitted',
    observation(
      'icon-present__children-present__position-omitted',
      textAndIcon('before'),
      ['icon', 'content'],
      'textAndIconBefore'
    ),
    canonicalized('textAndIcon', 'before', [
      "omitted iconPosition defaults to 'before'",
    ])
  ),
  evidenceRow(
    'icon-present__children-present__position-before',
    observation(
      'icon-present__children-present__position-before',
      textAndIcon('before'),
      ['icon', 'content'],
      'textAndIconBefore'
    ),
    represented('textAndIcon', 'before')
  ),
  evidenceRow(
    'icon-present__children-present__position-after',
    observation(
      'icon-present__children-present__position-after',
      textAndIcon('after'),
      ['content', 'icon'],
      'textAndIconAfter'
    ),
    represented('textAndIcon', 'after')
  ),
];

const representedContentKey = (
  mapping: ButtonContentObservationMapping
): string | undefined =>
  mapping.status === 'represented' || mapping.status === 'canonicalized'
    ? `${mapping.content.contentKind}:${mapping.content.iconPlacement}`
    : undefined;

const representedContentKeys = buttonContentEvidenceRows
  .map(({ mapping }) => representedContentKey(mapping))
  .filter((key): key is string => key !== undefined);

export const buttonContentGroundingCensus = {
  productionScenarios: buttonContentEvidenceRows.length,
  representedScenarios: representedContentKeys.length,
  canonicalConfigurations: new Set(representedContentKeys).size,
  unrepresentedScenarios: buttonContentEvidenceRows.filter(
    ({ mapping }) => mapping.status === 'unrepresented'
  ).length,
  productSupportUnknown: buttonContentEvidenceRows.filter(
    ({ support }) => support === 'unknown'
  ).length,
} as const;

const sameSlots = (
  actual: readonly ButtonContentSlot[],
  expected: readonly ButtonContentSlot[]
): boolean =>
  actual.length === expected.length &&
  actual.every((slot, index) => slot === expected[index]);

export const compareButtonContentObservations = (
  actual: ButtonContentProductionObservation,
  expected: ButtonContentProductionObservation
): readonly ButtonContentObservationField[] => {
  const differences: ButtonContentObservationField[] = [];

  if (actual.baselineId !== expected.baselineId) {
    differences.push('baselineId');
  }
  if (actual.scenarioId !== expected.scenarioId) {
    differences.push('scenarioId');
  }
  if (
    JSON.stringify(actual.normalizedState) !==
    JSON.stringify(expected.normalizedState)
  ) {
    differences.push('normalizedState');
  }
  if (
    !sameSlots(actual.renderedAnatomy.slots, expected.renderedAnatomy.slots)
  ) {
    differences.push('renderedAnatomy');
  }
  if (actual.capStyleEffect !== expected.capStyleEffect) {
    differences.push('capStyleEffect');
  }

  return differences;
};

export const mapButtonContentObservation = (
  productionObservation: ButtonContentProductionObservation
): ButtonContentObservationMapping => {
  const scenario = scenarioById(productionObservation.scenarioId);
  const slots = productionObservation.renderedAnatomy.slots;

  if (sameSlots(slots, [])) {
    return unrepresented(emptyReason);
  }

  if (sameSlots(slots, ['content'])) {
    return scenario.iconPosition === 'omitted'
      ? represented('text', 'none')
      : canonicalized(
          'text',
          'none',
          irrelevantPosition(scenario.iconPosition)
        );
  }

  if (sameSlots(slots, ['icon'])) {
    return canonicalized(
      'iconOnly',
      'only',
      iconOnlyPosition(scenario.iconPosition)
    );
  }

  if (sameSlots(slots, ['icon', 'content'])) {
    return scenario.iconPosition === 'omitted'
      ? canonicalized('textAndIcon', 'before', [
          "omitted iconPosition defaults to 'before'",
        ])
      : represented('textAndIcon', 'before');
  }

  if (sameSlots(slots, ['content', 'icon'])) {
    return represented('textAndIcon', 'after');
  }

  return unrepresented(
    `Rendered slot order '${slots.join(
      ','
    )}' is not represented by the clean-room content domain.`
  );
};

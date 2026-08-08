export interface CapButtonProductionSource {
  readonly packageName: string;
  readonly version: string;
  readonly symbols: readonly string[];
}

export interface CapButtonProductionBaseline {
  readonly id: string;
  readonly sources: readonly CapButtonProductionSource[];
}

export interface CapModelEvidence {
  readonly productionBaseline: string;
  readonly productionSymbol: string;
  readonly scenarioProjection: string;
  readonly observation: string;
  readonly interpretation: string;
  readonly support: 'documented' | 'unknown' | 'unsupported';
}

export const capButtonProductionBaseline: CapButtonProductionBaseline = {
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
};

export const tracedCapButtonEvidence: readonly CapModelEvidence[] = [
  {
    productionBaseline: capButtonProductionBaseline.id,
    productionSymbol: 'useButton_unstable',
    scenarioProjection: 'content.icon, content.children, content.iconPosition',
    observation:
      "icon and children normalize to iconPosition 'before' and iconOnly false",
    interpretation:
      'Omitted icon position defaults to before; children keep the Button from being icon-only.',
    support: 'unknown',
  },
  {
    productionBaseline: capButtonProductionBaseline.id,
    productionSymbol: 'CAP_STYLE_HOOKS.useButtonStyles_unstable',
    scenarioProjection:
      'appearance, size, shape, disabled, disabledFocusable, normalized content',
    observation:
      'CAP adds root and icon styles for the primary medium rounded text-and-icon branch',
    interpretation:
      'The clean-room contract records semantic branch selections rather than generated class names.',
    support: 'unknown',
  },
];

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

export const capButtonGeometryEvidence: readonly CapModelEvidence[] = [
  {
    productionBaseline: capButtonProductionBaseline.id,
    productionSymbol: 'useRootStyles[size]',
    scenarioProjection: 'size, normalized iconOnly, normalized text-and-icon',
    observation:
      'Root padding is 5px/10px, 7px/12px, or 9px/16px, with icon-only and text-and-icon overrides.',
    interpretation:
      'Size and normalized content determine all four effective root padding declarations.',
    support: 'unknown',
  },
  {
    productionBaseline: capButtonProductionBaseline.id,
    productionSymbol: 'useRootIconOnlyStyles[size]',
    scenarioProjection: 'size, normalized iconOnly',
    observation:
      'Icon-only roots pin min-width and max-width to 28px, 36px, or 44px.',
    interpretation:
      'Icon-only Buttons preserve a square inline dimension for each size.',
    support: 'unknown',
  },
  {
    productionBaseline: capButtonProductionBaseline.id,
    productionSymbol:
      'useRootBaseStyles, useRootStyles[size], useRootStyles[shape]',
    scenarioProjection: 'size, shape',
    observation:
      'Rounded roots use 8px at small and 12px otherwise; square uses 0 and circular uses 10000px.',
    interpretation:
      'The effective four-corner radius is selected by shape, with a size-specific rounded override.',
    support: 'unknown',
  },
  {
    productionBaseline: capButtonProductionBaseline.id,
    productionSymbol: 'typographyStyles.body1Strong, caption1Strong, subtitle2',
    scenarioProjection: 'size',
    observation:
      'Root typography resolves to 12px/16px, 14px/20px, or 16px/22px at weight 600.',
    interpretation:
      'Size controls the effective root font size, line height, and weight.',
    support: 'unknown',
  },
  {
    productionBaseline: capButtonProductionBaseline.id,
    productionSymbol: 'useIconBaseStyles, useIconStyles[size]',
    scenarioProjection: 'size, content.icon',
    observation: 'Present icons resolve to font sizes 16px, 20px, or 24px.',
    interpretation:
      'Icon glyph dimensions scale independently with Button size.',
    support: 'unknown',
  },
  {
    productionBaseline: capButtonProductionBaseline.id,
    productionSymbol: 'useIconStyles[position], useIconStyles[size]',
    scenarioProjection: 'size, normalized text-and-icon, iconPosition',
    observation:
      'Text-and-icon spacing resolves to a 4px, 6px, or 8px margin on the icon side facing the text.',
    interpretation:
      'Icon placement mirrors the effective margin while icon-only Buttons have no text spacing.',
    support: 'unknown',
  },
];

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
  ...capButtonGeometryEvidence,
];

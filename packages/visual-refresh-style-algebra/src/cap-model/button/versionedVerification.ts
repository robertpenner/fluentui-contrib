export const capButtonContractGroups = [
  'normalization',
  'anatomy',
  'geometry',
  'appearance',
  'interaction',
  'forcedColors',
  'theme',
  'direction',
  'motion',
] as const;

export type CapButtonContractGroup = (typeof capButtonContractGroups)[number];

export type CapButtonProductionPackage =
  | '@fluentui/react-components'
  | '@fluentui-contrib/react-cap-theme';

export type CapButtonProductionSymbol =
  `${CapButtonProductionPackage}:${string}`;

export interface CapButtonBaselineManifest {
  readonly id: string;
  readonly packages: Readonly<Record<CapButtonProductionPackage, string>>;
  readonly contractOwners: Readonly<
    Record<CapButtonContractGroup, readonly CapButtonProductionSymbol[]>
  >;
  readonly productSupport: 'unknown';
}

export interface CapButtonBaselineDifference {
  readonly path: string;
  readonly baseline?: unknown;
  readonly actual?: unknown;
}

export interface CapButtonVerificationPassed {
  readonly status: 'passed';
}

export interface CapButtonProductionBaselineDrift {
  readonly status: 'failed';
  readonly kind: 'production-baseline-drift';
  readonly contractGroup: 'manifest' | CapButtonContractGroup;
  readonly differences: readonly CapButtonBaselineDifference[];
}

export interface CapButtonCleanRoomRegression {
  readonly status: 'failed';
  readonly kind: 'clean-room-regression';
  readonly contractGroup: CapButtonContractGroup;
  readonly differences: readonly CapButtonBaselineDifference[];
}

export type CapButtonVerificationResult =
  | CapButtonVerificationPassed
  | CapButtonProductionBaselineDrift
  | CapButtonCleanRoomRegression;

export type CapButtonVerificationOrigin = 'production' | 'clean-room';

export const capButtonBaselineManifest: CapButtonBaselineManifest = {
  id: 'fluent-button-9.70.0__cap-theme-0.5.1',
  packages: {
    '@fluentui/react-components': '9.70.0',
    '@fluentui-contrib/react-cap-theme': '0.5.1',
  },
  contractOwners: {
    normalization: ['@fluentui/react-components:useButton_unstable'],
    anatomy: ['@fluentui/react-components:useButton_unstable'],
    geometry: [
      '@fluentui-contrib/react-cap-theme:useRootBaseStyles',
      '@fluentui-contrib/react-cap-theme:useRootStyles',
      '@fluentui-contrib/react-cap-theme:useIconStyles',
    ],
    appearance: [
      '@fluentui-contrib/react-cap-theme:useRootStyles',
      '@fluentui-contrib/react-cap-theme:useRootDisabledStyles',
    ],
    interaction: [
      '@fluentui-contrib/react-cap-theme:useRootStyles',
      '@fluentui-contrib/react-cap-theme:useRootBaseFocusIndicatorStyles',
      '@fluentui-contrib/react-cap-theme:useRootFocusStyles',
    ],
    forcedColors: [
      '@fluentui-contrib/react-cap-theme:useRootBaseStyles',
      '@fluentui-contrib/react-cap-theme:useRootBaseFocusIndicatorStyles',
    ],
    theme: [
      '@fluentui/react-components:FluentProvider',
      '@fluentui/react-components:webLightTheme',
      '@fluentui/react-components:webDarkTheme',
      '@fluentui-contrib/react-cap-theme:CAP_THEME_TOKENS',
    ],
    direction: ['@fluentui/react-components:FluentProvider'],
    motion: ['@fluentui-contrib/react-cap-theme:useRootBaseStyles'],
  },
  productSupport: 'unknown',
};

export const verifyCapButtonBaselineManifest = (
  actual: CapButtonBaselineManifest
): CapButtonVerificationResult => {
  const differences: CapButtonBaselineDifference[] = [];

  for (const packageName of Object.keys(
    capButtonBaselineManifest.packages
  ) as CapButtonProductionPackage[]) {
    const baselineVersion = capButtonBaselineManifest.packages[packageName];
    const actualVersion = actual.packages[packageName];

    if (baselineVersion !== actualVersion) {
      differences.push({
        path: `packages.${packageName}`,
        baseline: baselineVersion,
        actual: actualVersion,
      });
    }
  }

  for (const contractGroup of capButtonContractGroups) {
    const baselineSymbols =
      capButtonBaselineManifest.contractOwners[contractGroup];
    const actualSymbols = actual.contractOwners[contractGroup];

    if (JSON.stringify(baselineSymbols) !== JSON.stringify(actualSymbols)) {
      differences.push({
        path: `contractOwners.${contractGroup}`,
        baseline: baselineSymbols,
        actual: actualSymbols,
      });
    }
  }

  if (differences.length > 0) {
    return {
      status: 'failed',
      kind: 'production-baseline-drift',
      contractGroup: 'manifest',
      differences,
    };
  }

  return { status: 'passed' };
};

export const classifyCapButtonVerification = (
  contractGroup: CapButtonContractGroup,
  origin: CapButtonVerificationOrigin,
  differences: readonly { readonly path: string }[]
): CapButtonVerificationResult => {
  if (differences.length === 0) {
    return { status: 'passed' };
  }

  return {
    status: 'failed',
    kind:
      origin === 'production'
        ? 'production-baseline-drift'
        : 'clean-room-regression',
    contractGroup,
    differences: differences.map(({ path }) => ({ path })),
  };
};

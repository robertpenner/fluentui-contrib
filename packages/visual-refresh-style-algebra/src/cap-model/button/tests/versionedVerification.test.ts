import fluentPackage from '@fluentui/react-components/package.json';
import capPackage from '@fluentui-contrib/react-cap-theme/package.json';

import {
  capButtonBaselineManifest,
  classifyCapButtonVerification,
  verifyCapButtonBaselineManifest,
} from '../versionedVerification';

describe('CAP Button versioned verification', () => {
  it('pins installed production versions and groups owning symbols by contract', () => {
    expect(capButtonBaselineManifest.packages).toEqual({
      '@fluentui/react-components': fluentPackage.version,
      '@fluentui-contrib/react-cap-theme': capPackage.version,
    });
    expect(capButtonBaselineManifest.packages).toEqual({
      '@fluentui/react-components': '9.70.0',
      '@fluentui-contrib/react-cap-theme': '0.5.1',
    });
    expect(Object.keys(capButtonBaselineManifest.contractOwners)).toEqual([
      'normalization',
      'anatomy',
      'geometry',
      'appearance',
      'interaction',
      'forcedColors',
      'theme',
      'direction',
      'motion',
    ]);
    expect(
      Object.values(capButtonBaselineManifest.contractOwners).every(
        (symbols) => symbols.length > 0
      )
    ).toBe(true);
  });

  it('classifies manifest mismatches as production baseline drift', () => {
    const result = verifyCapButtonBaselineManifest({
      ...capButtonBaselineManifest,
      packages: {
        ...capButtonBaselineManifest.packages,
        '@fluentui/react-components': '9.70.1',
      },
    });

    expect(result).toEqual({
      status: 'failed',
      kind: 'production-baseline-drift',
      contractGroup: 'manifest',
      differences: [
        {
          path: 'packages.@fluentui/react-components',
          baseline: '9.70.0',
          actual: '9.70.1',
        },
      ],
    });
  });

  it.each([
    ['production', 'production-baseline-drift'],
    ['clean-room', 'clean-room-regression'],
  ] as const)(
    'classifies %s field differences without losing their localized paths',
    (origin, kind) => {
      expect(
        classifyCapButtonVerification('geometry', origin, [
          { path: 'geometry.root.paddingTop' },
        ])
      ).toEqual({
        status: 'failed',
        kind,
        contractGroup: 'geometry',
        differences: [{ path: 'geometry.root.paddingTop' }],
      });
    }
  );
});

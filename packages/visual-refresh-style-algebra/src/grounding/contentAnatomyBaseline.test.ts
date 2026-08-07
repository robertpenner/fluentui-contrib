import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buttonContentEvidenceBaseline } from './contentAnatomyGrounding';

type PackageMetadata = {
  readonly version: string;
};

const readPackageMetadata = (relativePath: string): PackageMetadata =>
  JSON.parse(
    readFileSync(resolve(__dirname, relativePath), 'utf8')
  ) as PackageMetadata;

describe('content anatomy evidence baseline', () => {
  it('pins complete source metadata to the installed production packages', () => {
    const fluentPackage = readPackageMetadata(
      '../../../../node_modules/@fluentui/react-components/package.json'
    );
    const capPackage = readPackageMetadata(
      '../../../react-cap-theme/package.json'
    );

    expect(buttonContentEvidenceBaseline).toEqual({
      id: 'fluent-button-9.70.0__cap-theme-0.5.1',
      sources: [
        {
          packageName: '@fluentui/react-components',
          version: fluentPackage.version,
          symbols: [
            'ButtonProps',
            'useButton_unstable',
            'renderButton_unstable',
          ],
        },
        {
          packageName: '@fluentui-contrib/react-cap-theme',
          version: capPackage.version,
          symbols: ['CAP_STYLE_HOOKS.useButtonStyles_unstable'],
        },
      ],
    });
  });
});

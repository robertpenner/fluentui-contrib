import {
  type Theme,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components';
import { CAP_THEME_TOKENS } from '@fluentui-contrib/react-cap-theme';
import {
  type CapButtonThemeInput,
  projectCapButtonThemeInput,
} from '../CapButtonTheme';

export type CapButtonThemeFixtureName =
  | 'web-light-with-cap'
  | 'web-dark-with-cap';

export interface CapButtonThemeFixture {
  readonly name: CapButtonThemeFixtureName;
  readonly providerTheme: Theme;
  readonly semanticTokens: CapButtonThemeInput;
}

const createFixture = (
  name: CapButtonThemeFixtureName,
  fluentTheme: Theme
): CapButtonThemeFixture => {
  const providerTheme = { ...fluentTheme, ...CAP_THEME_TOKENS };

  return {
    name,
    providerTheme,
    semanticTokens: projectCapButtonThemeInput(providerTheme),
  };
};

export const capButtonLightThemeFixture = createFixture(
  'web-light-with-cap',
  webLightTheme
);

export const capButtonDarkThemeFixture = createFixture(
  'web-dark-with-cap',
  webDarkTheme
);
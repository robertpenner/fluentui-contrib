import * as React from 'react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import type { JSXElement } from '@fluentui/react-utilities';
import type { ButtonCase } from '../domain/ButtonCase';
import { resolveSemanticButton } from '../semantic/resolveSemanticButton';
import { CleanRoomButton } from './CleanRoomButton';

export const ResearchButton = ({
  input,
  label = 'Continue',
}: {
  input: ButtonCase;
  label?: string;
}): JSXElement => (
  <FluentProvider theme={webLightTheme}>
    <CleanRoomButton
      architecture="semantic"
      buttonCase={input}
      contract={resolveSemanticButton(input)}
      label={label}
      ariaLabel={input.contentKind === 'iconOnly' ? 'Add item' : undefined}
    />
  </FluentProvider>
);

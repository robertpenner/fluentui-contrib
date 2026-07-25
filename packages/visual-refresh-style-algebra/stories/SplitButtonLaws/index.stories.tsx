import type { Meta } from '@storybook/react';
import { SplitButtonPropagationLaws } from './SplitButtonLaws.stories';

const meta = {
  title: 'Packages/visual-refresh-style-algebra/CAP SplitButton laws',
  component: SplitButtonPropagationLaws,
} satisfies Meta<typeof SplitButtonPropagationLaws>;

export default meta;
export { SplitButtonPropagationLaws } from './SplitButtonLaws.stories';

import type { Meta } from '@storybook/react';
import { ButtonComparison } from './ButtonComparison.stories';

const meta = {
  title: 'Packages/visual-refresh-style-algebra/Button comparison',
  component: ButtonComparison,
} satisfies Meta<typeof ButtonComparison>;

export default meta;
export { ButtonComparison } from './ButtonComparison.stories';
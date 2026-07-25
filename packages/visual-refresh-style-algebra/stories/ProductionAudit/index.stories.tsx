import type { Meta } from '@storybook/react';
import { ProductionAudit } from './ProductionAudit.stories';

const meta = {
  title: 'Packages/visual-refresh-style-algebra/CAP production audit',
  component: ProductionAudit,
} satisfies Meta<typeof ProductionAudit>;

export default meta;

export { ProductionAudit };

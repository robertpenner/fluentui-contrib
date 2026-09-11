import * as React from 'react';
import { AddonPanel } from 'storybook/internal/components';
import { addons, types } from 'storybook/manager-api';

import { ADDON_ID, PANEL_ID } from './constants';
import { FluentInspectorPanel } from './panel/FluentInspectorPanel';

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Fluent Inspector',
    render: ({ active }) => (
      <AddonPanel active={active}>
        <FluentInspectorPanel />
      </AddonPanel>
    ),
  });
});

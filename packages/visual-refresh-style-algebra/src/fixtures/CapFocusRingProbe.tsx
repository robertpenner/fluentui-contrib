import * as React from 'react';
import { CapButtonFixtures, CapFixtureProvider } from './capButtonFamily';

/**
 * The CAP Button row inside its theme provider, as a single mountable component.
 *
 * Playwright's component testing can only mount a component it imports, so the
 * provider and the fixtures have to be composed here rather than in the spec.
 */
export const CapFocusRingProbe: React.FC = () => (
  <CapFixtureProvider>
    <CapButtonFixtures />
  </CapFixtureProvider>
);

CapFocusRingProbe.displayName = 'CapFocusRingProbe';

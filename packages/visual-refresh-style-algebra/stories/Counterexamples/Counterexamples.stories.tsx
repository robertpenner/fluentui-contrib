import * as React from 'react';
import { rtlSplitRegression } from '../fixtures';
import { CounterexampleInspector } from '../storySupport';

export const Counterexamples = () => (
  <CounterexampleInspector input={rtlSplitRegression} />
);

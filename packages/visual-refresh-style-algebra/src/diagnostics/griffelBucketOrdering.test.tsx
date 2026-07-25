import * as React from 'react';
import { render } from '@testing-library/react';
import { makeResetStyles, makeStyles, mergeClasses } from '@griffel/react';
import { griffelBucketOrdering } from './captureGriffelRules';

/**
 * `griffelBucketOrdering` mirrors an `@internal` constant, so it can drift when
 * Griffel is upgraded without any type error to warn us. These tests derive the
 * ordering from Griffel's own output instead of trusting the mirror.
 *
 * The ordering matters because every Griffel class carries identical
 * specificity: stylesheet order is the *only* thing that decides which of two
 * conflicting declarations wins, so a stale mirror would silently make the audit
 * report losers as winners.
 */

const useReset = makeResetStyles({
  color: 'reset',
});

const useBuckets = makeStyles({
  root: {
    color: 'unqualified',
    ':link': { color: 'link' },
    ':visited': { color: 'visited' },
    ':focus-within': { color: 'focusWithin' },
    ':focus': { color: 'focus' },
    ':focus-visible': { color: 'focusVisible' },
    ':hover': { color: 'hover' },
    ':active': { color: 'active' },
    '@media (forced-colors: active)': { color: 'media' },
  },
});

const Probe: React.FC = () => {
  const reset = useReset();
  const buckets = useBuckets();

  return <div className={mergeClasses(reset, buckets.root)} />;
};

const renderedBuckets = (): readonly string[] => {
  render(<Probe />);

  return Array.from(
    document.querySelectorAll('style[data-make-styles-bucket]')
  ).map((element) => element.getAttribute('data-make-styles-bucket') ?? '');
};

describe('griffelBucketOrdering', () => {
  it('covers every bucket Griffel emits for the selectors this audit reads', () => {
    for (const bucket of renderedBuckets()) {
      expect(griffelBucketOrdering).toContain(bucket);
    }
  });

  it('matches the order Griffel inserts its stylesheets in', () => {
    const emitted = renderedBuckets();
    const expected = griffelBucketOrdering.filter((bucket) =>
      emitted.includes(bucket)
    );

    expect(emitted).toEqual(expected);
    // A vacuous pass would mean the probe never reached more than one bucket.
    expect(expected.length).toBeGreaterThan(4);
  });

  it('places reset styles before the unqualified bucket that atomic styles use', () => {
    const emitted = renderedBuckets();

    expect(emitted.indexOf('r')).toBeGreaterThanOrEqual(0);
    expect(emitted.indexOf('r')).toBeLessThan(emitted.indexOf('d'));
  });

  it('places :focus-visible after the unqualified bucket, so an attribute selector loses to it', () => {
    const emitted = renderedBuckets();

    expect(emitted.indexOf('i')).toBeGreaterThan(emitted.indexOf('d'));
  });
});

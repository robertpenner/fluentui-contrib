import {
  GRIFFEL_UNSUPPORTED_SHORTHAND_PREFIX,
  parseGriffelShorthandDiagnostic,
  summarizeGriffelShorthandDiagnostics,
  unsupportedShorthandProperties,
} from './GriffelDiagnostic';
import {
  collectGriffelShorthandDiagnostics,
  formatGriffelShorthandDiagnostics,
} from './collectGriffelShorthandDiagnostics';

const diagnosticMessage = (property: string, value: string): string =>
  [
    `${GRIFFEL_UNSUPPORTED_SHORTHAND_PREFIX} "${property}". ` +
      `Please check your "makeStyles" calls, there *should not* be following:`,
    '  makeStyles({',
    `    [slot]: { ${property}: "${value}" }`,
    '  })',
    '',
    'Learn why CSS shorthands are not supported: https://aka.ms/griffel-css-shorthands',
  ].join('\n');

describe('parseGriffelShorthandDiagnostic', () => {
  it.each(unsupportedShorthandProperties)(
    'recovers the dropped declaration for %s',
    (property) => {
      const message = diagnosticMessage(property, 'Highlight');

      expect(parseGriffelShorthandDiagnostic(message)).toEqual({
        property,
        value: 'Highlight',
        message,
      });
    }
  );

  it('recovers values containing CSS variables and spaces', () => {
    const message = diagnosticMessage(
      'borderColor',
      'var(--colorStrokeFocus2) var(--colorStrokeFocus1)'
    );

    expect(parseGriffelShorthandDiagnostic(message)?.value).toBe(
      'var(--colorStrokeFocus2) var(--colorStrokeFocus1)'
    );
  });

  it('ignores console output that is not a shorthand diagnostic', () => {
    expect(
      parseGriffelShorthandDiagnostic('Warning: validateDOMNesting(...)')
    ).toBeUndefined();
    expect(
      parseGriffelShorthandDiagnostic(
        `${GRIFFEL_UNSUPPORTED_SHORTHAND_PREFIX} but truncated`
      )
    ).toBeUndefined();
  });
});

describe('collectGriffelShorthandDiagnostics', () => {
  it('collects diagnostics emitted during the render and restores console.error', () => {
    const originalError = console.error;

    const diagnostics = collectGriffelShorthandDiagnostics(() => {
      console.error(diagnosticMessage('borderColor', 'Highlight'));
      console.error(diagnosticMessage('borderStyle', 'none'));
    });

    expect(console.error).toBe(originalError);
    expect(diagnostics.map(({ property }) => property)).toEqual([
      'borderColor',
      'borderStyle',
    ]);
    expect(formatGriffelShorthandDiagnostics(diagnostics)).toBe(
      'borderColor: "Highlight"\nborderStyle: "none"'
    );
  });

  it('forwards unrelated console errors instead of swallowing them', () => {
    const originalError = console.error;
    const forwarded: unknown[][] = [];
    console.error = (...args: unknown[]): void => {
      forwarded.push(args);
    };

    try {
      const diagnostics = collectGriffelShorthandDiagnostics(() => {
        console.error('Warning: an unrelated React error', { detail: 1 });
      });

      expect(diagnostics).toEqual([]);
      expect(forwarded).toEqual([
        ['Warning: an unrelated React error', { detail: 1 }],
      ]);
    } finally {
      console.error = originalError;
    }
  });

  it('restores console.error when the render throws', () => {
    const originalError = console.error;

    expect(() =>
      collectGriffelShorthandDiagnostics(() => {
        throw new Error('render failed');
      })
    ).toThrow('render failed');
    expect(console.error).toBe(originalError);
  });
});

describe('summarizeGriffelShorthandDiagnostics', () => {
  it('groups distinct values by property', () => {
    const diagnostics = [
      diagnosticMessage('borderColor', 'Highlight'),
      diagnosticMessage('borderColor', 'Highlight'),
      diagnosticMessage('borderColor', 'GrayText'),
      diagnosticMessage('borderWidth', '1px'),
    ].flatMap((message) => parseGriffelShorthandDiagnostic(message) ?? []);

    expect(summarizeGriffelShorthandDiagnostics(diagnostics)).toEqual({
      borderColor: ['Highlight', 'GrayText'],
      borderWidth: ['1px'],
    });
  });
});

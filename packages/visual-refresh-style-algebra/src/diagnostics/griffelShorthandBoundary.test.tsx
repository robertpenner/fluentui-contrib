import * as React from 'react';
import { render } from '@testing-library/react';
import { type GriffelStyle, makeStyles } from '@griffel/react';
import { unsupportedShorthandProperties } from './GriffelDiagnostic';
import { collectGriffelShorthandDiagnostics } from './collectGriffelShorthandDiagnostics';

/**
 * `unsupportedShorthandProperties` mirrors an internal Griffel constant that is not
 * part of its public type surface. This boundary test asserts the mirror
 * empirically — by observing which properties Griffel actually drops — so a Griffel
 * upgrade that widens or narrows the set fails here rather than silently changing
 * what the CAP audit counts as a defect.
 */
const renderDeclaration = (property: string, value: string): void => {
  const useStyles = makeStyles({
    root: { [property]: value } as GriffelStyle,
  });
  const Fixture: React.FC = () => <div className={useStyles().root} />;
  render(<Fixture />);
};

describe('Griffel unsupported-shorthand boundary', () => {
  it.each(unsupportedShorthandProperties)('drops %s', (property) => {
    const diagnostics = collectGriffelShorthandDiagnostics(() => {
      renderDeclaration(property, 'Highlight');
    });

    expect(diagnostics.map(({ property: dropped }) => dropped)).toEqual([
      property,
    ]);
  });

  it('resolves the longhand replacements the CAP correction uses', () => {
    const diagnostics = collectGriffelShorthandDiagnostics(() => {
      renderDeclaration('borderTopColor', 'Highlight');
      renderDeclaration('borderRightColor', 'Highlight');
      renderDeclaration('borderBottomColor', 'Highlight');
      renderDeclaration('borderLeftColor', 'Highlight');
    });

    expect(diagnostics).toEqual([]);
  });
});

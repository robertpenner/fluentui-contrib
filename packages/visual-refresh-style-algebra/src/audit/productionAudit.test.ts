import * as fs from 'fs';
import * as path from 'path';
import {
  type AuditFinding,
  type StyleMarkerCensusRow,
  auditFindings,
  nextInvestigation,
  styleMarkerCensus,
} from './productionAudit';

const packageRoot = path.resolve(__dirname, '../..');

const readSource = (relativePath: string): string =>
  fs.readFileSync(path.join(packageRoot, relativePath), 'utf8');

const themeComponents = path.resolve(
  packageRoot,
  '../react-cap-theme/src/components'
);

const capFamilies = (): readonly string[] =>
  fs
    .readdirSync(themeComponents, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('react-'))
    .map((entry) => entry.name)
    .sort();

const styleFilesUnder = (directory: string): readonly string[] =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return styleFilesUnder(entryPath);
    }

    return entry.name.endsWith('.styles.ts') ? [entryPath] : [];
  });

/**
 * The properties Griffel refuses to expand. Written directly they are dropped at
 * build time, which is the mechanism of the first defect in this audit.
 */
const unsupportedShorthand =
  /^\s*(borderColor|borderStyle|borderWidth|borderBlock|borderBlockEnd|borderBlockStart|borderInline|borderInlineEnd|borderInlineStart)\s*:/;

/**
 * The remaining three markers, counted as occurrences rather than lines so a
 * single line declaring two of them is not undercounted.
 */
const focusOverride = /outline|:focus-visible|createCustomFocusIndicatorStyle/g;
const forcedColorsBlock = /forced-colors:\s*active/g;
const hardcodedPixel = /'\d+px'/g;

const occurrences = (source: string, pattern: RegExp): number =>
  (source.match(pattern) ?? []).length;

/**
 * Recounts every census column for one family straight off the theme package.
 * The census is only worth quoting if it is a measurement rather than a
 * transcription, so nothing here reads the recorded numbers.
 */
const measureFamily = (
  family: string
): Omit<StyleMarkerCensusRow, 'family'> => {
  const source = styleFilesUnder(path.join(themeComponents, family))
    .map((file) => fs.readFileSync(file, 'utf8'))
    .join('\n');

  return {
    rawShorthands: source
      .split('\n')
      .filter((line) => unsupportedShorthand.test(line)).length,
    focusOverrides: occurrences(source, focusOverride),
    forcedColorsBlocks: occurrences(source, forcedColorsBlock),
    hardcodedPixels: occurrences(source, hardcodedPixel),
  };
};

/**
 * A published audit is only worth reading if its claims are attached to
 * something that would fail when they stop being true. These checks are what
 * makes the report a record rather than a narrative.
 */
describe('CAP production audit', () => {
  it('gives every finding a unique id', () => {
    const ids = auditFindings.map((finding) => finding.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('never reports a correction without an executable regression', () => {
    const unbacked = auditFindings.filter(
      (finding) => finding.correction !== null && finding.regression === null
    );

    expect(unbacked).toEqual([]);
  });

  const cited: readonly AuditFinding[] = auditFindings.filter(
    (finding) => finding.regression !== null
  );

  it.each(cited.map((finding) => [finding.id, finding] as const))(
    'points %s at a suite that exists',
    (_id, finding) => {
      const regression = finding.regression;

      if (regression === null) {
        throw new Error(`${finding.id} lost the regression it was filtered on`);
      }

      expect(readSource(regression.file)).toContain(`'${regression.suite}'`);
    }
  );

  it.each(
    auditFindings
      .filter((finding) => finding.fixture !== null)
      .map((finding) => [finding.id, finding.fixture ?? ''] as const)
  )('points %s at a fixture that exists', (_id, fixture) => {
    expect(fs.existsSync(path.join(packageRoot, fixture))).toBe(true);
  });

  it('censuses every CAP component family', () => {
    expect(styleMarkerCensus.map((row) => row.family).sort()).toEqual(
      capFamilies()
    );
  });

  /**
   * The census is the nomination's whole evidence base, so every column is
   * recounted from the theme package rather than trusted. A recorded number that
   * has drifted is worse than no number, because it still reads as measurement.
   */
  it.each(styleMarkerCensus.map((row) => [row.family, row] as const))(
    'still measures the markers it recorded for %s',
    (family, row) => {
      const measured = measureFamily(family);

      expect({ family, ...measured }).toEqual(row);
    }
  );

  /**
   * The nomination states its numbers in prose as well as in the table. Binding
   * them together stops the narrative outliving the measurement that produced it.
   */
  it('quotes the census it was derived from', () => {
    const nominated = styleMarkerCensus.find(
      (row) => row.family === nextInvestigation.family
    );
    const audited = styleMarkerCensus.find(
      (row) => row.family === 'react-button'
    );
    const justification = nextInvestigation.measuredJustification;

    expect(justification).toContain(`(${nominated?.rawShorthands})`);
    expect(justification).toContain(
      `${nominated?.focusOverrides} against the audited Button family`
    );
    expect(justification).toContain(`${audited?.focusOverrides}`);
    expect(justification).toContain(
      `${nominated?.forcedColorsBlocks} forced-colors blocks`
    );
  });

  it('nominates the family the census actually points at', () => {
    const nominated = styleMarkerCensus.find(
      (row) => row.family === nextInvestigation.family
    );
    const audited = styleMarkerCensus.find(
      (row) => row.family === 'react-button'
    );

    expect(nominated).toBeDefined();
    expect(audited).toBeDefined();

    // The nomination rests on carrying the mechanisms this audit found, not on
    // being the largest or the most complicated family.
    expect(nominated?.rawShorthands).toBeGreaterThan(0);
    expect(nominated?.focusOverrides).toBeGreaterThan(
      audited?.focusOverrides ?? Infinity
    );
    expect(nominated?.forcedColorsBlocks).toBeGreaterThan(0);
    expect(
      styleMarkerCensus.filter((row) => row.rawShorthands > 0)
    ).toHaveLength(1);
  });
});

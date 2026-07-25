import * as fs from 'fs';
import * as path from 'path';
import {
  type AuditFinding,
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

const countRawShorthands = (family: string): number =>
  styleFilesUnder(path.join(themeComponents, family))
    .flatMap((file) => fs.readFileSync(file, 'utf8').split('\n'))
    .filter((line) => unsupportedShorthand.test(line)).length;

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

      // Narrowed by the filter above; restated so the test reads on its own.
      expect(regression).not.toBeNull();

      const source = readSource(regression?.file ?? '');

      expect(source).toContain(`'${regression?.suite}'`);
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
   * The nomination's strongest claim is that exactly one family still carries
   * the shorthands Griffel drops, so that column is re-derived from disk rather
   * than trusted. The other three columns are weaker signals and stay recorded.
   */
  it.each(styleMarkerCensus.map((row) => [row.family, row] as const))(
    'still measures the raw shorthands it recorded for %s',
    (family, row) => {
      expect(countRawShorthands(family)).toBe(row.rawShorthands);
    }
  );

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

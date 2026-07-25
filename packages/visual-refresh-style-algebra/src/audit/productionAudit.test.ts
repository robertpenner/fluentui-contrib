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
    const themeComponents = path.resolve(
      packageRoot,
      '../react-cap-theme/src/components'
    );
    const families = fs
      .readdirSync(themeComponents, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name.startsWith('react-'))
      .map((entry) => entry.name)
      .sort();

    expect(styleMarkerCensus.map((row) => row.family).sort()).toEqual(families);
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

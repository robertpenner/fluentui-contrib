import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { extname, relative, resolve } from 'node:path';
import {
  classifyLegacyButtonConsumer,
  legacyButtonConsumerInventory,
  syntheticButtonResearchMetadata,
} from './legacyButtonResearch';

const packageRoot = resolve(__dirname, '../..');
const sourceRoots = ['src', 'stories'] as const;
const sourceExtensions = new Set(['.ts', '.tsx']);
const legacyImportPattern =
  /(?:from|import\()\s*['"][^'"]*(?:domain\/|layered\/|semantic\/)/;

const collectSourceFiles = (directory: string): readonly string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      return collectSourceFiles(path);
    }

    return sourceExtensions.has(extname(entry.name)) ? [path] : [];
  });

describe('legacy Button research boundary', () => {
  it('labels the historical model as synthetic research without product support', () => {
    expect(syntheticButtonResearchMetadata).toEqual({
      kind: 'synthetic-button-research',
      provenance: 'historical-eleven-axis-button-model',
      rawTuples: 138_240,
      admittedCases: 27_840,
      productSupport: 'not-evaluated',
    });
  });

  it('assigns every retained legacy consumer to an explicit disposition', () => {
    const sourceFiles = sourceRoots.flatMap((root) =>
      collectSourceFiles(resolve(packageRoot, root))
    );
    const legacyConsumers = sourceFiles
      .filter((path) => legacyImportPattern.test(readFileSync(path, 'utf8')))
      .map((path) => relative(packageRoot, path).split('\\').join('/'));

    expect(legacyConsumers.length).toBeGreaterThan(0);

    for (const path of legacyConsumers) {
      expect(classifyLegacyButtonConsumer(path)).toBeDefined();
    }

    expect(
      legacyConsumers.filter((path) => path.startsWith('stories/'))
    ).toEqual([]);
    expect(
      legacyConsumers.filter((path) => path.startsWith('src/cap-model/'))
    ).toEqual([]);

    expect(
      legacyButtonConsumerInventory.map(({ classification }) => classification)
    ).toEqual(
      expect.arrayContaining([
        'production-conformance',
        'synthetic-research',
        'migration',
        'removal',
      ])
    );
  });

  it('keeps every explicitly inventoried story and document path current', () => {
    const exactPaths = legacyButtonConsumerInventory.flatMap((entry) =>
      entry.match.kind === 'path' ? [entry.match.value] : []
    );

    for (const path of exactPaths) {
      expect(existsSync(resolve(packageRoot, path))).toBe(true);
    }
  });

  it('classifies the replacement runtime as production conformance with a legacy import ban', () => {
    expect(
      classifyLegacyButtonConsumer('src/cap-model/button/laws.ts')
    ).toMatchObject({
      classification: 'production-conformance',
      policy: 'must-not-import-legacy',
    });
  });
});
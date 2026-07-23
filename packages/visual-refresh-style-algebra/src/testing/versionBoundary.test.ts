import { normalizeContract } from '../comparison/normalizeContract';
import { resolveLayeredButton } from '../layered/resolveLayeredButton';
import { resolveSemanticButton } from '../semantic/resolveSemanticButton';
import { frozenVersionCase, frozenVersionContract } from './versionFixture';

describe('version boundary', () => {
  it('Law 17: frozen design-language version remains deterministic', () => {
    expect(normalizeContract(resolveSemanticButton(frozenVersionCase))).toEqual(frozenVersionContract);
    expect(normalizeContract(resolveLayeredButton(frozenVersionCase))).toEqual(frozenVersionContract);
  });
});
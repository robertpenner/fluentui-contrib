import { blockSizePolicy, px } from './policies';

describe('named policy data', () => {
  it('encodes the presentation-derived 36 px and 32 px reference scenario once', () => {
    expect(blockSizePolicy.visualRefresh.fluent.standard).toBe(36);
    expect(blockSizePolicy.visualRefresh.sharepoint.standard).toBe(36);
    expect(blockSizePolicy.visualRefresh.teams.standard).toBe(32);
  });

  it('rejects invalid pixel values at policy declaration boundaries', () => {
    expect(() => px(Number.NaN)).toThrow('finite, non-negative');
    expect(() => px(Number.POSITIVE_INFINITY)).toThrow('finite, non-negative');
    expect(() => px(-1)).toThrow('finite, non-negative');
  });
});
import type { Density, Product, VisualLanguage } from './ButtonCase';

/** Numeric style values in the theory layer are CSS pixels. */
export type Pixels = number;

export const px = (value: number): Pixels => {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(
      `Expected a finite, non-negative pixel value, received ${value}`
    );
  }

  return value;
};

export const DESIGN_LANGUAGE_VERSION = 'visual-refresh-clean-room-v1' as const;

type DensityPolicy = Readonly<Record<Density, Pixels>>;
type ProductDensityPolicy = Readonly<Record<Product, DensityPolicy>>;

/**
 * Presentation evidence supplies only Visual Refresh standard=36 and Teams
 * standard=32. All compact and Fluent 2 values are replaceable model assumptions.
 */
export const blockSizePolicy: Readonly<
  Record<VisualLanguage, ProductDensityPolicy>
> = {
  fluent2: {
    fluent: { standard: px(32), compact: px(28) },
    sharepoint: { standard: px(32), compact: px(28) },
    teams: { standard: px(32), compact: px(28) },
  },
  visualRefresh: {
    fluent: { standard: px(36), compact: px(32) },
    sharepoint: { standard: px(36), compact: px(32) },
    teams: { standard: px(32), compact: px(28) },
  },
};

export const spacingPolicy = {
  minInlineSize: px(28),
  textPadding: px(12),
  iconOnlyPadding: px(8),
  iconAdjacentPadding: px(10),
  gap: px(6),
  compactDelta: px(2),
} as const;

export const shapePolicy = {
  fluent2: px(4),
  visualRefresh: px(8),
} as const;

export const typographyPolicy = {
  standard: { fontSize: px(14), fontWeight: 600, lineHeight: px(20) },
  compact: { fontSize: px(12), fontWeight: 600, lineHeight: px(16) },
} as const;

export const focusPolicy = {
  width: px(2),
  offset: px(2),
} as const;

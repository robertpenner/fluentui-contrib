import type {
  CapButtonGeometry,
  CapButtonIconGeometry,
  CapButtonRootGeometry,
} from './CapButtonObservation';
import type { CapButtonObservationConditions } from './CapButtonScenario';
import { capButtonDirectionEvidence } from './evidence';

export type CapButtonDirection = CapButtonObservationConditions['direction'];

export interface CapButtonLogicalRootGeometry {
  readonly paddingBlockStart: string;
  readonly paddingInlineEnd: string;
  readonly paddingBlockEnd: string;
  readonly paddingInlineStart: string;
  readonly borderStartStartRadius: string;
  readonly borderStartEndRadius: string;
  readonly borderEndEndRadius: string;
  readonly borderEndStartRadius: string;
  readonly minInlineSize?: string;
  readonly maxInlineSize?: string;
  readonly fontSize: string;
  readonly fontWeight: string;
  readonly lineHeight: string;
}

export interface CapButtonLogicalIconGeometry {
  readonly fontSize: string;
  readonly marginInlineStart?: string;
  readonly marginInlineEnd?: string;
}

export interface CapButtonLogicalGeometry {
  readonly root: CapButtonLogicalRootGeometry;
  readonly icon?: CapButtonLogicalIconGeometry;
}

export type CapButtonLogicalGeometryPath =
  | `root.${keyof CapButtonLogicalRootGeometry}`
  | `icon.${keyof CapButtonLogicalIconGeometry}`;

export interface CapButtonLogicalGeometryDifference {
  readonly path: CapButtonLogicalGeometryPath;
  readonly actual: string | undefined;
  readonly expected: string | undefined;
}

const logicalRoot = (
  root: CapButtonRootGeometry,
  direction: CapButtonDirection
): CapButtonLogicalRootGeometry => {
  const rtl = direction === 'rtl';

  return {
    paddingBlockStart: root.paddingTop,
    paddingInlineEnd: rtl ? root.paddingLeft : root.paddingRight,
    paddingBlockEnd: root.paddingBottom,
    paddingInlineStart: rtl ? root.paddingRight : root.paddingLeft,
    borderStartStartRadius: rtl
      ? root.borderTopRightRadius
      : root.borderTopLeftRadius,
    borderStartEndRadius: rtl
      ? root.borderTopLeftRadius
      : root.borderTopRightRadius,
    borderEndEndRadius: rtl
      ? root.borderBottomLeftRadius
      : root.borderBottomRightRadius,
    borderEndStartRadius: rtl
      ? root.borderBottomRightRadius
      : root.borderBottomLeftRadius,
    minInlineSize: root.minWidth,
    maxInlineSize: root.maxWidth,
    fontSize: root.fontSize,
    fontWeight: root.fontWeight,
    lineHeight: root.lineHeight,
  };
};

const logicalIcon = (
  icon: CapButtonIconGeometry,
  direction: CapButtonDirection
): CapButtonLogicalIconGeometry => ({
  fontSize: icon.fontSize,
  marginInlineStart: direction === 'rtl' ? icon.marginRight : icon.marginLeft,
  marginInlineEnd: direction === 'rtl' ? icon.marginLeft : icon.marginRight,
});

export const normalizeCapButtonGeometry = (
  geometry: CapButtonGeometry,
  direction: CapButtonDirection
): CapButtonLogicalGeometry => ({
  root: logicalRoot(geometry.root, direction),
  icon: geometry.icon ? logicalIcon(geometry.icon, direction) : undefined,
});

const rootFields = [
  'paddingBlockStart',
  'paddingInlineStart',
  'paddingInlineEnd',
  'paddingBlockEnd',
  'borderStartStartRadius',
  'borderStartEndRadius',
  'borderEndEndRadius',
  'borderEndStartRadius',
  'minInlineSize',
  'maxInlineSize',
  'fontSize',
  'fontWeight',
  'lineHeight',
] as const satisfies readonly (keyof CapButtonLogicalRootGeometry)[];

const iconFields = [
  'fontSize',
  'marginInlineStart',
  'marginInlineEnd',
] as const satisfies readonly (keyof CapButtonLogicalIconGeometry)[];

export const compareCapButtonLogicalGeometry = (
  actual: CapButtonLogicalGeometry,
  expected: CapButtonLogicalGeometry
): readonly CapButtonLogicalGeometryDifference[] => [
  ...rootFields.flatMap((field) =>
    actual.root[field] === expected.root[field]
      ? []
      : [
          {
            path: `root.${field}` as const,
            actual: actual.root[field],
            expected: expected.root[field],
          },
        ]
  ),
  ...iconFields.flatMap((field) =>
    actual.icon?.[field] === expected.icon?.[field]
      ? []
      : [
          {
            path: `icon.${field}` as const,
            actual: actual.icon?.[field],
            expected: expected.icon?.[field],
          },
        ]
  ),
];

export const capButtonDirectionObservedEquivalence = {
  kind: 'observed-equivalence',
  directions: ['ltr', 'rtl'],
  scenarioCount: 45,
  normalization: 'physical declarations projected to logical start/end',
  support: capButtonDirectionEvidence.support,
  evidence: capButtonDirectionEvidence,
} as const;

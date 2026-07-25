import { capTheme } from '../fixtures/capButtonFamily';
import {
  observeButtonSurface,
  projectSurface,
  resolveThemeValues,
  surfaceColorProperties,
  surfaceGeometryProperties,
  type ButtonSurface,
  type ButtonSurfaceObservation,
} from './observeButtonSurface';

const capThemeValues = capTheme as unknown as Readonly<Record<string, string>>;

/**
 * The colours a surface paints, with CAP theme tokens resolved to their values.
 *
 * Two declarations that name different tokens can still paint the same pixels —
 * `colorTransparentStroke` *is* `transparent`. A law about what the user sees
 * compares resolved values, or it reports a rename as a visual change.
 */
export const capColors = (surface: ButtonSurface): ButtonSurface =>
  resolveThemeValues(
    projectSurface(surface, surfaceColorProperties),
    capThemeValues
  );

/** The size and shape a surface declares, with colour excluded. */
export const capGeometry = (surface: ButtonSurface): ButtonSurface =>
  projectSurface(surface, surfaceGeometryProperties);

/** Observes a rendered CAP fixture through Griffel's cascade. */
export const observeCapSurface = (
  element: Element
): ButtonSurfaceObservation =>
  observeButtonSurface(element.ownerDocument, element);

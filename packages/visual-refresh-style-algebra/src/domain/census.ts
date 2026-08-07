import {
  anatomyPolicies,
  appearances,
  colorModes,
  compositionContexts,
  contentKinds,
  densities,
  directions,
  iconPlacements,
  interactionStates,
  products,
  visualLanguages,
  type ButtonCase,
} from './ButtonCase';
import { isValidButtonCase } from './validity';

export type ButtonCaseAxis = {
  key: keyof ButtonCase;
  label: string;
  values: readonly string[];
};

export const buttonCaseAxes: readonly ButtonCaseAxis[] = [
  { key: 'product', label: 'Product', values: products },
  {
    key: 'visualLanguage',
    label: 'Visual language',
    values: visualLanguages,
  },
  { key: 'density', label: 'Density', values: densities },
  { key: 'appearance', label: 'Appearance', values: appearances },
  {
    key: 'interactionState',
    label: 'Interaction state',
    values: interactionStates,
  },
  { key: 'colorMode', label: 'Color mode', values: colorModes },
  { key: 'contentKind', label: 'Content kind', values: contentKinds },
  {
    key: 'iconPlacement',
    label: 'Icon placement',
    values: iconPlacements,
  },
  { key: 'anatomyPolicy', label: 'Anatomy policy', values: anatomyPolicies },
  {
    key: 'compositionContext',
    label: 'Composition',
    values: compositionContexts,
  },
  { key: 'direction', label: 'Direction', values: directions },
];

const validBaseCase: ButtonCase = {
  product: 'fluent',
  visualLanguage: 'fluent2',
  density: 'standard',
  appearance: 'primary',
  interactionState: 'rest',
  colorMode: 'light',
  contentKind: 'text',
  iconPlacement: 'none',
  anatomyPolicy: 'fluentDefault',
  compositionContext: 'standalone',
  direction: 'ltr',
};

export const contentConstructionCensus = contentKinds.flatMap((contentKind) =>
  iconPlacements.map((iconPlacement) => ({
    contentKind,
    iconPlacement,
    valid: isValidButtonCase({
      ...validBaseCase,
      contentKind,
      iconPlacement,
    }),
  }))
);

export const productPolicyCensus = visualLanguages.flatMap((visualLanguage) =>
  products.map((product) => {
    const combinations = appearances.flatMap((appearance) =>
      anatomyPolicies.map((anatomyPolicy) => ({
        appearance,
        anatomyPolicy,
        valid: isValidButtonCase({
          ...validBaseCase,
          product,
          visualLanguage,
          appearance,
          anatomyPolicy,
        }),
      }))
    );

    return {
      product,
      visualLanguage,
      combinations,
      validCount: combinations.filter(({ valid }) => valid).length,
    };
  })
);

const multiply = (values: readonly number[]): number =>
  values.reduce((product, value) => product * value, 1);

export const buttonCaseCensus = {
  context: {
    axes: buttonCaseAxes.filter(({ key }) =>
      [
        'density',
        'interactionState',
        'colorMode',
        'compositionContext',
        'direction',
      ].includes(key)
    ),
    rawCount: multiply([
      densities.length,
      interactionStates.length,
      colorModes.length,
      compositionContexts.length,
      directions.length,
    ]),
  },
  contentConstruction: {
    axes: buttonCaseAxes.filter(({ key }) =>
      ['contentKind', 'iconPlacement'].includes(key)
    ),
    rawCount: contentConstructionCensus.length,
    validCount: contentConstructionCensus.filter(({ valid }) => valid).length,
  },
  productPolicy: {
    axes: buttonCaseAxes.filter(({ key }) =>
      ['product', 'visualLanguage', 'appearance', 'anatomyPolicy'].includes(key)
    ),
    rawCount: productPolicyCensus.reduce(
      (total, cell) => total + cell.combinations.length,
      0
    ),
    validCount: productPolicyCensus.reduce(
      (total, cell) => total + cell.validCount,
      0
    ),
  },
  rawTotal: multiply(buttonCaseAxes.map(({ values }) => values.length)),
  validTotal:
    multiply([
      densities.length,
      interactionStates.length,
      colorModes.length,
      compositionContexts.length,
      directions.length,
    ]) *
    contentConstructionCensus.filter(({ valid }) => valid).length *
    productPolicyCensus.reduce((total, cell) => total + cell.validCount, 0),
} as const;

export const enumerateButtonCases = (): ButtonCase[] => {
  const cases: ButtonCase[] = [];

  for (const product of products)
    for (const visualLanguage of visualLanguages)
      for (const density of densities)
        for (const appearance of appearances)
          for (const interactionState of interactionStates)
            for (const colorMode of colorModes)
              for (const contentKind of contentKinds)
                for (const iconPlacement of iconPlacements)
                  for (const anatomyPolicy of anatomyPolicies)
                    for (const compositionContext of compositionContexts)
                      for (const direction of directions) {
                        cases.push({
                          product,
                          visualLanguage,
                          density,
                          appearance,
                          interactionState,
                          colorMode,
                          contentKind,
                          iconPlacement,
                          anatomyPolicy,
                          compositionContext,
                          direction,
                        });
                      }

  return cases;
};

export {
  anatomyPolicies,
  appearances,
  colorModes,
  compositionContexts,
  contentKinds,
  densities,
  directions,
  formatButtonCase,
  iconPlacements,
  interactionStates,
  products,
  visualLanguages,
} from './domain/ButtonCase';
export type {
  AnatomyPolicy,
  Appearance,
  ButtonCase,
  ColorMode,
  CompositionContext,
  ContentKind,
  Density,
  Direction,
  IconPlacement,
  InteractionState,
  Product,
  VisualLanguage,
} from './domain/ButtonCase';
export {
  buttonCaseAxes,
  buttonCaseCensus,
  contentConstructionCensus,
  enumerateButtonCases,
  productPolicyCensus,
} from './domain/census';
export type { ButtonCaseAxis } from './domain/census';
export {
  buttonContentEvidenceBaseline,
  buttonContentEvidenceRows,
  buttonContentGroundingCensus,
  buttonContentScenarios,
  compareButtonContentObservations,
  mapButtonContentObservation,
  reactChildEdgeCases,
} from './grounding/contentAnatomyGrounding';
export type {
  ButtonContentEvidenceRow,
  ButtonContentObservationField,
  ButtonContentObservationMapping,
  ButtonContentProductionObservation,
  ButtonContentScenario,
  CapStyleEffect,
  GroundedContentConfiguration,
  ProductionEvidenceBaseline,
  ProductionEvidenceBoundary,
  ProductionEvidenceSource,
  ReactChildEdgeCase,
} from './grounding/contentAnatomyGrounding';
export {
  capButtonAppearances as productionCapButtonAppearances,
  capButtonAuthoredIconPositions,
  capButtonBooleanValues,
  capButtonReactChildInputs,
  capButtonScopedChildren,
  capButtonShapes as productionCapButtonShapes,
  capButtonSizes as productionCapButtonSizes,
} from './cap-model/button/CapButtonScenario';
export type {
  CapButtonAppearance as ProductionCapButtonAppearance,
  CapButtonAuthoredIconPosition,
  CapButtonChildrenInput,
  CapButtonContentPresence,
  CapButtonIconPosition,
  CapButtonObservationConditions,
  CapButtonReactChildInput,
  CapButtonScenario,
  CapButtonShape as ProductionCapButtonShape,
  CapButtonSize as ProductionCapButtonSize,
} from './cap-model/button/CapButtonScenario';
export { capButtonScenarios } from './cap-model/button/enumerateCapButtonScenarios';
export type {
  CapButtonAnatomySlot,
  CapButtonBorderColors,
  CapButtonFocusOutline,
  CapButtonGeneratedClassSignature,
  CapButtonGeometry,
  CapButtonIconGeometry,
  CapButtonNormalizedState,
  CapButtonObservation,
  CapButtonRootAppearance,
  CapButtonRootGeometry,
  CapButtonSemanticObservation,
  CapButtonStaticFocusTreatment,
  CapButtonStyleSelections,
} from './cap-model/button/CapButtonObservation';
export type { CapButtonContract } from './cap-model/button/CapButtonContract';
export {
  capButtonThemeFixtureNames,
  capButtonThemeInputKeys,
  compareCapButtonThemeInput,
  projectCapButtonThemeInput,
} from './cap-model/button/CapButtonTheme';
export type {
  CapButtonThemeFixtureName,
  CapButtonThemeInput,
  CapButtonThemeInputDifference,
  CapButtonThemeInputKey,
} from './cap-model/button/CapButtonTheme';
export {
  capButtonDirectionObservedEquivalence,
  compareCapButtonLogicalGeometry,
  normalizeCapButtonGeometry,
} from './cap-model/button/CapButtonDirection';
export type {
  CapButtonDirection,
  CapButtonLogicalGeometry,
  CapButtonLogicalGeometryDifference,
  CapButtonLogicalGeometryPath,
  CapButtonLogicalIconGeometry,
  CapButtonLogicalRootGeometry,
} from './cap-model/button/CapButtonDirection';
export type {
  CapButtonInteractionAvailability,
  CapButtonInteractionContract,
  CapButtonInteractionFocusOutline,
  CapButtonInteractionFocusTreatment,
  CapButtonInteractionSemanticContract,
  CapButtonInteractionSurface,
} from './cap-model/button/CapButtonInteraction';
export type {
  CapButtonForcedColorsActiveSemanticContract,
  CapButtonForcedColorsAuthoredContract,
  CapButtonForcedColorsAuthoredFocus,
  CapButtonForcedColorsCondition,
  CapButtonForcedColorsContract,
  CapButtonForcedColorsEffectiveContract,
  CapButtonForcedColorsEffectiveFocus,
  CapButtonForcedColorsInactiveSemanticContract,
  CapButtonForcedColorsSemanticContract,
  CapButtonSystemColorKeyword,
} from './cap-model/button/CapButtonForcedColors';
export type {
  CapButtonMotionAvailability,
  CapButtonMotionContract,
  CapButtonMotionTransition,
} from './cap-model/button/CapButtonMotion';
export { resolveCleanRoomCapButton } from './cap-model/button/resolveCleanRoomCapButton';
export {
  capButtonDisabledFocusableInteractionSurfaces,
  capButtonDisabledInteractionSurfaces,
  capButtonEnabledInteractionSurfaces,
  capButtonInteractionSurfaces,
  resolveCapButtonInteraction,
} from './cap-model/button/resolveCapButtonInteraction';
export {
  capButtonChromiumSystemColorPaint,
  resolveCapButtonForcedColors,
} from './cap-model/button/resolveCapButtonForcedColors';
export { compareCapButton } from './cap-model/button/compareCapButton';
export type { CapButtonDifference } from './cap-model/button/compareCapButton';
export { compareCapButtonInteraction } from './cap-model/button/compareCapButtonInteraction';
export type { CapButtonInteractionDifference } from './cap-model/button/compareCapButtonInteraction';
export { compareCapButtonForcedColors } from './cap-model/button/compareCapButtonForcedColors';
export type { CapButtonForcedColorsDifference } from './cap-model/button/compareCapButtonForcedColors';
export { compareCapButtonMotion } from './cap-model/button/compareCapButtonMotion';
export type { CapButtonMotionDifference } from './cap-model/button/compareCapButtonMotion';
export { projectCapButtonMotion } from './cap-model/button/projectCapButtonMotion';
export { resolveCapButtonMotion } from './cap-model/button/resolveCapButtonMotion';
export {
  capButtonInteractionConditionExclusions,
  capButtonInteractionConditionLedger,
  capButtonInteractionConditions,
} from './cap-model/button/enumerateCapButtonInteractionConditions';
export type {
  CapButtonInteractionConditionExclusion,
  CapButtonInteractionConditionLedgerEntry,
} from './cap-model/button/enumerateCapButtonInteractionConditions';
export {
  capButtonForcedColorsMatrix,
  capButtonForcedColorsProjection,
} from './cap-model/button/enumerateCapButtonForcedColorsMatrix';
export type { CapButtonForcedColorsMatrixEntry } from './cap-model/button/enumerateCapButtonForcedColorsMatrix';
export { capButtonMotionMatrix } from './cap-model/button/enumerateCapButtonMotionMatrix';
export type { CapButtonMotionMatrixEntry } from './cap-model/button/enumerateCapButtonMotionMatrix';
export {
  capButtonSemanticProfileCensus,
  capButtonSemanticObservationKey,
  capButtonSemanticProfileKey,
  capButtonSemanticProfileProjection,
  compareCapButtonSemanticProfileCensuses,
  compareCapButtonSemanticProfiles,
  createCapButtonSemanticProfileCensus,
  projectCapButtonSemanticProfile,
} from './cap-model/button/semanticProfiles';
export type {
  CapButtonChangedSemanticObservation,
  CapButtonObservedEquivalenceEvidence,
  CapButtonSemanticProfile,
  CapButtonSemanticProfileCensus,
  CapButtonSemanticProfileCensusDifference,
  CapButtonSemanticProfileDifference,
  CapButtonSemanticProfileGroup,
} from './cap-model/button/semanticProfiles';
export {
  capButtonBaselineManifest,
  capButtonContractGroups,
  classifyCapButtonVerification,
  verifyCapButtonBaselineManifest,
} from './cap-model/button/versionedVerification';
export type {
  CapButtonBaselineDifference,
  CapButtonBaselineManifest,
  CapButtonCleanRoomRegression,
  CapButtonContractGroup,
  CapButtonProductionBaselineDrift,
  CapButtonProductionPackage,
  CapButtonProductionSymbol,
  CapButtonVerificationOrigin,
  CapButtonVerificationPassed,
  CapButtonVerificationResult,
} from './cap-model/button/versionedVerification';
export {
  capButtonConformanceLaws,
  capButtonLawClassifications,
  capButtonResearchAssumptions,
  diagnoseCapButtonLaws,
  evaluateCapButtonProductionLaws,
} from './cap-model/button/laws';
export type {
  CapButtonConformanceLaw,
  CapButtonLaw,
  CapButtonLawClassification,
  CapButtonLawDiagnostic,
  CapButtonProductionLawFailure,
  CapButtonResearchAssumption,
} from './cap-model/button/laws';
export {
  capButtonAppearanceAvailabilityEvidence,
  capButtonDirectionEvidence,
  capButtonForcedColorsRuntimeEvidence,
  capButtonGeometryEvidence,
  capButtonInteractionBrowserBaseline,
  capButtonInteractionConditionEvidence,
  capButtonInteractionRuntimeEvidence,
  capButtonMotionRuntimeEvidence,
  capButtonProductionBaseline,
  tracedCapButtonEvidence,
} from './cap-model/button/evidence';
export type {
  CapButtonProductionBaseline,
  CapButtonProductionSource,
  CapModelEvidence,
} from './cap-model/button/evidence';
export {
  productionBooleanValues,
  productionButtonAvailabilityInputs,
  productionButtonGeneratedClassCensus,
  productionButtonShapes,
  productionButtonSizes,
  productionIconPositionInputs,
} from './grounding/productionButtonGeneratedClassCensus';
export type { ButtonAnatomy, ButtonSlot } from './domain/ButtonAnatomy';
export type {
  ButtonStyleContract,
  DecisionEvidence,
  StyleDecision,
} from './domain/ButtonStyleContract';
export {
  appearanceDomains,
  isAppearanceSupported,
  supportedAppearances,
} from './domain/SupportedDomain';
export {
  DESIGN_LANGUAGE_VERSION,
  blockSizePolicy,
  focusPolicy,
  px,
  shapePolicy,
  spacingPolicy,
  typographyPolicy,
} from './domain/policies';
export type { Pixels } from './domain/policies';
export {
  isSystemColorRole,
  systemColorRoles,
} from './domain/SemanticColorRole';
export type {
  ProductColorRole,
  SemanticColorRole,
  SystemColorRole,
} from './domain/SemanticColorRole';
export type { ForcedColorsContract } from './domain/ForcedColorsContract';
export { validationObligations } from './domain/ValidationObligation';
export type { ValidationObligation } from './domain/ValidationObligation';
export {
  assertValidButtonCase,
  invalidButtonCaseReasons,
  isValidButtonCase,
} from './domain/validity';
export type { InvalidButtonCaseReason } from './domain/validity';
export { compareContracts } from './comparison/compareContracts';
export type { ContractDifference } from './comparison/compareContracts';
export { formatCounterexample } from './comparison/formatCounterexample';
export { normalizeContract } from './comparison/normalizeContract';
export type { ComparableButtonStyleContract } from './comparison/normalizeContract';
export {
  resolveLayeredButton,
  resolveLayeredButtonInOrder,
  resolveLayeredButtonWithHistory,
  standardOverrideOrder,
} from './layered/resolveLayeredButton';
export type { OverrideStageName } from './layered/resolveLayeredButton';
export { fieldsWithOverlappingOwnership } from './layered/writeHistory';
export type {
  FieldWrite,
  LayeredState,
  LayerName,
} from './layered/writeHistory';
export { resolveSemanticButton } from './semantic/resolveSemanticButton';
export { resolveForcedColorsContract } from './semantic/resolveForcedColorsContract';
export { emitForcedColors } from './emission/emitForcedColors';
export { createForcedColorsEmissionExperiment } from './emission/createForcedColorsEmissionExperiment';
export {
  evaluateEmission,
  measureForcedColorsEmission,
  normalizeForcedColorsEmission,
} from './emission/normalizeForcedColorsEmission';
export { FORCED_COLORS_MEDIA } from './emission/ForcedColorsEmission';
export type {
  EmissionDiagnostic,
  EmissionResult,
  EmittedStyleRule,
  ForcedColorsComponent,
  ForcedColorsDecision,
  ForcedColorsEmissionMetrics,
  ForcedColorsEmissionTarget,
  ForcedColorsSlot,
} from './emission/ForcedColorsEmission';
export {
  assertAccessibleLabel,
  CleanRoomButton,
} from './render/CleanRoomButton';
export type { CleanRoomButtonProps } from './render/CleanRoomButton';
export { contractToStyles } from './render/contractToStyles';
export {
  GRIFFEL_UNSUPPORTED_SHORTHAND_PREFIX,
  parseGriffelShorthandDiagnostic,
  summarizeGriffelShorthandDiagnostics,
  unsupportedShorthandProperties,
} from './diagnostics/GriffelDiagnostic';
export type {
  GriffelShorthandDiagnostic,
  UnsupportedShorthandProperty,
} from './diagnostics/GriffelDiagnostic';
export {
  collectGriffelShorthandDiagnostics,
  formatGriffelShorthandDiagnostics,
} from './diagnostics/collectGriffelShorthandDiagnostics';
export {
  captureElementGriffelRules,
  captureGriffelRules,
  byGriffelCascade,
  declarationsForProperty,
  griffelBucketOrdering,
} from './diagnostics/captureGriffelRules';
export type { CapturedGriffelRule } from './diagnostics/captureGriffelRules';
export {
  buttonColorModes,
  buttonSurfaceStates,
  expandOutlineShorthand,
  observeButtonSurface,
  projectSurface,
  resolveThemeValues,
  summarizeButtonSurface,
  surfaceColorProperties,
  surfaceGeometryProperties,
} from './observation/observeButtonSurface';
export type {
  ButtonColorMode,
  ButtonSurface,
  ButtonSurfaceObservation,
  ButtonSurfaceState,
  SurfaceSelection,
} from './observation/observeButtonSurface';
export {
  capColors,
  capGeometry,
  observeCapSurface,
} from './observation/capSurface';
export {
  asButtonAppearance,
  capButtonAppearances,
  capSplitButtonConditions,
  CapButtonFamilyFixtures,
  CapButtonFixtures,
  CapFixtureProvider,
  capTheme,
  CapSplitButtonFixtures,
  CapToggleButtonFixtures,
  fluentExpressibleAppearances,
} from './fixtures/capButtonFamily';
export type {
  CapButtonAppearance,
  CapFixtureProviderProps,
  CapSplitButtonCondition,
  CapSplitButtonFixturesProps,
} from './fixtures/capButtonFamily';
export { AlternateAppearanceProbe } from './fixtures/AlternateAppearanceProbe';
export type { AlternateAppearanceProbeProps } from './fixtures/AlternateAppearanceProbe';
export { CapFocusRingProbe } from './fixtures/CapFocusRingProbe';
export {
  auditFindings,
  nextInvestigation,
  styleMarkerCensus,
} from './audit/productionAudit';
export type {
  AuditClassification,
  AuditFinding,
  StyleMarkerCensusRow,
} from './audit/productionAudit';

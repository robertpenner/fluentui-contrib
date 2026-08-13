import * as React from 'react';
import { Button, makeStyles, tokens } from '@fluentui/react-components';
import { Add20Regular } from '@fluentui/react-icons';

import { CapFixtureProvider } from '../../src/fixtures/capButtonFamily';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gap: tokens.spacingVerticalXXL,
  },
  section: {
    display: 'grid',
    gap: tokens.spacingVerticalL,
    padding: tokens.spacingHorizontalL,
    backgroundColor: tokens.colorNeutralBackground2,
    borderTop: `${tokens.strokeWidthThick} solid ${tokens.colorBrandStroke1}`,
  },
  intro: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
    maxWidth: '68ch',
  },
  eyebrow: {
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  heading: {
    margin: 0,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
  body: {
    margin: 0,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase400,
  },
  lawGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 640px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
  law: {
    display: 'grid',
    alignContent: 'start',
    gap: tokens.spacingVerticalXS,
    minWidth: 0,
    padding: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground1,
    borderTop: `${tokens.strokeWidthThick} solid ${tokens.colorBrandStroke1}`,
  },
  permissionLaw: {
    borderTopColor: tokens.colorPaletteBlueBorderActive,
  },
  preservationLaw: {
    borderTopColor: tokens.colorPaletteGreenBorder1,
  },
  lawType: {
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  lawTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
  },
  lawText: {
    margin: 0,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase400,
  },
  detail: {
    color: tokens.colorNeutralForeground3,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase300,
    overflowWrap: 'anywhere',
  },
  geometryStage: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    minWidth: 0,
    paddingBlock: tokens.spacingVerticalM,
    borderTop: `${tokens.strokeWidthThin} dashed ${tokens.colorNeutralStroke2}`,
    borderBottom: `${tokens.strokeWidthThin} dashed ${tokens.colorNeutralStroke2}`,
  },
  buttonColumn: {
    display: 'grid',
    justifyItems: 'center',
    gap: tokens.spacingVerticalXS,
    minWidth: 0,
  },
  buttonState: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  geometryResult: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
    color: tokens.colorPaletteGreenForeground1,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  choices: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  choice: {
    paddingBlock: tokens.spacingVerticalXXS,
    paddingInline: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground3,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    fontSize: tokens.fontSizeBase200,
  },
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 640px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
  galleryItem: {
    display: 'grid',
    alignContent: 'start',
    gap: tokens.spacingVerticalM,
    minWidth: 0,
    padding: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  demo: {
    borderTopColor: tokens.colorPaletteRedBorder2,
  },
  demoLabel: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  narrowing: {
    display: 'grid',
    gap: tokens.spacingVerticalS,
  },
  narrowingStep: {
    display: 'grid',
    gridTemplateColumns: 'minmax(10rem, 1fr) minmax(16rem, 1fr)',
    alignItems: 'center',
    gap: tokens.spacingHorizontalL,
    minWidth: 0,
    padding: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground1,
    borderLeft: `${tokens.strokeWidthThick} solid ${tokens.colorPaletteRedBorder2}`,
    '@media (max-width: 640px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
  narrowingFinal: {
    borderLeftColor: tokens.colorPaletteGreenBorder1,
  },
  stepText: {
    display: 'grid',
    gap: tokens.spacingVerticalXXS,
    minWidth: 0,
  },
  stepNumber: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  stepValue: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase300,
    overflowWrap: 'anywhere',
  },
  stillFails: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  smallest: {
    color: tokens.colorPaletteGreenForeground1,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
});

const simulatedFaultStyle: React.CSSProperties = {
  paddingBlock: tokens.spacingVerticalXXL,
};

type ButtonPairProps = {
  readonly buttonProps?: React.ComponentProps<typeof Button>;
  readonly content?: React.ReactNode;
  readonly faultyDisabled?: boolean;
  readonly label: string;
};

const ButtonPair = ({
  buttonProps,
  content = 'Save',
  faultyDisabled = false,
  label,
}: ButtonPairProps): React.ReactElement => {
  const styles = useStyles();

  return (
    <div className={styles.galleryItem}>
      <span className={styles.detail}>{label}</span>
      <div className={styles.geometryStage}>
        <div className={styles.buttonColumn}>
          <span className={styles.buttonState}>Enabled</span>
          <Button {...buttonProps}>{content}</Button>
        </div>
        <div className={styles.buttonColumn}>
          <span className={styles.buttonState}>Disabled</span>
          <Button
            {...buttonProps}
            disabled
            style={faultyDisabled ? simulatedFaultStyle : undefined}
          >
            {content}
          </Button>
        </div>
      </div>
      <span
        className={faultyDisabled ? styles.stillFails : styles.geometryResult}
      >
        {faultyDisabled ? 'Height changed' : 'Same height and alignment'}
      </span>
    </div>
  );
};

ButtonPair.displayName = 'ButtonPair';

export const OneButtonLaws = (): React.ReactElement => {
  const styles = useStyles();

  return (
    <CapFixtureProvider>
      <section className={styles.section}>
        <h3 className={styles.heading}>
          What may change, and what must remain?
        </h3>
        <div className={styles.lawGrid}>
          <article className={`${styles.law} ${styles.permissionLaw}`}>
            <span className={styles.lawType}>MAY CHANGE</span>
            <span className={styles.lawTitle}>Permission law</span>
            <p className={styles.lawText}>
              When a Button becomes disabled, its colors may change.
            </p>
          </article>
          <article className={`${styles.law} ${styles.preservationLaw}`}>
            <span className={styles.lawType}>MUST REMAIN</span>
            <span className={styles.lawTitle}>Preservation law</span>
            <p className={styles.lawText}>
              When that Button becomes disabled, its size and content alignment
              must remain unchanged.
            </p>
          </article>
        </div>
        <ButtonPair
          buttonProps={{ appearance: 'primary' }}
          label="primary + medium + text"
        />
      </section>
    </CapFixtureProvider>
  );
};

OneButtonLaws.displayName = 'OneButtonLaws';

export const ValidButtonVariations = (): React.ReactElement => {
  const styles = useStyles();

  return (
    <CapFixtureProvider>
      <section className={styles.section}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>TRY VALID VARIATIONS</span>
          <h3 className={styles.heading}>
            Generate combinations the Button supports
          </h3>
          <p className={styles.body}>
            Each generated Button uses valid props and must pass the same
            preservation checks.
          </p>
        </div>
        <ul className={styles.choices} aria-label="Generated Button choices">
          <li className={styles.choice}>appearance</li>
          <li className={styles.choice}>size</li>
          <li className={styles.choice}>shape</li>
          <li className={styles.choice}>content</li>
          <li className={styles.choice}>icon position</li>
        </ul>
        <div className={styles.gallery}>
          <ButtonPair
            buttonProps={{ appearance: 'primary', size: 'small' }}
            label="primary + small + text"
          />
          <ButtonPair
            buttonProps={{ appearance: 'outline', size: 'large' }}
            label="outline + large + text"
          />
          <ButtonPair
            buttonProps={{ appearance: 'subtle', icon: <Add20Regular /> }}
            label="subtle + icon before"
          />
          <ButtonPair
            buttonProps={{
              appearance: 'transparent',
              icon: <Add20Regular />,
              shape: 'circular',
              'aria-label': 'Add item',
            }}
            content={null}
            label="transparent + circular + icon only"
          />
        </div>
      </section>
    </CapFixtureProvider>
  );
};

ValidButtonVariations.displayName = 'ValidButtonVariations';

export const NarrowingFailure = (): React.ReactElement => {
  const styles = useStyles();

  return (
    <CapFixtureProvider>
      <section className={`${styles.section} ${styles.demo}`}>
        <div className={styles.intro}>
          <span className={styles.demoLabel}>
            IMAGINED BUG, NOT CURRENT CAP BEHAVIOR
          </span>
          <h3 className={styles.heading}>
            Disabled styling adds extra vertical padding
          </h3>
          <p className={styles.body}>
            The first failing Button has many details. Shrinking removes them
            one at a time and checks whether the failure remains.
          </p>
        </div>
        <div className={styles.narrowing}>
          <div className={styles.narrowingStep}>
            <div className={styles.stepText}>
              <span className={styles.stepNumber}>First failure</span>
              <span className={styles.stepValue}>
                large + rounded + Primary + icon after + enabled/disabled
              </span>
              <span className={styles.stillFails}>Still fails</span>
            </div>
            <ButtonPair
              buttonProps={{
                appearance: 'primary',
                size: 'large',
                shape: 'rounded',
                icon: <Add20Regular />,
                iconPosition: 'after',
              }}
              faultyDisabled
              label="Compare geometry"
            />
          </div>
          <div className={styles.narrowingStep}>
            <div className={styles.stepText}>
              <span className={styles.stepNumber}>Remove shape and icon</span>
              <span className={styles.stepValue}>
                large + Primary + enabled/disabled
              </span>
              <span className={styles.stillFails}>Still fails</span>
            </div>
            <ButtonPair
              buttonProps={{ appearance: 'primary', size: 'large' }}
              faultyDisabled
              label="Compare geometry"
            />
          </div>
          <div className={styles.narrowingStep}>
            <div className={styles.stepText}>
              <span className={styles.stepNumber}>Remove size</span>
              <span className={styles.stepValue}>
                Primary + enabled/disabled
              </span>
              <span className={styles.stillFails}>Still fails</span>
            </div>
            <ButtonPair
              buttonProps={{ appearance: 'primary' }}
              faultyDisabled
              label="Compare geometry"
            />
          </div>
          <div className={`${styles.narrowingStep} ${styles.narrowingFinal}`}>
            <div className={styles.stepText}>
              <span className={styles.stepNumber}>Remove appearance</span>
              <span className={styles.stepValue}>enabled/disabled</span>
              <span className={styles.smallest}>Smallest useful example</span>
            </div>
            <ButtonPair faultyDisabled label="Compare geometry" />
          </div>
        </div>
      </section>
    </CapFixtureProvider>
  );
};

NarrowingFailure.displayName = 'NarrowingFailure';

export const PropertyBasedTestingIntroduction = (): React.ReactElement => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <OneButtonLaws />
      <ValidButtonVariations />
      <NarrowingFailure />
    </div>
  );
};

PropertyBasedTestingIntroduction.displayName =
  'PropertyBasedTestingIntroduction';

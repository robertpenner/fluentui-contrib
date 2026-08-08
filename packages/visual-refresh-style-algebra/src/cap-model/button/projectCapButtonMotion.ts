import type { CapButtonMotionContract } from './CapButtonMotion';

const splitCssList = (value: string): readonly string[] => {
  const entries: string[] = [];
  let depth = 0;
  let current = '';

  for (const character of value) {
    if (character === '(') {
      depth += 1;
    } else if (character === ')') {
      depth -= 1;
    }

    if (character === ',' && depth === 0) {
      entries.push(current.trim());
      current = '';
    } else {
      current += character;
    }
  }

  entries.push(current.trim());
  return entries.filter((entry) => entry.length > 0);
};

const cssTimePattern = /^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)(ms|s)$/i;

const durationInMilliseconds = (value: string): number => {
  const match = cssTimePattern.exec(value);

  if (match === null) {
    throw new Error(`Unsupported CSS transition duration: ${value}`);
  }

  const duration = Number(match[1]);
  return match[2].toLowerCase() === 's' ? duration * 1000 : duration;
};

export const projectCapButtonMotion = (
  transitionProperty: string,
  transitionDuration: string
): CapButtonMotionContract => {
  const properties = splitCssList(transitionProperty);
  const durations = splitCssList(transitionDuration).map(
    durationInMilliseconds
  );

  if (properties.length === 0 || durations.length === 0) {
    throw new Error('Transition property and duration lists must not be empty');
  }

  return {
    transitions: properties.map((property, index) => ({
      property,
      durationMs: durations[index % durations.length],
    })),
  };
};

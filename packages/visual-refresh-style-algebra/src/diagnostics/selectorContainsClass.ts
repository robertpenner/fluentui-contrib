const escapeRegularExpression = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const selectorContainsClass = (
  selector: string,
  className: string
): boolean =>
  new RegExp(`\\.${escapeRegularExpression(className)}(?![-_a-zA-Z0-9])`).test(
    selector
  );

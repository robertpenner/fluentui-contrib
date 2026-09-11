import { fileURLToPath } from 'node:url';

export function managerEntries(entry: string[] = []) {
  return [
    ...entry,
    fileURLToPath(
      import.meta.resolve(
        '../packages/storybook-addon-fluent-inspector/src/manager.tsx'
      )
    ),
  ];
}

export function previewAnnotations(entry: string[] = []) {
  return [
    ...entry,
    fileURLToPath(
      import.meta.resolve(
        '../packages/storybook-addon-fluent-inspector/src/preview.ts'
      )
    ),
  ];
}

import { fileURLToPath } from 'node:url';

function resolveLocalEntry(relativePath: string): string {
  return fileURLToPath(new URL(relativePath, import.meta.url));
}

export function managerEntries(entry: string[] = []): string[] {
  return [
    ...entry,
    resolveLocalEntry(
      '../packages/storybook-addon-fluent-inspector/src/manager.tsx'
    ),
  ];
}

export function previewAnnotations(entry: string[] = []): string[] {
  return [
    ...entry,
    resolveLocalEntry(
      '../packages/storybook-addon-fluent-inspector/src/preview.ts'
    ),
  ];
}

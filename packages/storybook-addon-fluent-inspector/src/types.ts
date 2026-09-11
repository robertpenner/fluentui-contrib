export interface FluentInspectorNode {
  id: string;
  name: string;
  props: Record<string, string>;
  children: FluentInspectorNode[];
}

export interface FluentInspectorSnapshot {
  storyId?: string;
  roots: FluentInspectorNode[];
}

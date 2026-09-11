import type { FluentInspectorNode, FluentInspectorSnapshot } from '../types';
import {
  getFiberDisplayName,
  getFiberFromElement,
  type ReactFiberLike,
} from './reactFiberAdapter';

const fluentComponentNames = new Set([
  'Accordion',
  'AccordionHeader',
  'AccordionItem',
  'AccordionPanel',
  'Avatar',
  'Badge',
  'Button',
  'Card',
  'CardFooter',
  'CardHeader',
  'Checkbox',
  'Combobox',
  'Dialog',
  'Dropdown',
  'Field',
  'Input',
  'Label',
  'Link',
  'Menu',
  'MenuItem',
  'Option',
  'Popover',
  'Radio',
  'RadioGroup',
  'Select',
  'Slider',
  'SpinButton',
  'Switch',
  'Tab',
  'TabList',
  'Text',
  'Textarea',
  'Tooltip',
]);

const ids = new WeakMap<object, string>();
let nextId = 1;

export interface DiscoveryResult {
  snapshot: FluentInspectorSnapshot;
  elementsById: Map<string, HTMLElement>;
}

export function discoverFluentTree(
  root: ParentNode,
  storyId?: string
): DiscoveryResult {
  const discovered = new Set<ReactFiberLike>();
  const hostByFiber = new Map<ReactFiberLike, HTMLElement>();
  const orderByFiber = new Map<ReactFiberLike, number>();
  let order = 0;

  for (const element of getElements(root)) {
    const hostFiber = getFiberFromElement(element);
    if (!hostFiber) {
      continue;
    }

    for (let fiber: ReactFiberLike | null = hostFiber; fiber; fiber = fiber.return) {
      const name = getFiberDisplayName(fiber);
      if (!name || !fluentComponentNames.has(name)) {
        continue;
      }

      discovered.add(fiber);
      if (!hostByFiber.has(fiber)) {
        hostByFiber.set(fiber, element);
        orderByFiber.set(fiber, order++);
      }
    }
  }

  const nodeByFiber = new Map<ReactFiberLike, FluentInspectorNode>();
  const elementsById = new Map<string, HTMLElement>();

  for (const fiber of discovered) {
    const name = getFiberDisplayName(fiber);
    if (!name) {
      continue;
    }

    const id = getFiberId(fiber);
    const node: FluentInspectorNode = {
      id,
      name,
      props: serializeProps(fiber.memoizedProps),
      children: [],
    };

    nodeByFiber.set(fiber, node);

    const host = hostByFiber.get(fiber);
    if (host) {
      elementsById.set(id, host);
    }
  }

  const roots: FluentInspectorNode[] = [];

  for (const fiber of discovered) {
    const node = nodeByFiber.get(fiber);
    if (!node) {
      continue;
    }

    const parent = findNearestDiscoveredParent(fiber, discovered);
    const parentNode = parent ? nodeByFiber.get(parent) : undefined;

    if (parentNode) {
      parentNode.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortNodes = (nodes: FluentInspectorNode[]) => {
    nodes.sort((a, b) => {
      const fiberA = findFiberForNode(a, nodeByFiber);
      const fiberB = findFiberForNode(b, nodeByFiber);
      return (orderByFiber.get(fiberA) ?? 0) - (orderByFiber.get(fiberB) ?? 0);
    });

    for (const node of nodes) {
      sortNodes(node.children);
    }
  };

  sortNodes(roots);

  return {
    snapshot: { storyId, roots },
    elementsById,
  };
}

function getElements(root: ParentNode): HTMLElement[] {
  const elements: HTMLElement[] = [];

  if (root instanceof HTMLElement) {
    elements.push(root);
  }

  for (const element of root.querySelectorAll<HTMLElement>('*')) {
    elements.push(element);
  }

  return elements;
}

function findNearestDiscoveredParent(
  fiber: ReactFiberLike,
  discovered: Set<ReactFiberLike>
): ReactFiberLike | null {
  for (let parent = fiber.return; parent; parent = parent.return) {
    if (discovered.has(parent)) {
      return parent;
    }
  }

  return null;
}

function findFiberForNode(
  node: FluentInspectorNode,
  nodeByFiber: Map<ReactFiberLike, FluentInspectorNode>
): ReactFiberLike {
  for (const [fiber, candidate] of nodeByFiber) {
    if (candidate === node) {
      return fiber;
    }
  }

  throw new Error(`Missing Fiber for inspector node ${node.id}`);
}

function getFiberId(fiber: ReactFiberLike): string {
  let id = ids.get(fiber);
  if (!id) {
    id = `fluent-${nextId++}`;
    ids.set(fiber, id);
  }

  return id;
}

function serializeProps(
  props: Record<string, unknown> | null | undefined
): Record<string, string> {
  if (!props) {
    return {};
  }

  const result: Record<string, string> = {};

  for (const [name, value] of Object.entries(props)) {
    if (name === 'children' || name.startsWith('__')) {
      continue;
    }

    result[name] = serializeValue(value);
  }

  return result;
}

function serializeValue(value: unknown): string {
  if (value === undefined) {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (typeof value === 'function') {
    return `[Function${value.name ? ` ${value.name}` : ''}]`;
  }

  if (typeof value === 'symbol') {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return `[Array(${value.length})]`;
  }

  if (typeof value === 'object') {
    const reactElement = value as { $$typeof?: symbol; type?: unknown };
    if (reactElement.$$typeof) {
      const type = reactElement.type as { displayName?: string; name?: string } | string;
      const name =
        typeof type === 'string'
          ? type
          : type?.displayName || type?.name || 'ReactElement';
      return `<${name}>`;
    }

    try {
      const json = JSON.stringify(value);
      if (json === undefined) {
        return '[Object]';
      }

      return json.length <= 160 ? json : '[Object]';
    } catch {
      return '[Object]';
    }
  }

  return String(value);
}

export interface ReactFiberLike {
  tag: number;
  type: unknown;
  elementType?: unknown;
  return: ReactFiberLike | null;
  child: ReactFiberLike | null;
  sibling: ReactFiberLike | null;
  stateNode: unknown;
  memoizedProps?: Record<string, unknown> | null;
}

const fiberPrefixes = ['__reactFiber$', '__reactInternalInstance$'];

/**
 * Experimental adapter around React's DOM-attached Fiber handle.
 *
 * This is deliberately the only module that knows about React's private DOM
 * properties. The inspector can replace this adapter later with build-time
 * instrumentation or a supported React integration without changing its
 * manager/preview protocol.
 */
export function getFiberFromElement(element: Element): ReactFiberLike | null {
  for (const key of Object.getOwnPropertyNames(element)) {
    if (fiberPrefixes.some(prefix => key.startsWith(prefix))) {
      return (element as unknown as Record<string, unknown>)[key] as ReactFiberLike;
    }
  }

  return null;
}

export function getFiberDisplayName(fiber: ReactFiberLike): string | null {
  return getDisplayNameFromType(fiber.elementType ?? fiber.type);
}

function getDisplayNameFromType(type: unknown, depth = 0): string | null {
  if (!type || depth > 4) {
    return null;
  }

  if (typeof type === 'function') {
    const component = type as { displayName?: string; name?: string };
    return component.displayName || component.name || null;
  }

  if (typeof type !== 'object') {
    return null;
  }

  const component = type as {
    displayName?: string;
    render?: unknown;
    type?: unknown;
  };

  if (component.displayName) {
    return component.displayName;
  }

  return (
    getDisplayNameFromType(component.render, depth + 1) ||
    getDisplayNameFromType(component.type, depth + 1)
  );
}

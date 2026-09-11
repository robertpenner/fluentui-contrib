export interface FluentHighlighter {
  highlight(element: HTMLElement | undefined): void;
  clear(): void;
}

export function createFluentHighlighter(): FluentHighlighter {
  let highlighted:
    | {
        element: HTMLElement;
        outline: string;
        outlineOffset: string;
      }
    | undefined;

  const clear = () => {
    if (!highlighted) {
      return;
    }

    highlighted.element.style.outline = highlighted.outline;
    highlighted.element.style.outlineOffset = highlighted.outlineOffset;
    highlighted = undefined;
  };

  return {
    highlight(element) {
      clear();
      if (!element) {
        return;
      }

      highlighted = {
        element,
        outline: element.style.outline,
        outlineOffset: element.style.outlineOffset,
      };

      element.style.outline = '2px solid #0f6cbd';
      element.style.outlineOffset = '2px';
      element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    },
    clear,
  };
}

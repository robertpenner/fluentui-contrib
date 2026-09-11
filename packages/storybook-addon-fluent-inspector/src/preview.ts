import { addons } from 'storybook/preview-api';

import { EVENTS } from './constants';
import { discoverFluentTree } from './runtime/fluentTree';
import { createFluentHighlighter } from './runtime/highlight';

const highlighter = createFluentHighlighter();
let elementsById = new Map<string, HTMLElement>();
let currentStoryId: string | undefined;
let channelInitialized = false;
let scheduledFrame: number | undefined;

type StoryFn = () => unknown;
interface StoryContextLike {
  id: string;
}

function ensureChannelListeners() {
  if (channelInitialized) {
    return;
  }

  const channel = addons.getChannel();

  channel.on(EVENTS.SELECT, (id: string | undefined) => {
    highlighter.highlight(id ? elementsById.get(id) : undefined);
  });

  channel.on(EVENTS.REFRESH, () => {
    scheduleDiscovery(currentStoryId);
  });

  channelInitialized = true;
}

function scheduleDiscovery(storyId?: string) {
  currentStoryId = storyId;

  if (scheduledFrame !== undefined) {
    cancelAnimationFrame(scheduledFrame);
  }

  scheduledFrame = requestAnimationFrame(() => {
    scheduledFrame = undefined;

    const root = document.getElementById('storybook-root') ?? document.body;
    const result = discoverFluentTree(root, currentStoryId);
    elementsById = result.elementsById;

    addons.getChannel().emit(EVENTS.TREE, result.snapshot);
  });
}

function withFluentInspector(Story: StoryFn, context: StoryContextLike) {
  ensureChannelListeners();
  scheduleDiscovery(context.id);
  return Story();
}

export const decorators = [withFluentInspector];

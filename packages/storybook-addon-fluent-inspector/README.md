# Fluent Inspector Storybook addon prototype

Experimental Storybook addon for inspecting the **rendered Fluent UI React v9 component composition**, rather than only the top-level story args.

Tracks #22.

## Current prototype

The first slice proves four things:

1. discover registered Fluent components nested in an arbitrary rendered React story;
2. project those instances into a compact Fluent-semantic tree;
3. select a tree node and highlight its rendered host DOM;
4. inspect the selected instance's current runtime props.

The manager and preview communicate through Storybook's addon channel using serializable snapshots.

```text
preview iframe                            Storybook manager

rendered React tree
       |
       v
experimental Fiber adapter
       |
       v
Fluent tree + runtime props  ---------->  Fluent Inspector panel
       ^                                      |
       |                                      |
DOM highlight                  <----------  selection
```

## Run the dogfood Storybook

```sh
yarn nx storybook storybook-addon-fluent-inspector
```

Open the **Runtime discovery** story, switch to Canvas if necessary, and open the **Fluent Inspector** addon panel.

## Why React Fiber is used here

React does not expose an application-facing API for enumerating component instances from a rendered DOM subtree. For this feasibility prototype, `runtime/reactFiberAdapter.ts` reads React's private DOM-attached Fiber handle.

That dependency is intentionally isolated in one file. It is **not** proposed as the long-term public integration contract. If the experiment proves useful, alternatives to investigate include:

- build-time component instrumentation;
- a Babel/Webpack transform that assigns stable instance metadata;
- integration with a supported React/DevTools hook if an appropriate API exists;
- explicit Fluent instrumentation at component boundaries.

The tree builder, channel protocol, manager panel, metadata layer, and selection UI should not need to care which discovery adapter is used.

## Fluent component recognition

The initial prototype uses a small allowlist of Fluent v9 display names in `runtime/fluentTree.ts`. This keeps the first experiment predictable and makes false positives obvious.

A production implementation should replace this with stronger package-aware identity/metadata rather than assuming a component named `Button` is necessarily Fluent.

## Props

Runtime prop values are serialized conservatively for transport to the manager. `children` and private-looking props are omitted. Functions, React elements, arrays, and complex objects are summarized rather than deeply serialized.

The next important layer is to join these current runtime values with Fluent/docgen metadata so the inspector can understand:

- prop types;
- legal union/enum values;
- defaults;
- descriptions;
- semantic grouping;
- eventually, safe editing controls.

## Packaging caveat

This workspace's shared Nx build executor currently rewrites package exports to only `.` and `./package.json`. Storybook addons require dedicated `./manager` and `./preview` exports.

For that reason this package currently exposes its TypeScript workspace source directly and has Storybook targets, but deliberately has no normal package `build` target. The MVP should prove the runtime architecture before changing the shared build executor or adding a package-specific addon bundler.

## Explicit non-goals for this prototype

- production-stable React instrumentation;
- exhaustive Fluent component recognition;
- prop mutation;
- replacing Storybook Controls;
- npm publication;
- changing the shared package build system.

import * as React from 'react';
import { useChannel } from 'storybook/manager-api';

import { EVENTS } from '../constants';
import type { FluentInspectorNode, FluentInspectorSnapshot } from '../types';

const emptySnapshot: FluentInspectorSnapshot = { roots: [] };

export function FluentInspectorPanel() {
  const [snapshot, setSnapshot] = React.useState<FluentInspectorSnapshot>(emptySnapshot);
  const [selectedId, setSelectedId] = React.useState<string>();

  const emit = useChannel({
    [EVENTS.TREE]: (nextSnapshot: FluentInspectorSnapshot) => {
      setSnapshot(nextSnapshot);
    },
  });

  const selectedNode = React.useMemo(
    () => (selectedId ? findNode(snapshot.roots, selectedId) : undefined),
    [selectedId, snapshot]
  );

  React.useEffect(() => {
    if (selectedId && !selectedNode) {
      setSelectedId(undefined);
      emit(EVENTS.SELECT, undefined);
    }
  }, [emit, selectedId, selectedNode]);

  const selectNode = (node: FluentInspectorNode) => {
    setSelectedId(node.id);
    emit(EVENTS.SELECT, node.id);
  };

  return (
    <div style={styles.panel}>
      <section style={styles.treePane}>
        <div style={styles.header}>
          <strong>Fluent tree</strong>
          <button style={styles.refreshButton} onClick={() => emit(EVENTS.REFRESH)} type="button">
            Refresh
          </button>
        </div>

        {snapshot.roots.length === 0 ? (
          <p style={styles.empty}>No registered Fluent components found in the rendered story.</p>
        ) : (
          <div role="tree" aria-label="Fluent component tree">
            {snapshot.roots.map(node => (
              <TreeNode
                key={node.id}
                node={node}
                depth={0}
                selectedId={selectedId}
                onSelect={selectNode}
              />
            ))}
          </div>
        )}
      </section>

      <section style={styles.propsPane}>
        <strong>{selectedNode ? selectedNode.name : 'Runtime props'}</strong>
        {!selectedNode ? (
          <p style={styles.empty}>Select a Fluent component to inspect its current props.</p>
        ) : Object.keys(selectedNode.props).length === 0 ? (
          <p style={styles.empty}>No non-children props on this instance.</p>
        ) : (
          <table style={styles.table}>
            <tbody>
              {Object.entries(selectedNode.props).map(([name, value]) => (
                <tr key={name}>
                  <th style={styles.propName}>{name}</th>
                  <td style={styles.propValue}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function TreeNode({
  node,
  depth,
  selectedId,
  onSelect,
}: {
  node: FluentInspectorNode;
  depth: number;
  selectedId?: string;
  onSelect: (node: FluentInspectorNode) => void;
}) {
  const selected = node.id === selectedId;

  return (
    <>
      <button
        type="button"
        role="treeitem"
        aria-selected={selected}
        onClick={() => onSelect(node)}
        style={{
          ...styles.treeRow,
          paddingLeft: 8 + depth * 16,
          background: selected ? 'rgba(15, 108, 189, 0.12)' : 'transparent',
          fontWeight: selected ? 600 : 400,
        }}
      >
        {node.name}
      </button>
      {node.children.map(child => (
        <TreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

function findNode(nodes: FluentInspectorNode[], id: string): FluentInspectorNode | undefined {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }

    const child = findNode(node.children, id);
    if (child) {
      return child;
    }
  }

  return undefined;
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    display: 'grid',
    gridTemplateColumns: 'minmax(220px, 0.8fr) minmax(280px, 1.2fr)',
    height: '100%',
    minHeight: 220,
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    fontSize: 13,
  },
  treePane: {
    overflow: 'auto',
    padding: 12,
    borderRight: '1px solid rgba(0, 0, 0, 0.12)',
  },
  propsPane: {
    overflow: 'auto',
    padding: 12,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  refreshButton: {
    border: '1px solid rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    padding: '3px 8px',
    background: 'transparent',
    cursor: 'pointer',
    font: 'inherit',
  },
  empty: {
    margin: '10px 0',
    opacity: 0.65,
  },
  treeRow: {
    display: 'block',
    width: '100%',
    border: 0,
    borderRadius: 3,
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: 'left',
    cursor: 'pointer',
    font: 'inherit',
  },
  table: {
    width: '100%',
    marginTop: 8,
    borderCollapse: 'collapse',
  },
  propName: {
    width: '35%',
    padding: '5px 10px 5px 0',
    verticalAlign: 'top',
    textAlign: 'left',
    fontWeight: 600,
  },
  propValue: {
    padding: '5px 0',
    verticalAlign: 'top',
    fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
    overflowWrap: 'anywhere',
  },
};

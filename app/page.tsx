"use client";

import { useState, useCallback, useMemo } from 'react';
import { 
  ReactFlow, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge,
  OnNodesChange, 
  OnEdgesChange, 
  OnConnect,
  NodeChange,
  EdgeChange,
  Connection,
  Edge,
  ReactFlowProvider
} from '@xyflow/react';
import { nodeTypes, AppNode, FunnelNodeData } from '@/components/nodes';
import { NodePropertiesSheet } from '@/components/node-properties-sheet';
import '@xyflow/react/dist/style.css';
 
const initialNodes: AppNode[] = [
  { 
    id: '1', 
    type: 'trafficSource', 
    position: { x: 100, y: 100 }, 
    data: { 
      label: 'Facebook Ads', 
      enabled: true,
      conversao: 0,
      numeroMedioEsperado: 0
    } 
  },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
 
export default function App() {
  const [nodes, setNodes] = useState<AppNode[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  
  // Estado para controlar qual nó está sendo editado no Sheet
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  // Memo para encontrar o nó atual que está sendo editado
  const editingNode = useMemo(() => 
    nodes.find(n => n.id === editingNodeId) || null,
    [nodes, editingNodeId]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) => 
      setNodes((nds) => applyNodeChanges(changes, nds) as AppNode[]),
    [],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange[]) => 
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect: OnConnect = useCallback(
    (params: Connection) => 
      setEdges((eds) => addEdge(params, eds)),
    [],
  );

  // Função para atualizar os dados do nó vindo do Sheet
  const handleUpdateNodeData = useCallback((id: string, newData: Partial<FunnelNodeData>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
  }, []);
 
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          // Abre o Sheet ao clicar no nó
          onNodeClick={(_, node) => setEditingNodeId(node.id)}
          fitView
        />

        {/* Componente Dinâmico de Propriedades */}
        <NodePropertiesSheet 
          node={editingNode}
          onClose={() => setEditingNodeId(null)}
          onUpdate={handleUpdateNodeData}
        />
      </ReactFlowProvider>
    </div>
  );
}
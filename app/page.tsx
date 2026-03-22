"use client";
import { useState, useCallback } from 'react';
import { 
  ReactFlow, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge,
  Node, 
  Edge, 
  OnNodesChange, 
  OnEdgesChange, 
  OnConnect,
  NodeChange,
  EdgeChange,
  Connection
} from '@xyflow/react';
import { nodeTypes } from '@/components/nodes'; // Importando o registro
import '@xyflow/react/dist/style.css';
 
// Definimos o tipo inicial para garantir que o array comece tipado
const initialNodes: Node[] = [
  { 
    id: '1', 
    type: 'trafficSource', // Usa o tipo que definimos
    position: { x: 100, y: 100 }, 
    data: { label: 'Facebook Ads', source: 'facebook' } 
  },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];
const initialEdges: Edge[] = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];
 
export default function App() {
  // Passamos os tipos Node e Edge para o useState
  const [nodes, setNodes] = useState<Node[]>( initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
 
  // Usamos o tipo OnNodesChange para o callback completo
  const onNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) => 
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  // Usamos o tipo OnEdgesChange para o callback completo
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange[]) => 
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  // Usamos o tipo OnConnect ou Connection para os parâmetros
  const onConnect: OnConnect = useCallback(
    (params: Connection) => 
      setEdges((eds) => addEdge(params, eds)),
    [],
  );
 
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
}
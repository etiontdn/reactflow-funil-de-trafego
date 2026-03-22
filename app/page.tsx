"use client";

import { useState, useCallback, useRef } from 'react';
import { 
  ReactFlow, 
  addEdge, 
  useNodesState, 
  useEdgesState, 
  useReactFlow, 
  ReactFlowProvider, 
  type Connection, 
  type Edge, 
} from '@xyflow/react';
import { nodeTypes, AppNode } from '@/components/nodes';
import { NodePropertiesSheet } from '@/components/node-properties-sheet';
import { AppSidebar } from '@/components/app-sidebar';
import '@xyflow/react/dist/style.css';

let id = 0;
const getId = () => `node_${id++}`;

function FunnelCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();

  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const editingNode = nodes.find(n => n.id === editingNodeId) || null;

  // FUNÇÃO PARA ADICIONAR NO CENTRO
  const onAddNode = useCallback((type: string) => {
    const position = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const newNode: AppNode = {
      id: getId(),
      type,
      position,
      data: { 
        label: type === 'trafficSource' ? 'Nova Origem' : 'Nova Página', 
        enabled: true, 
        conversao: 0, 
        numeroMedioEsperado: 0 
      },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [screenToFlowPosition, setNodes]);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: AppNode = {
        id: getId(),
        type,
        position,
        data: { 
          label: type === 'trafficSource' ? 'Nova Origem' : 'Nova Página', 
          enabled: true, 
          conversao: 0, 
          numeroMedioEsperado: 0 
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  return (
    <div className="w-full h-screen" ref={reactFlowWrapper}>
      {/* Passamos a função para a Sidebar */}
      <AppSidebar onAddNode={onAddNode} />
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={(_, node) => setEditingNodeId(node.id)}
        deleteKeyCode={["Delete", "Backspace"]}
        fitView
      />
      <NodePropertiesSheet 
        node={editingNode} 
        onClose={() => setEditingNodeId(null)} 
        onUpdate={(id, data) => setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, ...data } } : n))} 
      />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FunnelCanvas />
    </ReactFlowProvider>
  );
}
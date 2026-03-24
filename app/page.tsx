"use client";

import { useState, useCallback, useRef, useEffect } from "react"; // Adicionado useEffect
import {
    ReactFlow,
    addEdge,
    useNodesState,
    useEdgesState,
    useReactFlow,
    ReactFlowProvider,
    type Connection,
    type Edge,
} from "@xyflow/react";
import { nodeTypes, AppNode } from "@/components/nodes";
import { NodePropertiesSheet } from "@/components/node-properties-sheet";
import { AppSidebar } from "@/components/app-sidebar";
import { PlusSignIcon, ArrowUpDoubleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    SidebarTrigger,
    SidebarProvider,
    SidebarInset,
} from "@/components/ui/sidebar";
import "@xyflow/react/dist/style.css";

const STORAGE_KEY = "funnel-flow-persistence-v1";
const getId = () =>
    `node_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;

function FunnelCanvas() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { screenToFlowPosition, setViewport, getViewport } = useReactFlow();
    const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const editingNode = nodes.find((n) => n.id === editingNodeId) || null;

    useEffect(() => {
        const restoreFlow = () => {
            const savedData = localStorage.getItem(STORAGE_KEY);

            if (savedData) {
                try {
                    const {
                        nodes: savedNodes,
                        edges: savedEdges,
                        viewport,
                    } = JSON.parse(savedData);

                    if (savedNodes) setNodes(savedNodes);
                    if (savedEdges) setEdges(savedEdges);
                    if (viewport) setViewport(viewport);
                } catch (e) {
                    console.error("Erro ao restaurar dados salvos:", e);
                }
            } else {
                setNodes([
                    {
                        id: "first_node",
                        type: "trafficSource",
                        position: { x: 250, y: 50 },
                        data: {
                            label: "Google Ads",
                            enabled: true,
                            acessosEsperados: 1000,
                            taxaConversao: 3,
                            output: 30,
                        },
                    },
                ]);
            }
            setIsLoaded(true);
        };

        restoreFlow();
    }, [setNodes, setEdges, setViewport]);

    useEffect(() => {
        if (!isLoaded) return;

        const flow = {
            nodes,
            edges,
            viewport: getViewport(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(flow));
    }, [nodes, edges, getViewport, isLoaded]);

    const onAddNode = useCallback(
        (type: string) => {
            const position = screenToFlowPosition({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
            });

            const newNode: AppNode = {
                id: getId(),
                type,
                position,
                data: {
                    label: "",
                    enabled: true,
                    output: 0,
                },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes],
    );

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            const type = event.dataTransfer.getData("application/reactflow");
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
                    label: "",
                    enabled: true,
                    output: 0,
                },
            };
            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes],
    );

    // Evita renderizar o React Flow com estado vazio antes do load
    if (!isLoaded) {
        return <div className="w-full h-screen bg-background" />;
    }

    return (
        <SidebarProvider>
            <AppSidebar onAddNode={onAddNode} />

            <SidebarTrigger className="self-center" />
            <SidebarInset>
                <div className="w-full h-screen" ref={reactFlowWrapper}>
                    {nodes.length === 0 && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                            <div className="flex flex-col items-center gap-4 max-w-sm text-center animate-in fade-in zoom-in duration-500">
                                <div className="relative">
                                    {/* Círculo pulsante de fundo */}
                                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                                    <div className="relative bg-background border-2 border-dashed border-primary/50 rounded-full p-6 shadow-xl">
                                        <HugeiconsIcon
                                            icon={PlusSignIcon}
                                            className="size-10 text-primary"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 px-6">
                                    <h3 className="text-xl font-bold tracking-tight">
                                        Comece sua estratégia
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Arraste um elemento da lateral ou clique
                                        em um botão para dar o primeiro passo no
                                        seu funil.
                                    </p>
                                </div>
                                {/* Uma setinha visual apontando para a esquerda (opcional) */}
                                <div className="flex items-center gap-2 text-primary font-medium text-xs uppercase tracking-widest mt-4">
                                    <HugeiconsIcon
                                        icon={ArrowUpDoubleIcon}
                                        className="-rotate-90 size-4"
                                    />
                                    <span>Ver elementos</span>
                                </div>
                            </div>
                        </div>
                    )}
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
                        onUpdate={(id, data) =>
                            setNodes((nds) =>
                                nds.map((n) =>
                                    n.id === id
                                        ? { ...n, data: { ...n.data, ...data } }
                                        : n,
                                ),
                            )
                        }
                    />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default function App() {
    return (
        <ReactFlowProvider>
            <FunnelCanvas />
        </ReactFlowProvider>
    );
}

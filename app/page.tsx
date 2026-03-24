"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
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
import {
    SidebarTrigger,
    SidebarProvider,
    SidebarInset,
    useSidebar,
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import "@xyflow/react/dist/style.css";

const STORAGE_KEY = "funnel-flow-persistence-v1";
const getId = () =>
    `node_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;

function FunnelCanvas() {
    const { setOpen } = useSidebar();
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { screenToFlowPosition, getViewport } = useReactFlow();

    const initialData = useMemo(() => {
        if (typeof window === "undefined") return null;
        const saved = localStorage.getItem(STORAGE_KEY);
        try {
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    }, []);

    const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(
        initialData?.nodes || [],
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(
        initialData?.edges || [],
    );
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

    const editingNode = nodes.find((n) => n.id === editingNodeId) || null;

    useEffect(() => {
        const data = JSON.stringify({ nodes, edges, viewport: getViewport() });
        localStorage.setItem(STORAGE_KEY, data);
    }, [nodes, edges, getViewport]);

    const onAddNode = useCallback(
        (type: string) => {
            const position = screenToFlowPosition({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
            });
            setNodes((nds) =>
                nds.concat({
                    id: getId(),
                    type,
                    position,
                    data: { label: "", enabled: true, output: 0 },
                }),
            );
        },
        [screenToFlowPosition, setNodes],
    );

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            const type = event.dataTransfer.getData("application/reactflow");
            if (!type) return;
            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            setNodes((nds) =>
                nds.concat({
                    id: getId(),
                    type,
                    position,
                    data: { label: "", enabled: true, output: 0 },
                }),
            );
        },
        [screenToFlowPosition, setNodes],
    );

    return (
        <>
            <AppSidebar onAddNode={onAddNode} />
            <SidebarInset className="relative flex flex-col">
                <header className="flex h-12 items-center border-b px-4 bg-background/50 backdrop-blur shrink-0 z-20">
                    <SidebarTrigger />
                    <div className="ml-4 h-4 w-px bg-border" />
                    <span className="ml-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                        Editor de Funil
                    </span>
                </header>

                <div className="flex-1 relative" ref={reactFlowWrapper}>
                    {nodes.length === 0 && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/40 backdrop-blur-[2px]">
                            <button
                                onClick={() => setOpen(true)}
                                className="group flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500"
                            >
                                <div className="relative bg-background border-2 border-dashed border-primary/40 rounded-full p-10 shadow-2xl group-hover:border-primary transition-all duration-300">
                                    <HugeiconsIcon
                                        icon={PlusSignIcon}
                                        className="size-12 text-primary group-hover:rotate-90 transition-transform duration-500"
                                    />
                                </div>
                                <div className="space-y-2 text-center">
                                    <h3 className="text-2xl font-black tracking-tight text-foreground">
                                        O canvas está vazio
                                    </h3>
                                    <p className="text-sm text-muted-foreground max-w-[240px]">
                                        Clique aqui para abrir os elementos e
                                        desenhar seu fluxo.
                                    </p>
                                </div>
                            </button>
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
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                        }}
                        onNodeClick={(_, node) => setEditingNodeId(node.id)}
                        defaultViewport={initialData?.viewport}
                        fitView={!initialData}
                        deleteKeyCode={["Delete", "Backspace"]}
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
        </>
    );
}

export default function App() {
    return (
        <SidebarProvider>
            <ReactFlowProvider>
                <FunnelCanvas />
            </ReactFlowProvider>
        </SidebarProvider>
    );
}

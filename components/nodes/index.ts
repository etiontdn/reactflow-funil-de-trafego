import { TrafficSourceNode } from "./traffic-source";
import type { Node, NodeTypes } from "@xyflow/react";

export const nodeTypes: NodeTypes = {
  trafficSource: TrafficSourceNode,
  // page: PageNode, ...
};

export type FunnelNodeData = {
  label: string;
  enabled: boolean;
};

export type AppNode = Node<FunnelNodeData>;
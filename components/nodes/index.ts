import { PageNode, PagePropertiesType, PageProperties } from "./page-node";
import { TrafficSourceNode, TrafficSourceProperties, TrafficSourcePropertiesType } from "./traffic-source";
import type { Node, NodeTypes } from "@xyflow/react";

// União de propriedades de todos os tipos de nós
export type FunnelNodeData = {
  label: string;
  enabled: boolean;
  output?: number;
} & Partial<TrafficSourcePropertiesType> & Partial<PagePropertiesType>; 
// Usamos Partial para que as propriedades específicas sejam opcionais na base global

export type AppNode = Node<FunnelNodeData>;

export interface NodePropertiesProps {
  data: FunnelNodeData;
  updateData: (newData: Partial<FunnelNodeData>) => void;
}

export const nodeTypes: NodeTypes = {
  trafficSource: TrafficSourceNode,
  page: PageNode,
};

export const nodePropertiesComponents: Record<string, React.ComponentType<NodePropertiesProps>> = {
  trafficSource: TrafficSourceProperties,
  page: PageProperties,
};
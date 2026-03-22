import { TrafficSourceNode, TrafficSourceProperties, TrafficSourcePropertiesType } from "./traffic-source";
import type { Node, NodeTypes } from "@xyflow/react";

// União de propriedades de todos os tipos de nós
// Conforme você criar novos nós (ex: PagePropertiesType), adicione aqui com "&" ou "|"
export type FunnelNodeData = {
  label: string;
  enabled: boolean;
} & Partial<TrafficSourcePropertiesType>; 
// Usamos Partial para que as propriedades específicas sejam opcionais na base global

export type AppNode = Node<FunnelNodeData>;

export interface NodePropertiesProps {
  data: FunnelNodeData;
  updateData: (newData: Partial<FunnelNodeData>) => void;
}

export const nodeTypes: NodeTypes = {
  trafficSource: TrafficSourceNode,
};

export const nodePropertiesComponents: Record<string, React.ComponentType<NodePropertiesProps>> = {
  trafficSource: TrafficSourceProperties,
};
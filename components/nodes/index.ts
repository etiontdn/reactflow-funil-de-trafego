import { TrafficSourceNode, TrafficSourceProperties, TrafficSourcePropertiesType } from "./traffic-source";
import { PageNode, PageProperties, PagePropertiesType } from "./page-node";
import { FormNode, FormProperties, FormPropertiesType } from "./form-node";
import { CheckoutNode, CheckoutProperties, CheckoutPropertiesType } from "./checkout-node";
import type { Node, NodeTypes } from "@xyflow/react";

export type FunnelNodeData = {
  label: string;
  enabled: boolean;
  output?: number;
} & Partial<TrafficSourcePropertiesType> 
  & Partial<PagePropertiesType>
  & Partial<FormPropertiesType>
  & Partial<CheckoutPropertiesType>;

export type AppNode = Node<FunnelNodeData>;

export interface NodePropertiesProps {
  data: FunnelNodeData;
  updateData: (newData: Partial<FunnelNodeData>) => void;
}

export const nodeTypes: NodeTypes = {
  trafficSource: TrafficSourceNode,
  page: PageNode,
  form: FormNode,
  checkout: CheckoutNode,
};

export const nodePropertiesComponents: Record<string, React.ComponentType<NodePropertiesProps>> = {
  trafficSource: TrafficSourceProperties,
  page: PageProperties,
  form: FormProperties,
  checkout: CheckoutProperties,
};
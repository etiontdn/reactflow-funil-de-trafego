import { TrafficSourceNode, TrafficSourceProperties, TrafficSourcePropertiesType } from "./traffic-source";
import { PageNode, PageProperties, PagePropertiesType } from "./page-node";
import { FormNode, FormProperties, FormPropertiesType } from "./form-node";
import { CheckoutNode, CheckoutProperties, CheckoutPropertiesType } from "./checkout-node";
import { SumNode } from "./sum-node";
import type { Node, NodeTypes } from "@xyflow/react";

// Contrato base para todos os nós do funil
export type FunnelNodeData = {
  label: string;
  enabled: boolean;
  output?: number; // Valor numérico ou monetário passado adiante
} & Partial<TrafficSourcePropertiesType> 
  & Partial<PagePropertiesType>
  & Partial<FormPropertiesType>
  & Partial<CheckoutPropertiesType>;

export type AppNode = Node<FunnelNodeData>;

export interface NodePropertiesProps {
  data: FunnelNodeData;
  updateData: (newData: Partial<FunnelNodeData>) => void;
}

// Registro dos componentes visuais que aparecem no Canvas
export const nodeTypes: NodeTypes = {
  trafficSource: TrafficSourceNode,
  page: PageNode,
  form: FormNode,
  checkout: CheckoutNode,
  sum: SumNode,
};

// Registro dos componentes de formulário que aparecem no Sheet lateral
export const nodePropertiesComponents: Record<string, React.ComponentType<NodePropertiesProps>> = {
  trafficSource: TrafficSourceProperties,
  page: PageProperties,
  form: FormProperties,
  checkout: CheckoutProperties,
  sum: () => null, // Nó utilitário não possui propriedades específicas
};
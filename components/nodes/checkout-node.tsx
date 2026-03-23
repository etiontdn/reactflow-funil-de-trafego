import { 
  Handle, 
  Position, 
  type NodeProps, 
  useNodeConnections, 
  useNodesData, 
  useReactFlow 
} from "@xyflow/react";
import { Money01Icon } from "@hugeicons/core-free-icons";
import { BaseNode } from "./base-node";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NodePropertiesProps, AppNode } from "./index";
import { useEffect } from "react";

export type CheckoutPropertiesType = { 
  taxaConversao: number;
  ticketMedio: number;
};

export function CheckoutNode(props: NodeProps) {
  const { data, id } = props;
  const { taxaConversao = 0, ticketMedio = 0 } = data as CheckoutPropertiesType;
  const { updateNodeData } = useReactFlow();
  
  const label = data.label === "" ? "Novo Checkout" : data.label;

  const allConnections = useNodeConnections();
  const targetConnections = allConnections.filter(conn => conn.target === id);

  const nodesData = useNodesData<AppNode>(
    targetConnections.map((conn) => conn.source)
  );

  const entradaTotal = nodesData.reduce((acc, sourceNode) => {
    if (!sourceNode || sourceNode.data.enabled === false) return acc;
    return acc + (sourceNode.data.output || 0);
  }, 0);

  const vendasRealizadas = Math.round(entradaTotal * (taxaConversao / 100));
  const faturamentoTotal = vendasRealizadas * ticketMedio;

  useEffect(() => {
    if (data.output !== faturamentoTotal) {
      updateNodeData(id, { output: faturamentoTotal });
    }
  }, [faturamentoTotal, id, data.output, updateNodeData]);

  return (
    <BaseNode {...props} data={{ ...props.data, label }} icon={Money01Icon} title="Checkout">
      <div className="flex flex-col gap-1 mt-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[9px] text-muted-foreground font-bold uppercase whitespace-nowrap">
            Checkins
          </span>
          <span className="text-xs font-mono font-bold">
            {entradaTotal.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center justify-between gap-4 border-t border-green-500/20 pt-1">
          <span className="text-[9px] text-green-600 font-bold uppercase">
            Faturamento
          </span>
          <span className="text-xs font-mono font-bold text-green-600">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(faturamentoTotal)}
          </span>
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="bg-primary!" />
      {/* Checkout geralmente é o fim, mas deixamos um source caso queira conectar a um pós-venda */}
      <Handle type="source" position={Position.Bottom} className="bg-green-600!" />
    </BaseNode>
  );
}

export function CheckoutProperties({ data, updateData }: NodePropertiesProps) {
  const { taxaConversao = 0, ticketMedio = 0 } = data as CheckoutPropertiesType;

  return (
    <div className="space-y-4 p-4">
      <div className="grid gap-2">
        <Label className="text-green-600 text-xs font-bold uppercase">
          Taxa de Conversão de Venda (%)
        </Label>
        <Input 
          type="number" 
          value={taxaConversao} 
          onChange={(e) => updateData({ taxaConversao: Number(e.target.value) })} 
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-green-600 text-xs font-bold uppercase">
          Ticket Médio (R$)
        </Label>
        <Input 
          type="number" 
          value={ticketMedio} 
          onChange={(e) => updateData({ ticketMedio: Number(e.target.value) })} 
        />
      </div>
    </div>
  );
}
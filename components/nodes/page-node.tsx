import { 
  Handle, 
  Position, 
  type NodeProps, 
  useNodeConnections, 
  useNodesData, 
  useReactFlow 
} from "@xyflow/react";
import { BrowserIcon } from "@hugeicons/core-free-icons";
import { BaseNode } from "./base-node";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NodePropertiesProps, AppNode } from "./index";
import { useEffect } from "react";

export type PagePropertiesType = { taxaConversao: number };

export function PageNode(props: NodeProps) {
  const { data, id } = props;
  const { taxaConversao = 0 } = data as PagePropertiesType;
  const { updateNodeData } = useReactFlow();
  
  const label = data.label === "" ? "Nova Página" : data.label;

  const allConnections = useNodeConnections();
  const targetConnections = allConnections.filter(conn => conn.target === id);

  const nodesData = useNodesData<AppNode>(
    targetConnections.map((conn) => conn.source)
  );

  const entradaTotal = nodesData.reduce((acc, sourceNode) => {
    if (!sourceNode || sourceNode.data.enabled === false) return acc;
    return acc + (sourceNode.data.output || 0);
  }, 0);

  const saidaCalculada = Math.round(entradaTotal * (taxaConversao / 100));

  useEffect(() => {
    if (data.output !== saidaCalculada) {
      updateNodeData(id, { output: saidaCalculada });
    }
  }, [saidaCalculada, id, data.output, updateNodeData]);

  return (
    <BaseNode {...props} data={{ ...props.data, label }} icon={BrowserIcon} title="Página">
      <div className="flex flex-col gap-1 mt-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[9px] text-muted-foreground font-bold uppercase whitespace-nowrap">
            Entrada
          </span>
          <span className="text-xs font-mono font-bold">
            {entradaTotal.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-border/40 pt-1">
          <span className="text-[9px] text-primary/80 font-bold uppercase">
            Saída
          </span>
          <span className="text-xs font-mono font-bold text-primary">
            {saidaCalculada.toLocaleString()}
          </span>
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="bg-primary!" />
      <Handle type="source" position={Position.Bottom} className="bg-primary!" />
    </BaseNode>
  );
}

export function PageProperties({ data, updateData }: NodePropertiesProps) {
  const { taxaConversao = 0 } = data as PagePropertiesType;

  return (
    <div className="space-y-4 p-4">
      <div className="grid gap-2">
        <Label className="text-primary text-xs font-bold uppercase">
          Taxa de Conversão da Página (%)
        </Label>
        <Input 
          type="number" 
          value={taxaConversao} 
          onChange={(e) => updateData({ taxaConversao: Number(e.target.value) })} 
        />
      </div>
    </div>
  );
}
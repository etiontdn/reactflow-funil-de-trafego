import { 
  Handle, 
  Position, 
  type NodeProps, 
  useNodeConnections, 
  useNodesData, 
  useReactFlow 
} from "@xyflow/react";
import { Note01Icon } from "@hugeicons/core-free-icons";
import { BaseNode } from "./base-node";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NodePropertiesProps, AppNode } from "./index";
import { useEffect } from "react";

export type FormPropertiesType = { taxaConversao: number };

export function FormNode(props: NodeProps) {
  const { data, id } = props;
  const { taxaConversao = 0 } = data as FormPropertiesType;
  const { updateNodeData } = useReactFlow();
  
  const allConnections = useNodeConnections();

  const targetConnections = allConnections.filter(
    (conn) => conn.target === id
  );

  const nodesData = useNodesData<AppNode>(
    targetConnections.map((conn) => conn.source)
  );

  const entradaTotal = nodesData.reduce((acc, node) => {
    if (!node || node.data.enabled === false) return acc;
    return acc + (node.data.output || 0);
  }, 0);

  const leadsGerados = Math.round(entradaTotal * (taxaConversao / 100));

  useEffect(() => {
    if (data.output !== leadsGerados) {
      updateNodeData(id, { output: leadsGerados });
    }
  }, [leadsGerados, id, data.output, updateNodeData]);

  return (
    <BaseNode {...props} icon={Note01Icon} title="Formulário">
      <div className="flex flex-col gap-1 mt-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[9px] text-muted-foreground font-bold uppercase whitespace-nowrap">
            Visitantes
          </span>
          <span className="text-xs font-mono font-bold">
            {entradaTotal.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center justify-between gap-4 border-t border-purple-500/20 pt-1">
          <span className="text-[9px] text-purple-600 font-bold uppercase">
            Leads
          </span>
          <span className="text-xs font-mono font-bold text-purple-600">
            {leadsGerados.toLocaleString()}
          </span>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="bg-primary!" />
      <Handle type="source" position={Position.Bottom} className="bg-purple-600!" />
    </BaseNode>
  );
}

export function FormProperties({ data, updateData }: NodePropertiesProps) {
  const { taxaConversao = 0 } = data as FormPropertiesType;

  return (
    <div className="space-y-4 p-4">
      <div className="grid gap-2">
        <Label className="text-purple-600 text-xs font-bold uppercase">
          Taxa de Preenchimento (%)
        </Label>
        <Input 
          type="number"
          min={0}
          max={100}
          value={taxaConversao} 
          onChange={(e) => updateData({ taxaConversao: Math.max(0, Math.min(100, Number(e.target.value))) })}
        />
      </div>
      <div className="">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Define a porcentagem de visitantes que preenchem seus dados 
          e se tornam contatos (leads) na sua base.
        </p>
      </div>  
    </div>
  );
}
import { 
  Handle, 
  Position, 
  type NodeProps, 
  useNodeConnections, 
  useNodesData, 
  useReactFlow 
} from "@xyflow/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { BaseNode } from "./base-node";
import { AppNode } from "./index";
import { useEffect } from "react";

export function SumNode(props: NodeProps) {
  const { data, id } = props;
  const { updateNodeData } = useReactFlow();
  
  const label = data.label === "" ? "Soma de Fluxo" : data.label;

  const allConnections = useNodeConnections();
  const targetConnections = allConnections.filter(conn => conn.target === id);

  const nodesData = useNodesData<AppNode>(
    targetConnections.map((conn) => conn.source)
  );

  const entradaTotal = nodesData.reduce((acc, sourceNode) => {
    if (!sourceNode || sourceNode.data.enabled === false) return acc;
    return acc + (sourceNode.data.output || 0);
  }, 0);

  useEffect(() => {
    if (data.output !== entradaTotal) {
      updateNodeData(id, { output: entradaTotal });
    }
  }, [entradaTotal, id, data.output, updateNodeData]);

  return (
    <BaseNode {...props} data={{ ...props.data, label }} icon={PlusSignIcon} title="Agrupador">
      <div className="flex flex-col gap-1 mt-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[9px] text-muted-foreground font-bold uppercase whitespace-nowrap">
            Total Consolidado
          </span>
          <span className="text-sm font-mono font-bold text-primary">
            {entradaTotal.toLocaleString()}
          </span>
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="bg-primary!" />
      <Handle type="source" position={Position.Bottom} className="bg-primary!" />
    </BaseNode>
  );
}
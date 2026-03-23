import { 
  Handle, 
  Position, 
  type NodeProps, 
  useNodeConnections, 
  useNodesData, 
  useReactFlow 
} from "@xyflow/react";
import { ArrowUpDoubleIcon } from "@hugeicons/core-free-icons";
import { BaseNode } from "./base-node";
import { AppNode } from "./index";
import { useEffect } from "react";

export function MaxNode(props: NodeProps) {
  const { data, id } = props;
  const { updateNodeData } = useReactFlow();
  
  const label = data.label === "" ? "Melhor Performance" : data.label;

  const allConnections = useNodeConnections();
  const targetConnections = allConnections.filter(conn => conn.target === id);

  const nodesData = useNodesData<AppNode>(
    targetConnections.map((conn) => conn.source)
  );

  // Filtra apenas nós habilitados e extrai os outputs
  const outputs = nodesData
    .filter(node => node && node.data.enabled !== false)
    .map(node => node.data.output || 0);

  // Seleciona o maior valor entre as entradas
  const valorMaximo = outputs.length > 0 ? Math.max(...outputs) : 0;

  useEffect(() => {
    if (data.output !== valorMaximo) {
      updateNodeData(id, { output: valorMaximo });
    }
  }, [valorMaximo, id, data.output, updateNodeData]);

  return (
    <BaseNode {...props} data={{ ...props.data, label }} icon={ArrowUpDoubleIcon} title="Máximo">
      <div className="flex flex-col gap-1 mt-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[9px] text-muted-foreground font-bold uppercase whitespace-nowrap">
            Maior Entrada
          </span>
          <span className="text-xs font-mono font-bold text-primary">
            {valorMaximo.toLocaleString()}
          </span>
        </div>
        <p className="text-[8px] text-muted-foreground italic leading-tight">
          Seleciona o maior valor entre {outputs.length} conexões ativas.
        </p>
      </div>
      <Handle type="target" position={Position.Top} className="bg-primary!" />
      <Handle type="source" position={Position.Bottom} className="bg-primary!" />
    </BaseNode>
  );
}
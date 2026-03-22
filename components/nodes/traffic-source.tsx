import { Handle, Position, type NodeProps } from "@xyflow/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Megaphone01Icon } from "@hugeicons/core-free-icons";
import { BaseNode } from "./base-node";

export function TrafficSourceNode(props: NodeProps) {
  return (
    <BaseNode {...props} title="Origem">
      <div className="rounded-lg p-2 bg-primary/10 flex items-center justify-center">
        <HugeiconsIcon icon={Megaphone01Icon} className="size-5 text-primary" />
      </div>
      
      <Handle type="source" position={Position.Bottom} className="bg-primary!" />
    </BaseNode>
  );
}
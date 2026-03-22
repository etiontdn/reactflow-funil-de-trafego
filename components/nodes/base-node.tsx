import { NodeToolbar, useReactFlow, Position, type NodeProps } from "@xyflow/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Delete02Icon, 
  Settings03Icon, 
  ViewIcon, 
  ViewOffSlashIcon 
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { FunnelNodeData } from "./index";

interface BaseNodeProps extends NodeProps {
  children: React.ReactNode;
  title: string;
}

export function BaseNode({ id, selected, data, children, title }: BaseNodeProps) {
  const { deleteElements, setNodes } = useReactFlow();
  const { enabled = true, label } = data as FunnelNodeData;

  const toggleEnabled = () => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, enabled: !enabled } };
        }
        return node;
      })
    );
  };

  return (
    <>
      <NodeToolbar 
        isVisible={selected} 
        position={Position.Top} 
        className="flex gap-1.5 bg-background border shadow-md p-1 rounded-md"
      >
        {/* Tooltip Ativar/Desativar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon-xs" 
              onClick={toggleEnabled}
              className={cn(!enabled && "text-muted-foreground")}
            >
              <HugeiconsIcon 
                icon={enabled ? ViewIcon : ViewOffSlashIcon} 
                className="size-4" 
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{enabled ? 'Desativar nó' : 'Ativar nó'}</p>
          </TooltipContent>
        </Tooltip>

        {/* Tooltip Configurações */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon-xs">
              <HugeiconsIcon icon={Settings03Icon} className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Propriedades</p>
          </TooltipContent>
        </Tooltip>

        {/* Tooltip Deletar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="destructive" 
              size="icon-xs" 
              onClick={() => deleteElements({ nodes: [{ id }] })}
            >
              <HugeiconsIcon icon={Delete02Icon} className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Remover nó</p>
          </TooltipContent>
        </Tooltip>
      </NodeToolbar>

      <div className={cn(
        "px-4 py-3 shadow-lg rounded-xl bg-card border transition-all min-w-45",
        selected ? "border-primary ring-1 ring-primary/20" : "border-border",
        !enabled && "opacity-50 grayscale contrast-75 border-dashed shadow-none"
      )}>
        <div className="flex items-center gap-3">
          {children}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              {title}
            </span>
            <span className="text-sm font-semibold truncate max-w-50">
              {label}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
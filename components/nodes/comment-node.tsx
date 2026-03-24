import { type NodeProps } from "@xyflow/react";
import { Comment01Icon } from "@hugeicons/core-free-icons";
import { BaseNode } from "./base-node";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NodePropertiesProps } from "./index";

export type CommentPropertiesType = {
  text: string;
};

export function CommentNode(props: NodeProps) {
  const { data } = props;
  const { text = "" } = data as CommentPropertiesType;

  return (
    <BaseNode 
      {...props} 
      icon={Comment01Icon} 
      title="Anotação" 
      className="shadow-sm min-h-20"
    >
      <div className="mt-2">
        <p className="text-[11px] text-muted-foreground italic leading-relaxed whitespace-pre-wrap max-w-40">
          {text || "Clique para escrever uma nota..."}
        </p>
      </div>
    </BaseNode>
  );
}

export function CommentProperties({ data, updateData }: NodePropertiesProps) {
  const { text = "" } = data as CommentPropertiesType;

  return (
    <div className="space-y-4 p-4">
      <div className="grid gap-2">
        <Label className="text-yellow-700 text-xs font-bold uppercase">
          Conteúdo da Nota
        </Label>
        <Textarea 
          placeholder="Ex: Esta etapa é experimental..."
          value={text} 
          rows={5}
          className="resize-none border-yellow-200 focus-visible:ring-yellow-500"
          onChange={(e) => updateData({ text: e.target.value })} 
        />
      </div>
    </div>
  );
}
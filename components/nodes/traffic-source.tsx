import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BaseNode } from "./base-node";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Megaphone01Icon } from "@hugeicons/core-free-icons";
import { NodePropertiesProps } from "./index";

// O tipo específico que você pediu
export type TrafficSourcePropertiesType = {
    acessosEsperados: number;
    taxaConversao: number;
    output: number;
};

// Componente visual do nó
export function TrafficSourceNode(props: NodeProps) {
    const label = props.data.label === "" ? "Nova Origem" : props.data.label;
    const enabled = props.data.enabled;

    const { acessosEsperados = 0 } = props.data as TrafficSourcePropertiesType;

    return (
        <BaseNode
            {...props}
            data={{ label, enabled }}
            icon={Megaphone01Icon}
            title="Origem"
        >
            {acessosEsperados > 0 && (
                <div className="flex flex-col justify-center">
                    <span className="text-[9px] text-muted-foreground font-bold uppercase">
                        Volume Esperado
                    </span>
                    <span className="text-sm font-semibold truncate max-w-50">
                        {acessosEsperados.toLocaleString()}
                    </span>
                </div>
            )}

            <Handle
                type="source"
                position={Position.Bottom}
                className="bg-primary!"
            />
        </BaseNode>
    );
}
export function TrafficSourceProperties({ data, updateData }: NodePropertiesProps) {
  const { acessosEsperados = 0, taxaConversao = 0 } = data as TrafficSourcePropertiesType;

  // Atualiza o output sempre que os valores mudarem
  const handleChange = (fields: Partial<TrafficSourcePropertiesType>) => {
    const rawAcessos = fields.acessosEsperados ?? acessosEsperados;
    const rawTaxa = fields.taxaConversao ?? taxaConversao;

    const validatedAcessos = Math.max(0, rawAcessos);
    const validatedTaxa = Math.max(0, Math.min(100, rawTaxa));

    const newOutput = Math.round(validatedAcessos * (validatedTaxa / 100));

    updateData({
      ...fields,
      acessosEsperados: validatedAcessos,
      taxaConversao: validatedTaxa,
      output: newOutput
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
        <div className="grid gap-2">
          <Label htmlFor="acessos">Acessos Totais</Label>
          <Input 
            id="acessos" 
            type="number" 
            value={acessosEsperados} 
            onChange={(e) => handleChange({ acessosEsperados: Number(e.target.value) })} 
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="taxa">Taxa de Conversão (%)</Label>
          <Input 
            id="taxa" 
            type="number" 
            value={taxaConversao} 
            onChange={(e) => handleChange({ taxaConversao: Number(e.target.value) })} 
          />
        </div>
      </div>
    </div>
  );
}
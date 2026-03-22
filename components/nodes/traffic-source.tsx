import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BaseNode } from "./base-node";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Megaphone01Icon } from "@hugeicons/core-free-icons";
import { NodePropertiesProps } from "./index";

// O tipo específico que você pediu
export type TrafficSourcePropertiesType = {
    conversao: number;
    numeroMedioEsperado: number;
};

// Componente visual do nó
export function TrafficSourceNode(props: NodeProps) {
    return (
        <BaseNode {...props} title="Origem">
            <div className="rounded-lg p-2 bg-primary/10 flex items-center justify-center">
                <HugeiconsIcon
                    icon={Megaphone01Icon}
                    className="size-5 text-primary"
                />
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                className="bg-primary!"
            />
        </BaseNode>
    );
}

// Componente de edição tipado
export function TrafficSourceProperties({
    data,
    updateData,
}: NodePropertiesProps) {
    // Fazemos um type cast seguro aqui para usar as propriedades sugeridas
    const props = data as TrafficSourcePropertiesType;

    return (
        <div className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="conv">Taxa de Conversão (%)</Label>
                <Input
                    id="conv"
                    type="number"
                    value={props.conversao ?? 0}
                    onChange={(e) =>
                        updateData({ conversao: Number(e.target.value) })
                    }
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="media">Número Médio Esperado</Label>
                <Input
                    id="media"
                    type="number"
                    placeholder="Ex: 1000"
                    value={props.numeroMedioEsperado ?? 0}
                    onChange={(e) =>
                        updateData({
                            numeroMedioEsperado: Number(e.target.value),
                        })
                    }
                />
            </div>
        </div>
    );
}

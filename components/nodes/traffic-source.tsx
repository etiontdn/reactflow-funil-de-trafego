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

export function TrafficSourceProperties({
    data,
    updateData,
}: NodePropertiesProps) {
    const { acessosEsperados = 0, taxaConversao = 0 } =
        data as TrafficSourcePropertiesType;

    // Cálculo para feedback visual no formulário
    const resultadoFinal = Math.round(
        (acessosEsperados || 0) * ((taxaConversao || 0) / 100),
    );

    return (
        <div className="space-y-6">
            <div className="grid gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
                <div className="grid gap-2">
                    <Label htmlFor="acessos" className="text-primary">
                        Acessos Totais Esperados
                    </Label>
                    <Input
                        id="acessos"
                        type="number"
                        placeholder="Ex: 10000"
                        value={acessosEsperados}
                        onChange={(e) =>
                            updateData({
                                acessosEsperados: Number(e.target.value),
                            })
                        }
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="taxa" className="text-primary">
                        Taxa de Clique / Conversão (%)
                    </Label>
                    <div className="relative">
                        <Input
                            id="taxa"
                            type="number"
                            className="pr-8"
                            value={taxaConversao}
                            onChange={(e) => {
                                const n = Math.max(
                                    0,
                                    Math.min(100, Number(e.target.value)),
                                );
                                updateData({
                                    taxaConversao: n,
                                });
                            }}
                            min={0}
                            max={100}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                            %
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between px-2 py-1">
                <span className="text-xs text-muted-foreground italic font-medium">
                    Resultado enviado à próxima etapa:
                </span>
                <span className="text-sm font-mono font-bold text-primary">
                    {resultadoFinal.toLocaleString()} usuários
                </span>
            </div>

            <div className="p-3 rounded-md bg-muted text-[11px] text-muted-foreground leading-relaxed">
                <strong>Como funciona:</strong> Este nó injeta o volume inicial
                no funil. A próxima etapa (Página) receberá este número de
                usuários como tráfego de entrada.
            </div>
        </div>
    );
}

"use client"

import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { nodePropertiesComponents, AppNode, FunnelNodeData } from "./nodes"

interface NodePropertiesSheetProps {
  node: AppNode | null
  onClose: () => void
  onUpdate: (id: string, newData: Partial<FunnelNodeData>) => void
}

export function NodePropertiesSheet({ node, onClose, onUpdate }: NodePropertiesSheetProps) {
  if (!node) return null

  // Identifica dinamicamente qual componente de formulário usar
  const PropertiesComponent = nodePropertiesComponents[node.type as string]

  return (
    <Sheet open={!!node} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-87.5 sm:w-100">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">Propriedades</SheetTitle>
          <SheetDescription>
            Ajuste as configurações do nó <span className="font-bold text-foreground">{node.data.label}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* --- Propriedades Comuns (Sempre aparecem) --- */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="base-label">Nome da Etapa</Label>
              <Input 
                id="base-label"
                value={node.data.label} 
                onChange={(e) => onUpdate(node.id, { label: e.target.value })}
              />
            </div>
          </div>

          <Separator />

          {/* --- Propriedades Dinâmicas (Injetadas pelo Nó) --- */}
          <div className="animate-in fade-in slide-in-from-right-2 duration-300">
            {PropertiesComponent ? (
              <PropertiesComponent 
                data={node.data} 
                updateData={(newData) => onUpdate(node.id, newData)} 
              />
            ) : (
              <div className="py-4 text-center border-2 border-dashed rounded-lg">
                <p className="text-xs text-muted-foreground italic">
                  Este tipo de nó ({node.type}) não possui <br /> propriedades específicas.
                </p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
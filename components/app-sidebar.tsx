"use client"

import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarHeader,
  SidebarFooter 
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Megaphone01Icon, 
  Note01Icon, 
  BrowserIcon, 
  PlusSignIcon, 
  ArrowUpDoubleIcon,
  Money01Icon,
  Comment01Icon,
  InformationCircleIcon,
  CursorPointer01Icon,
  Cursor01Icon,
  Delete02Icon // Importando o ícone de lixeira
} from "@hugeicons/core-free-icons";
import { ModeToggle } from "./mode-toggle";
import { Button } from "@/components/ui/button";

const availableNodes = [
  { type: 'trafficSource', label: 'Origem de Tráfego', icon: Megaphone01Icon },
  { type: 'page', label: 'Página/LP', icon: BrowserIcon },
  { type: 'form', label: 'Formulário', icon: Note01Icon },
  { type: 'checkout', label: 'Checkout', icon: Money01Icon },
  { type: 'sum', label: 'Agrupador', icon: PlusSignIcon },
  { type: 'max', label: 'Máximo', icon: ArrowUpDoubleIcon },
  { type: 'comment', label: 'Comentário', icon: Comment01Icon },
];

interface AppSidebarProps {
  onAddNode: (type: string) => void;
}

export function AppSidebar({ onAddNode }: AppSidebarProps) {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Função para limpar o storage e dar refresh na página
  const handleClearCanvas = () => {
    const confirmacao = confirm(
      "Tem certeza que deseja apagar todo o funil? Essa ação removerá todos os nós salvos permanentemente."
    );
    
    if (confirmacao) {
      localStorage.removeItem("funnel-flow-persistence-v1");
      window.location.reload();
    }
  };

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <h1 className="text-xl ml-2 mt-2 font-bold tracking-wide text-sidebar-foreground italic">
          FunnelFlow
        </h1>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase font-bold tracking-widest">
            Elementos do Funil
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {availableNodes.map((node) => (
                <SidebarMenuItem key={node.type}>
                  <SidebarMenuButton 
                    draggable 
                    onDragStart={(e) => onDragStart(e, node.type)}
                    onClick={() => onAddNode(node.type)}
                    className="cursor-grab active:cursor-grabbing h-9"
                  >
                    <HugeiconsIcon icon={node.icon} className="size-4" />
                    <span className="text-sm">{node.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto pb-4">
          <SidebarGroupLabel className="flex items-center gap-2 mb-2">
            <HugeiconsIcon icon={InformationCircleIcon} className="size-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider">Como usar</span>
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <div className="rounded-xl p-4 border bg-muted/40 shadow-sm border-primary/10">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 bg-primary/15 p-2 rounded-lg">
                    <HugeiconsIcon icon={CursorPointer01Icon} className="size-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-foreground">Ação Rápida</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Dê um <span className="font-bold text-primary">clique</span> no item para adicioná-lo ao centro.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="shrink-0 bg-primary/15 p-2 rounded-lg">
                    <HugeiconsIcon icon={Cursor01Icon} className="size-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-foreground">Posicionamento</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      <span className="font-bold text-primary">Arraste</span> o item para o local desejado no mapa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4 flex flex-col gap-3 bg-muted/20">
        {/* Botão de Limpar Canvas */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearCanvas}
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 gap-3 h-9 px-2"
        >
          <HugeiconsIcon icon={Delete02Icon} className="size-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Limpar Canvas</span>
        </Button>

        {/* Separador e Toggle de Tema */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Tema</span>
           <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
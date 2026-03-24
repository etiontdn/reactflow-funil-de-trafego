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
  SidebarFooter // Adicione este import
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Megaphone01Icon, 
  Note01Icon, 
  BrowserIcon, 
  PlusSignIcon, 
  ArrowUpDoubleIcon,
  Money01Icon,
  Comment01Icon 
} from "@hugeicons/core-free-icons";
import { ModeToggle } from "./mode-toggle"; // Importe o componente que criamos

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

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <h1 className="text-xl ml-2 mt-2 font-bold tracking-wide text-sidebar-foreground">
          Reactflow: Funil
        </h1>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Elementos do Funil</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {availableNodes.map((node) => (
                <SidebarMenuItem key={node.type}>
                  <SidebarMenuButton 
                    draggable 
                    onDragStart={(e) => onDragStart(e, node.type)}
                    onClick={() => onAddNode(node.type)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <HugeiconsIcon icon={node.icon} className="size-4" />
                    <span>{node.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Rodapé com o botão de tema */}
      <SidebarFooter className="border-t p-4 flex items-center justify-center">
        <ModeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
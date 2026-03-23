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
  SidebarHeader
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import { Megaphone01Icon, Note01Icon, BrowserIcon, Money01Icon, PlusSignIcon, ArrowUpDoubleIcon } from "@hugeicons/core-free-icons";

const availableNodes = [
  { type: 'trafficSource', label: 'Origem de Tráfego', icon: Megaphone01Icon },
  { type: 'page', label: 'Página/LP', icon: BrowserIcon },
  { type: 'form', label: 'Formulário', icon: Note01Icon },
  { type: 'checkout', label: 'Checkout/Venda', icon: Money01Icon },
  { type: 'sum', label: 'Agrupador', icon: PlusSignIcon },
  { type: 'max', label: 'Máximo', icon: ArrowUpDoubleIcon },
];

// Adicionamos a tipagem da prop
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
        <h1 className="text-xl ml-2 mt-2 font-bold tracking-wide text-sidebar-foreground">Reactflow: Funil de tráfego</h1>
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
    </Sidebar>
  );
}
"use client"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import { Megaphone01Icon, BrowserIcon } from "@hugeicons/core-free-icons";

const availableNodes = [
  { type: 'trafficSource', label: 'Origem de Tráfego', icon: Megaphone01Icon },
  { type: 'page', label: 'Página/LP', icon: BrowserIcon },
];

export function AppSidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Sidebar collapsible="icon">
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
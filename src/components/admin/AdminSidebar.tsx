import { Settings, Users, BarChart, Database, Palette, Globe, LogOut } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

const adminItems = [
  { title: "Dashboard", url: "/admin", icon: BarChart },
  { title: "Site Settings", url: "/admin/settings", icon: Settings },
  { title: "Design System", url: "/admin/design", icon: Palette },
  { title: "Waitlist Data", url: "/admin/waitlist", icon: Database },
  { title: "Admin Users", url: "/admin/users", icon: Users },
  { title: "Coming Soon Mode", url: "/admin/coming-soon", icon: Globe },
]

export function AdminSidebar() {
  const location = useLocation()
  const { signOut } = useAuth()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"

  const handleSignOut = () => {
    signOut()
  }

  return (
    <Sidebar className="w-60">
      <SidebarContent>
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">
            Fynda Admin
          </h2>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
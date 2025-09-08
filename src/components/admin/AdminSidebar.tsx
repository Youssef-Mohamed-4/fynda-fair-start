import { Settings, Users, BarChart, Database, Palette, Globe, LogOut, FileText, TrendingUp, UserCog } from "lucide-react"
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
  { title: "Analytics", url: "/admin/analytics", icon: TrendingUp },
  { title: "Waitlist Management", url: "/admin/waitlist", icon: Database },
  { title: "Content Management", url: "/admin/content", icon: FileText },
  { title: "Site Settings", url: "/admin/settings", icon: Settings },
  { title: "User Management", url: "/admin/users", icon: UserCog },
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
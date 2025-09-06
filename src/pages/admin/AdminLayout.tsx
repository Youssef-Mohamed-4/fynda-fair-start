import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

export default function AdminLayout() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        // Not logged in → send to login
        navigate("/login")
        return
      }

      // Check if this user is admin using your SQL function
      const { data, error } = await supabase.rpc("is_admin")

      if (error || !data) {
        // Not an admin → block access
        navigate("/")
        return
      }

      // Admin confirmed
      setChecking(false)
    }

    checkAdmin()
  }, [navigate])

  if (checking) {
    return <div className="p-6">Checking admin access...</div>
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <h1 className="ml-4 text-lg font-semibold">Admin Panel</h1>
          </header>
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

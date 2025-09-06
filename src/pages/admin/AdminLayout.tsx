import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from '@/hooks/use-toast' // assuming you already have this hook

export default function AdminLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: user } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: isAdmin, error } = await supabase.rpc("is_admin");

      if (error) {
        console.error("Admin check failed:", error.message);
        setLoading(false);
        return;
      }

      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You are not an admin and cannot access this page.",
          variant: "destructive",
        });
        navigate("/");
      } else {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-muted-foreground">Checking admin access...</p>
      </div>
    );
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

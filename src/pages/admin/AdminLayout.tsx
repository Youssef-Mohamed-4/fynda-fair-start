import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  // Debug logging for admin layout rendering
  console.log('🔐 AdminLayout: Rendering admin layout (authentication already handled by AdminProtected)');

  // Note: Authentication is now handled by AdminProtected component
  // No need for duplicate auth checks here

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
  );
}

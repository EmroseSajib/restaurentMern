import AdminSidebar from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

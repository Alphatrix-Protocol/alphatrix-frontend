import AuthGuard from "./_components/auth-guard";
import Sidebar from "./_components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen overflow-y-auto">{children}</main>
      </div>
    </AuthGuard>
  );
}

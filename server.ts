import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/account")({ component: AccountLayout });

function AccountLayout() {
  const { user } = useAuth();
  if (!user) return <div className="p-12 text-center"><p>Please <Link to="/auth" className="text-primary underline">sign in</Link>.</p></div>;
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 grid lg:grid-cols-[220px_1fr] gap-8">
      <aside className="space-y-1">
        <h2 className="font-display font-bold text-lg mb-4">My account</h2>
        <Link to="/account" className="block px-3 py-2 rounded-lg hover:bg-secondary text-sm font-medium">Profile</Link>
        <Link to="/account/orders" className="block px-3 py-2 rounded-lg hover:bg-secondary text-sm font-medium">Orders</Link>
      </aside>
      <div><Outlet /></div>
    </div>
  );
}

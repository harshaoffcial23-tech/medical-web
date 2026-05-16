import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({ component: AdminDashboard });

function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    enabled: isAdmin,
    queryFn: async () => {
      const [products, orders, users] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("total", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      const revenue = (orders.data ?? []).reduce((s, o) => s + Number(o.total), 0);
      return { products: products.count ?? 0, orders: orders.count ?? 0, users: users.count ?? 0, revenue };
    },
  });

  if (loading) return <div className="p-12 text-center">Loading…</div>;
  if (!user) return <div className="p-12 text-center"><Link to="/auth" className="text-primary underline">Sign in</Link> required.</div>;
  if (!isAdmin) return (
    <div className="p-12 text-center max-w-md mx-auto">
      <h1 className="font-display text-2xl font-bold">Admin access required</h1>
      <p className="text-muted-foreground mt-2 text-sm">Your account doesn't have admin privileges. To grant admin to your user, add a row to the <code>user_roles</code> table with role <code>admin</code> for your user_id.</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold mb-8">Admin dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Products", value: stats?.products ?? 0 },
          { label: "Orders", value: stats?.orders ?? 0 },
          { label: "Customers", value: stats?.users ?? 0 },
          { label: "Revenue", value: `₹${(stats?.revenue ?? 0).toFixed(0)}` },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted-foreground">Full product / order / user management coming next — ask me to build it out.</p>
    </div>
  );
}

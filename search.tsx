import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/account/orders")({ component: OrdersPage });

function OrdersPage() {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["orders", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false })).data ?? [],
  });
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">Orders</h1>
      {data?.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}
      {data?.map((o) => (
        <div key={o.id} className="glass-card p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">{o.order_number}</p>
              <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">₹{Number(o.total).toFixed(0)}</p>
              <span className="text-xs px-2 py-1 rounded-full bg-secondary capitalize">{o.status}</span>
            </div>
          </div>
          <ul className="mt-3 text-sm text-muted-foreground space-y-1">
            {(o.order_items as { id: string; product_name: string; quantity: number }[])?.map((it) => (
              <li key={it.id}>{it.quantity}× {it.product_name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

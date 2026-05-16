import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryIcon } from "@/components/category-icon";

export const Route = createFileRoute("/categories/")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data } = useQuery({
    queryKey: ["categories-all"],
    queryFn: async () => (await supabase.from("categories").select("*").order("display_order")).data ?? [],
  });
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold mb-8">Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {data?.map((c) => (
          <Link key={c.id} to="/categories/$slug" params={{ slug: c.slug }} className="group flex flex-col items-center gap-3 rounded-2xl glass-card p-6 hover-lift">
            <div className="grid size-14 place-items-center rounded-2xl gradient-primary text-primary-foreground">
              <CategoryIcon name={c.icon} className="size-6" />
            </div>
            <span className="text-sm font-semibold">{c.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

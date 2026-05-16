import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/categories/$slug")({
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = useParams({ from: "/categories/$slug" });
  const { data } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const cat = await supabase.from("categories").select("*").eq("slug", slug).single();
      if (!cat.data) return { category: null, products: [] };
      const prods = await supabase
        .from("products")
        .select("*, category:categories(name, slug)")
        .eq("category_id", cat.data.id);
      return { category: cat.data, products: prods.data ?? [] };
    },
  });
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold">{data?.category?.name ?? "Category"}</h1>
      <p className="text-muted-foreground mt-2">{data?.category?.description}</p>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {data?.products.map((p, i) => <ProductCard key={p.id} product={p as never} index={i} />)}
      </div>
    </div>
  );
}

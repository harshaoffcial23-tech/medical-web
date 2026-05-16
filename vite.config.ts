import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, ShieldCheck, Truck, Sparkles, Clock, ArrowRight, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { CategoryIcon } from "@/components/category-icon";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const [query, setQuery] = useState("");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("display_order");
      return data ?? [];
    },
  });

  const { data: featured } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*, category:categories(name, slug)")
        .eq("is_featured", true)
        .limit(8);
      return data ?? [];
    },
  });

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-80" />
        <div className="absolute top-20 right-10 size-80 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 size-72 rounded-full bg-mint/15 blur-3xl animate-pulse-soft" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-28 lg:pt-28 lg:pb-36">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 mb-6">
                <span className="size-2 rounded-full bg-mint animate-pulse" />
                <span className="text-xs font-semibold tracking-wider uppercase">AI-Powered Pharmacy</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-balance">
                Pharmacy essentials,<br />
                <span className="text-gradient">delivered with precision.</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg text-pretty">
                Verified medications, wellness products, and lab tests — all from licensed pharmacists.
                Express delivery, secure checkout, 24/7 support.
              </p>

              <form
                onSubmit={(e) => { e.preventDefault(); if (query.trim()) window.location.href = `/search?q=${encodeURIComponent(query)}`; }}
                className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="text"
                    placeholder="Search medicines, brands, conditions..."
                    className="w-full rounded-2xl bg-card py-4 pl-12 pr-4 text-sm ring-1 ring-border shadow-glass focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <Button type="submit" size="lg" className="rounded-2xl gradient-primary text-primary-foreground border-0 shadow-elevated">
                  Find medicine
                </Button>
              </form>

              <div className="mt-10 flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2"><ShieldCheck className="size-4 text-mint" /> Licensed pharmacy</div>
                <div className="flex items-center gap-2"><Truck className="size-4 text-mint" /> 2-hr delivery</div>
                <div className="flex items-center gap-2"><Sparkles className="size-4 text-mint" /> AI recommendations</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 rounded-[3rem] glass-card shadow-elevated overflow-hidden">
                  <div className="absolute inset-0 gradient-primary opacity-90" />
                  <div className="relative h-full flex flex-col justify-between p-10 text-primary-foreground">
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase opacity-80">Live order</p>
                      <p className="mt-1 text-2xl font-display font-bold">Arriving in 47 min</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {["Vitamins", "Pain Relief", "Diabetes"].map((c) => (
                        <div key={c} className="rounded-xl bg-primary-foreground/10 backdrop-blur p-3 text-xs font-semibold">{c}</div>
                      ))}
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 glass-card rounded-2xl p-4 w-48"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="size-4 fill-warning text-warning" />
                    <span className="text-xs font-bold">4.9 rating</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">From 12,400 reviews</p>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-6 glass-card rounded-2xl p-4 w-52"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="size-4 text-mint" />
                    <span className="text-xs font-bold">24/7 pharmacist</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Free chat consultation</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight">Shop by category</h2>
            <p className="text-muted-foreground mt-1">Browse our curated medical inventory.</p>
          </div>
          <Link to="/categories" className="text-sm font-semibold text-primary hover:underline underline-offset-4">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories?.slice(0, 10).map((c, idx) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
            >
              <Link
                to="/categories/$slug"
                params={{ slug: c.slug }}
                className="group flex flex-col items-center gap-3 rounded-2xl glass-card p-6 text-center hover-lift"
              >
                <div className="grid size-14 place-items-center rounded-2xl gradient-primary text-primary-foreground transition-transform group-hover:scale-110">
                  <CategoryIcon name={c.icon} className="size-6" />
                </div>
                <span className="text-sm font-semibold">{c.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight">Featured medicines</h2>
            <p className="text-muted-foreground mt-1">Clinically tested, doctor-recommended.</p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-primary hover:underline underline-offset-4">
            Shop all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {featured?.map((p, i) => <ProductCard key={p.id} product={p as never} index={i} />)}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-[2.5rem] glass-card p-10 lg:p-16 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 size-72 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-mint/15 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-3xl lg:text-4xl font-bold tracking-tight max-w-2xl">
              Why thousands trust <span className="text-gradient">MediFlow</span>
            </h2>
            <div className="mt-12 grid md:grid-cols-3 gap-8">
              {[
                { icon: ShieldCheck, title: "Verified by pharmacists", body: "Every order double-checked by licensed pharmacists before shipment." },
                { icon: Truck, title: "Hyper-local delivery", body: "Express 2-hour delivery in metro cities, nationwide reach." },
                { icon: Sparkles, title: "AI-powered care", body: "Smart medicine recommendations and automatic refill scheduling." },
              ].map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="space-y-3"
                >
                  <div className="grid size-12 place-items-center rounded-xl gradient-mint text-mint-foreground">
                    <f.icon className="size-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight">
          Your medicine cabinet,<br /><span className="text-gradient">reimagined.</span>
        </h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Join thousands managing their health with MediFlow. Start with 10% off your first order.
        </p>
        <div className="mt-8 flex justify-center gap-3 flex-wrap">
          <Button asChild size="lg" className="rounded-full gradient-primary text-primary-foreground border-0 shadow-elevated">
            <Link to="/auth">Create your account <ArrowRight className="ml-2 size-4" /></Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link to="/products">Browse medicines</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

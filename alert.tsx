import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { motion } from "framer-motion";

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  brand?: string | null;
  image_url?: string | null;
  mrp: number;
  discount_percent: number;
  stock: number;
  category?: { name: string; slug: string } | null;
}

export function ProductCard({ product, index = 0 }: { product: ProductCardData; index?: number }) {
  const { addItem } = useCart();
  const finalPrice = Number(product.mrp) * (1 - Number(product.discount_percent) / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col rounded-2xl bg-card ring-1 ring-border p-4 hover-lift"
    >
      <Link to="/products/$slug" params={{ slug: product.slug }} className="block">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-accent/30 to-secondary/40 grid place-items-center">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="text-4xl font-display font-bold text-primary/30">
              {product.name.charAt(0)}
            </div>
          )}
          {product.discount_percent > 0 && (
            <span className="absolute top-3 left-3 rounded-full gradient-mint px-2.5 py-1 text-[10px] font-bold text-mint-foreground shadow-sm">
              {Number(product.discount_percent).toFixed(0)}% OFF
            </span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute top-3 right-3 rounded-full bg-warning/90 px-2.5 py-1 text-[10px] font-bold text-warning-foreground">
              Low stock
            </span>
          )}
        </div>
      </Link>
      <div className="mt-4 flex flex-col gap-1 flex-1">
        {product.category && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            {product.category.name}
          </span>
        )}
        <Link to="/products/$slug" params={{ slug: product.slug }}>
          <h3 className="text-sm font-semibold leading-tight line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.brand && <p className="text-xs text-muted-foreground">{product.brand}</p>}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-display font-bold">₹{finalPrice.toFixed(0)}</span>
          {product.discount_percent > 0 && (
            <span className="text-xs text-muted-foreground line-through">₹{Number(product.mrp).toFixed(0)}</span>
          )}
        </div>
      </div>
      <Button
        onClick={() => addItem(product.id)}
        disabled={product.stock === 0}
        className="mt-4 w-full rounded-xl gradient-primary text-primary-foreground border-0 shadow-glass hover:opacity-90"
        size="sm"
      >
        <ShoppingCart className="size-4 mr-2" />
        {product.stock === 0 ? "Out of stock" : "Add to cart"}
      </Button>
    </motion.div>
  );
}

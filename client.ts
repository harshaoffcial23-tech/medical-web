import { useEffect, useState, createContext, useContext, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    mrp: number;
    discount_percent: number;
    stock: number;
  };
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  discount: number;
  total: number;
  loading: boolean;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select("id, product_id, quantity, product:products(id, name, slug, image_url, mrp, discount_percent, stock)")
      .eq("user_id", user.id);
    if (!error && data) setItems(data as unknown as CartItem[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addItem(productId: string, quantity = 1) {
    if (!user) {
      toast.error("Please sign in to add items to your cart");
      return;
    }
    const existing = items.find((i) => i.product_id === productId);
    if (existing) {
      await updateQuantity(existing.id, existing.quantity + quantity);
      return;
    }
    const { error } = await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: productId,
      quantity,
    });
    if (error) {
      toast.error("Couldn't add to cart");
      return;
    }
    toast.success("Added to cart");
    refresh();
  }

  async function updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) return removeItem(itemId);
    const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId);
    if (!error) refresh();
  }

  async function removeItem(itemId: string) {
    const { error } = await supabase.from("cart_items").delete().eq("id", itemId);
    if (!error) refresh();
  }

  async function clearCart() {
    if (!user) return;
    await supabase.from("cart_items").delete().eq("user_id", user.id);
    setItems([]);
  }

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + Number(i.product.mrp) * i.quantity, 0);
  const discount = items.reduce(
    (s, i) => s + (Number(i.product.mrp) * Number(i.product.discount_percent) / 100) * i.quantity,
    0
  );
  const total = subtotal - discount;

  return (
    <CartContext.Provider
      value={{ items, count, subtotal, discount, total, loading, addItem, updateQuantity, removeItem, clearCart, refresh }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

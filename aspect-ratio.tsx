import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, User, Search, Menu, Pill, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export function SiteHeader() {
  const { user, isAdmin, signOut } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) navigate({ to: "/search", search: { q: query.trim() } });
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 glass border-b" />
      <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="grid size-9 place-items-center rounded-xl gradient-primary shadow-glow">
            <Pill className="size-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            Medi<span className="text-gradient">Flow</span>
          </span>
        </Link>

        <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search medicines, brands, conditions..."
              className="w-full rounded-full bg-secondary/60 py-2.5 pl-10 pr-4 text-sm ring-1 ring-border transition-all focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </form>

        <nav className="hidden lg:flex items-center gap-1 text-sm">
          <Link to="/categories" className="px-3 py-2 rounded-lg hover:bg-secondary transition-colors font-medium">
            Categories
          </Link>
          <Link to="/products" className="px-3 py-2 rounded-lg hover:bg-secondary transition-colors font-medium">
            Shop
          </Link>
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ShoppingCart className="size-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full gradient-primary text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-xs text-muted-foreground">Signed in as</p>
                  <p className="truncate text-sm font-medium">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/account" })}>
                  <LayoutDashboard className="mr-2 size-4" /> My account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/account/orders" })}>
                  <ShoppingCart className="mr-2 size-4" /> Orders
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate({ to: "/admin" })}>
                    <Shield className="mr-2 size-4" /> Admin dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="rounded-full gradient-primary text-primary-foreground border-0 shadow-glass">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="lg:hidden rounded-full">
            <Menu className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid size-9 place-items-center rounded-xl gradient-primary">
                <Pill className="size-5 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold">
                Medi<span className="text-gradient">Flow</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              AI-powered pharmacy delivering verified medications with clinical precision. Licensed,
              secure, and trusted by thousands.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/categories" className="hover:text-primary">Categories</Link></li>
              <li><Link to="/products" className="hover:text-primary">All medicines</Link></li>
              <li><Link to="/cart" className="hover:text-primary">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/auth" className="hover:text-primary">Sign in / Sign up</Link></li>
              <li><Link to="/account/orders" className="hover:text-primary">Orders</Link></li>
              <li><Link to="/account" className="hover:text-primary">Profile</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MediFlow Pharmaceuticals. Licensed pharmacy.</p>
          <p>Made with clinical care · Secure checkout · 24/7 support</p>
        </div>
      </div>
    </footer>
  );
}

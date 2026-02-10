import { Link, useLocation, useNavigate } from "react-router-dom";
import { MessageSquare, Store, ShoppingBag, Search, User, LogOut, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";

export function BuyerNavbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const links = [
    { to: "/buyer", label: "Home", icon: Store },
    { to: "/buyer/shops", label: "Browse Shops", icon: Store },
    { to: "/buyer/orders", label: "My Orders", icon: ShoppingBag },
    { to: "/buyer/search", label: "AI Search", icon: Search },
  ];

  const isActive = (path: string) =>
    path === "/buyer" ? pathname === "/buyer" : pathname.startsWith(path);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/buyer" className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold gradient-text hidden sm:inline">ByChat</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive(link.to)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <link.icon className="w-4 h-4" />
              <span className="hidden md:inline">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Link to="/buyer/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="w-5 h-5" />
            </Button>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          <Link to="/buyer/profile">
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ShoppingBag, Clock, Store } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  preparing: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  delivered: "bg-green-500/20 text-green-300 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
};

type OrderItem = { name: string; quantity: number; price: number };

export default function BuyerOrders() {
  const { user } = useAuth();

  const { data: buyer } = useQuery({
    queryKey: ["buyer-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("buyers")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: orders, isLoading } = useQuery({
    queryKey: ["buyer-orders", buyer?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("buyer_id", buyer!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Fetch seller names
      const sellerIds = [...new Set(data.map((o) => o.seller_id))];
      const { data: sellers } = await supabase
        .from("sellers")
        .select("id, business_name")
        .in("id", sellerIds);
      const sellerMap = new Map(sellers?.map((s) => [s.id, s.business_name]) || []);

      return data.map((o) => ({
        ...o,
        seller_name: sellerMap.get(o.seller_id) || "Unknown Shop",
      }));
    },
    enabled: !!buyer,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">Track and view your order history</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Card key={i} className="glass-card border-border h-32 animate-pulse" />
          ))}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => {
            const items = (order.items as OrderItem[]) || [];
            return (
              <Card key={order.id} className="glass-card border-border hover:shadow-lg transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 min-w-0 flex-1">
                      {/* Store name */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                          <Store className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{order.seller_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Order #{order.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>

                      {/* Items list */}
                      <div className="text-xs text-muted-foreground space-y-0.5 pl-10">
                        {items.map((item: OrderItem, i: number) => (
                          <div key={i} className="flex items-center justify-between">
                            <span>{item.quantity}× {item.name}</span>
                            <span className="text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground pl-10">
                        <Clock className="w-3 h-3" />
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    {/* Status + Total */}
                    <div className="text-right space-y-2 shrink-0">
                      <Badge variant="outline" className={statusColors[order.status] || ""}>
                        {order.status}
                      </Badge>
                      <p className="text-lg font-bold text-primary">
                        ${Number(order.total_price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
          <p className="text-muted-foreground">Browse shops and place your first order!</p>
        </div>
      )}
    </div>
  );
}

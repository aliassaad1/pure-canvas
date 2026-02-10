import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, sellerId } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const placeOrder = useMutation({
    mutationFn: async () => {
      if (!buyer || !sellerId) throw new Error("Missing buyer or seller");
      const orderItems = items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        productId: i.productId,
      }));
      const { error } = await supabase.from("orders").insert({
        buyer_id: buyer.id,
        seller_id: sellerId,
        buyer_name: buyer.full_name,
        items: orderItems,
        total_price: totalPrice,
        status: "pending" as const,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["buyer-orders"] });
      toast.success("Order placed successfully!");
      navigate("/buyer/orders");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground mb-4">Browse shops and add items to get started</p>
        <Link to="/buyer/shops">
          <Button variant="hero">Browse Shops</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">Your Cart</h1>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.productId} className="glass-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-14 h-14 rounded-lg object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.name}</p>
                <p className="text-xs text-primary font-bold">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-7 h-7"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-7 h-7"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 hover:text-destructive"
                  onClick={() => removeItem(item.productId)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      <div className="flex items-center justify-between text-lg font-bold">
        <span>Total</span>
        <span className="text-primary">${totalPrice.toFixed(2)}</span>
      </div>

      <Button
        className="w-full"
        variant="hero"
        size="lg"
        onClick={() => placeOrder.mutate()}
        disabled={placeOrder.isPending || !buyer}
      >
        {placeOrder.isPending ? "Placing Order..." : "Place Order"}
      </Button>

      {!buyer && (
        <p className="text-xs text-destructive text-center">
          Buyer profile not found. Please complete your signup first.
        </p>
      )}
    </div>
  );
}

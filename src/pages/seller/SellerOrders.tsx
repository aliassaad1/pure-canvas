import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSellerProfile } from "@/hooks/useSellerProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  preparing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

const statuses = ["pending", "confirmed", "preparing", "delivered", "cancelled"] as const;

export default function SellerOrders() {
  const { data: seller } = useSellerProfile();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["seller-orders-all", seller?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("seller_id", seller!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!seller,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status: status as any })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
      toast.success("Order status updated");
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="glass-card border-border cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => setSelectedOrder(order)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        #{order.id.slice(0, 8)}
                      </span>
                      <Badge variant="outline" className={statusColors[order.status] ?? ""}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="font-medium">{order.buyer_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${Number(order.total_price).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {Array.isArray(order.items) ? order.items.length : 0} items
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
          <p className="text-muted-foreground">Orders from buyers will appear here</p>
        </div>
      )}

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="glass-card border-border sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Buyer</p>
                  <p className="font-medium">{selectedOrder.buyer_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-medium">${Number(selectedOrder.total_price).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(val) => {
                      updateStatus.mutate({ id: selectedOrder.id, status: val });
                      setSelectedOrder({ ...selectedOrder, status: val });
                    }}
                  >
                    <SelectTrigger className="bg-muted/50 border-border mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Items</p>
                <div className="space-y-2">
                  {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between p-2 rounded bg-muted/30 text-sm">
                        <span>{item.name ?? `Item ${i + 1}`}</span>
                        <span className="font-medium">${Number(item.price ?? 0).toFixed(2)} × {item.quantity ?? 1}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No items data</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

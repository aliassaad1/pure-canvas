import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSellerProfile } from "@/hooks/useSellerProfile";
import {
  ShoppingCart,
  DollarSign,
  Package,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  preparing: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function SellerDashboard() {
  const { data: seller } = useSellerProfile();

  const { data: products } = useQuery({
    queryKey: ["seller-products-count", seller?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("seller_id", seller!.id)
        .eq("is_available", true);
      return count ?? 0;
    },
    enabled: !!seller,
  });

  const { data: orders } = useQuery({
    queryKey: ["seller-orders", seller?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("seller_id", seller!.id)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!seller,
  });

  const totalOrders = orders?.length ?? 0;
  const pendingOrders = orders?.filter((o) => o.status === "pending").length ?? 0;
  const todayRevenue = orders
    ?.filter((o) => {
      const today = new Date().toDateString();
      return new Date(o.created_at).toDateString() === today && o.status !== "cancelled";
    })
    .reduce((sum, o) => sum + Number(o.total_price), 0) ?? 0;

  // Generate mock chart data from orders (last 7 days)
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayStr = date.toLocaleDateString("en", { weekday: "short" });
    const dayOrders = orders?.filter(
      (o) => new Date(o.created_at).toDateString() === date.toDateString()
    ) ?? [];
    return {
      day: dayStr,
      revenue: dayOrders.reduce((s, o) => s + Number(o.total_price), 0),
    };
  });

  const summaryCards = [
    { title: "Total Orders", value: totalOrders, icon: ShoppingCart, color: "text-primary" },
    { title: "Revenue Today", value: `$${todayRevenue.toFixed(2)}`, icon: DollarSign, color: "text-green-400" },
    { title: "Active Products", value: products ?? 0, icon: Package, color: "text-secondary" },
    { title: "Pending Orders", value: pendingOrders, icon: Clock, color: "text-yellow-400" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.title} className="glass-card border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-muted/50 ${card.color}`}>
                  <card.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Revenue (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ revenue: { label: "Revenue", color: "hsl(var(--primary))" } }} className="h-[250px]">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders && orders.length > 0 ? (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div>
                      <p className="font-medium text-sm">{order.buyer_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm">${Number(order.total_price).toFixed(2)}</span>
                      <Badge variant="outline" className={statusColors[order.status] ?? ""}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">No orders yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

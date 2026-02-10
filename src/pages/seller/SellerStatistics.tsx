import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSellerProfile } from "@/hooks/useSellerProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Users } from "lucide-react";

export default function SellerStatistics() {
  const { data: seller } = useSellerProfile();

  const { data: orders } = useQuery({
    queryKey: ["seller-stats-orders", seller?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("seller_id", seller!.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!seller,
  });

  const { data: products } = useQuery({
    queryKey: ["seller-stats-products", seller?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", seller!.id);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!seller,
  });

  // Orders per day (last 14 days)
  const ordersPerDay = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    const dateStr = date.toISOString().slice(0, 10);
    const dayLabel = date.toLocaleDateString("en", { month: "short", day: "numeric" });
    const count = orders?.filter((o) => o.created_at.slice(0, 10) === dateStr).length ?? 0;
    return { day: dayLabel, orders: count };
  });

  // Revenue over time (last 14 days)
  const revenueOverTime = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    const dateStr = date.toISOString().slice(0, 10);
    const dayLabel = date.toLocaleDateString("en", { month: "short", day: "numeric" });
    const revenue = orders
      ?.filter((o) => o.created_at.slice(0, 10) === dateStr && o.status !== "cancelled")
      .reduce((s, o) => s + Number(o.total_price), 0) ?? 0;
    return { day: dayLabel, revenue };
  });

  // Top selling products (from order items)
  const productSales: Record<string, number> = {};
  orders?.forEach((o) => {
    if (Array.isArray(o.items)) {
      o.items.forEach((item: any) => {
        const name = item.name ?? "Unknown";
        productSales[name] = (productSales[name] ?? 0) + (item.quantity ?? 1);
      });
    }
  });
  const topProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, sold]) => ({ name, sold }));

  // Unique customers
  const uniqueCustomers = new Set(orders?.map((o) => o.buyer_id)).size;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Statistics</h1>

      {/* Customer count card */}
      <Card className="glass-card border-border max-w-xs">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Customers</p>
            <p className="text-3xl font-bold">{uniqueCustomers}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Orders per day */}
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Orders Per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ orders: { label: "Orders", color: "hsl(var(--primary))" } }} className="h-[250px]">
              <LineChart data={ordersPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 3 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top selling products */}
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <ChartContainer config={{ sold: { label: "Sold", color: "hsl(var(--secondary))" } }} className="h-[250px]">
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sold" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">No sales data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Revenue over time */}
        <Card className="glass-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ revenue: { label: "Revenue", color: "hsl(var(--primary))" } }} className="h-[250px]">
              <AreaChart data={revenueOverTime}>
                <defs>
                  <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#revGrad2)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

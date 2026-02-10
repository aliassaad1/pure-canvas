import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Store, MapPin, Clock, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BrowseShops() {
  const { data: sellers, isLoading } = useQuery({
    queryKey: ["all-sellers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sellers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const typeColors: Record<string, string> = {
    restaurant: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    grocery: "bg-green-500/20 text-green-300 border-green-500/30",
    clothing: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    electronics: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    beauty: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    services: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    other: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Browse Shops</h1>
        <p className="text-muted-foreground text-sm mt-1">Discover stores and order through chat</p>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass-card border-border h-52 animate-pulse" />
          ))}
        </div>
      ) : sellers && sellers.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sellers.map((seller) => (
            <Link key={seller.id} to={`/buyer/shop/${seller.id}`}>
              <Card className="glass-card border-border overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                {/* Gradient placeholder cover */}
                <div className="h-28 bg-gradient-to-br from-primary/20 via-secondary/10 to-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                      <Store className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground leading-tight">
                        {seller.business_name}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`text-[10px] mt-0.5 ${typeColors[seller.business_type] || typeColors.other}`}
                      >
                        {seller.business_type}
                      </Badge>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4 space-y-2">
                  {seller.business_description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {seller.business_description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {seller.city_area}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {seller.working_hours_open}–{seller.working_hours_close}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <Badge variant="outline" className="text-[10px]">
                      <Truck className="w-3 h-3 mr-1" />
                      {seller.delivery_option}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No shops yet</h3>
          <p className="text-muted-foreground">Check back soon for new stores!</p>
        </div>
      )}
    </div>
  );
}

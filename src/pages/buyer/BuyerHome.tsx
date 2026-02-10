import { Link } from "react-router-dom";
import { Store, ShoppingBag, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function BuyerHome() {
  const quickLinks = [
    {
      title: "Browse Shops",
      description: "Discover stores near you and shop through chat",
      icon: Store,
      to: "/buyer/shops",
      gradient: "from-primary/20 to-primary/5",
    },
    {
      title: "My Orders",
      description: "Track your orders and view order history",
      icon: ShoppingBag,
      to: "/buyer/orders",
      gradient: "from-secondary/20 to-secondary/5",
    },
    {
      title: "AI Search",
      description: "Find exactly what you're looking for with AI",
      icon: Search,
      to: "/buyer/search",
      gradient: "from-accent/20 to-accent/5",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold">Welcome back! 👋</h1>
        <p className="text-muted-foreground mt-1">What would you like to do today?</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {quickLinks.map((link, i) => (
          <Link key={link.to} to={link.to}>
            <Card
              className={`glass-card border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-fade-in`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardContent className="p-6 space-y-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center`}>
                  <link.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">{link.title}</h3>
                <p className="text-xs text-muted-foreground">{link.description}</p>
                <Button variant="ghost" size="sm" className="p-0 h-auto text-primary">
                  Go <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

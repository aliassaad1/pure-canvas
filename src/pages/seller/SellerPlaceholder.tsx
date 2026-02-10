import { useLocation } from "react-router-dom";
import { Bot, Plug, Settings } from "lucide-react";

const pageConfig: Record<string, { icon: typeof Bot; title: string; description: string }> = {
  "/seller/ai-settings": { icon: Bot, title: "AI Agent Settings", description: "Configure your AI shopping assistant — coming soon." },
  "/seller/integrations": { icon: Plug, title: "Integrations", description: "Connect payment gateways, delivery services, and more — coming soon." },
  "/seller/settings": { icon: Settings, title: "Settings", description: "Manage your account and shop settings — coming soon." },
};

export default function SellerPlaceholder() {
  const { pathname } = useLocation();
  const config = pageConfig[pathname] ?? { icon: Settings, title: "Page", description: "Coming soon." };
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="p-4 rounded-2xl bg-muted/50 mb-6">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold mb-2">{config.title}</h1>
      <p className="text-muted-foreground max-w-md">{config.description}</p>
    </div>
  );
}

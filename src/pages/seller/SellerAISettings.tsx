import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSellerProfile } from "@/hooks/useSellerProfile";
import {
  BookOpen, MessageSquare, Plus, Trash2, ShieldCheck, Truck, DollarSign,
  Sparkles, Bot, Globe, SmilePlus, ShoppingCart, Receipt, MapPin, Save, Package, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type FaqItem = { question: string; answer: string };

type AgentConfig = {
  id?: string;
  seller_id: string;
  store_description: string;
  faq: FaqItem[];
  return_policy: string;
  delivery_time_estimate: string;
  minimum_order_amount: number;
  special_instructions: string;
  agent_name: string;
  tone: "professional" | "friendly" | "casual";
  language: "arabic" | "english" | "both";
  auto_greeting: string;
  can_take_orders: boolean;
  can_give_quotes: boolean;
  collect_delivery_address: boolean;
};

const defaultConfig = (sellerId: string): AgentConfig => ({
  seller_id: sellerId,
  store_description: "",
  faq: [],
  return_policy: "",
  delivery_time_estimate: "",
  minimum_order_amount: 0,
  special_instructions: "",
  agent_name: "Shopping Assistant",
  tone: "friendly",
  language: "both",
  auto_greeting: "Hi! Welcome to our store 👋 How can I help you today?",
  can_take_orders: true,
  can_give_quotes: true,
  collect_delivery_address: true,
});

export default function SellerAISettings() {
  const { data: seller } = useSellerProfile();
  const queryClient = useQueryClient();
  const [config, setConfig] = useState<AgentConfig | null>(null);

  const { data: productCount } = useQuery({
    queryKey: ["seller-product-count", seller?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("seller_id", seller!.id);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!seller,
  });

  const { data: existingConfig, isLoading } = useQuery({
    queryKey: ["ai-agent-config", seller?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_agent_config")
        .select("*")
        .eq("seller_id", seller!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!seller,
  });

  useEffect(() => {
    if (seller && !config) {
      if (existingConfig) {
        setConfig({
          ...existingConfig,
          faq: (existingConfig.faq as FaqItem[] | null) ?? [],
          minimum_order_amount: Number(existingConfig.minimum_order_amount),
        } as AgentConfig);
      } else if (!isLoading) {
        setConfig(defaultConfig(seller.id));
      }
    }
  }, [seller, existingConfig, isLoading, config]);

  const saveMutation = useMutation({
    mutationFn: async (data: AgentConfig) => {
      const payload = {
        ...data,
        faq: JSON.parse(JSON.stringify(data.faq)),
      };

      if (existingConfig) {
        const { error } = await supabase
          .from("ai_agent_config")
          .update(payload)
          .eq("id", existingConfig.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("ai_agent_config")
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-agent-config"] });
      toast.success("AI Agent settings saved!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSave = () => {
    if (config) saveMutation.mutate(config);
  };

  const update = <K extends keyof AgentConfig>(key: K, value: AgentConfig[K]) => {
    setConfig((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const addFaq = () => {
    if (!config) return;
    update("faq", [...config.faq, { question: "", answer: "" }]);
  };

  const removeFaq = (index: number) => {
    if (!config) return;
    update("faq", config.faq.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    if (!config) return;
    const updated = [...config.faq];
    updated[index] = { ...updated[index], [field]: value };
    update("faq", updated);
  };

  if (isLoading || !config) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Agent Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configure how your AI assistant interacts with buyers
          </p>
        </div>
        <Button onClick={handleSave} disabled={saveMutation.isPending} variant="hero" size="sm">
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Settings
        </Button>
      </div>

      {/* Section 1: Knowledge Base */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="w-5 h-5 text-primary" />
            Store Knowledge Base
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Store Description */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              Store Description / About Us
            </Label>
            <Textarea
              placeholder="Tell the AI about your store — what you sell, your brand story, what makes you unique..."
              value={config.store_description}
              onChange={(e) => update("store_description", e.target.value)}
              rows={4}
            />
          </div>

          <Separator />

          {/* FAQ */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              Frequently Asked Questions
            </Label>
            <p className="text-xs text-muted-foreground">
              Add common questions buyers ask so the AI can answer instantly.
            </p>
            {config.faq.map((item, i) => (
              <div key={i} className="rounded-lg border border-border p-3 space-y-2 bg-muted/20">
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Question, e.g. Do you deliver on weekends?"
                      value={item.question}
                      onChange={(e) => updateFaq(i, "question", e.target.value)}
                    />
                    <Textarea
                      placeholder="Answer..."
                      value={item.answer}
                      onChange={(e) => updateFaq(i, "answer", e.target.value)}
                      rows={2}
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFaq(i)} className="hover:text-destructive shrink-0 mt-1">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addFaq}>
              <Plus className="w-4 h-4 mr-2" />
              Add FAQ
            </Button>
          </div>

          <Separator />

          {/* Policies */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                Return Policy
              </Label>
              <Textarea
                placeholder="e.g. Returns accepted within 3 days for unopened items..."
                value={config.return_policy}
                onChange={(e) => update("return_policy", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  Delivery Time Estimate
                </Label>
                <Input
                  placeholder="e.g. 30-60 minutes"
                  value={config.delivery_time_estimate}
                  onChange={(e) => update("delivery_time_estimate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  Minimum Order Amount
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={config.minimum_order_amount}
                  onChange={(e) => update("minimum_order_amount", Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Special Instructions */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              Special Instructions for the AI
            </Label>
            <Textarea
              placeholder='e.g. "Always greet in Arabic first", "Suggest our daily special", "Upsell drinks with food orders"...'
              value={config.special_instructions}
              onChange={(e) => update("special_instructions", e.target.value)}
              rows={3}
            />
          </div>

          <Separator />

          {/* Product Catalog Summary */}
          <div className="flex items-center gap-3 rounded-lg border border-border p-4 bg-muted/20">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Product Catalog</p>
              <p className="text-xs text-muted-foreground">
                Auto-synced from your Products page
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {productCount ?? 0} products
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Agent Personality */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="w-5 h-5 text-primary" />
            Agent Personality
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <SmilePlus className="w-4 h-4 text-muted-foreground" />
              Agent Name
            </Label>
            <Input
              placeholder="Shopping Assistant"
              value={config.agent_name}
              onChange={(e) => update("agent_name", e.target.value)}
            />
          </div>

          <Separator />

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Tone</Label>
              <RadioGroup
                value={config.tone}
                onValueChange={(v) => update("tone", v as AgentConfig["tone"])}
              >
                {[
                  { value: "professional", label: "Professional" },
                  { value: "friendly", label: "Friendly" },
                  { value: "casual", label: "Casual" },
                ].map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt.value} id={`tone-${opt.value}`} />
                    <Label htmlFor={`tone-${opt.value}`} className="font-normal cursor-pointer">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                Language
              </Label>
              <RadioGroup
                value={config.language}
                onValueChange={(v) => update("language", v as AgentConfig["language"])}
              >
                {[
                  { value: "arabic", label: "Arabic" },
                  { value: "english", label: "English" },
                  { value: "both", label: "Both" },
                ].map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt.value} id={`lang-${opt.value}`} />
                    <Label htmlFor={`lang-${opt.value}`} className="font-normal cursor-pointer">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Auto-Greeting Message</Label>
            <Input
              placeholder="Hi! Welcome to our store 👋 How can I help you today?"
              value={config.auto_greeting}
              onChange={(e) => update("auto_greeting", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              First message the AI sends when a buyer opens the chat.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Order Settings */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Order Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {[
            {
              key: "can_take_orders" as const,
              icon: ShoppingCart,
              label: "Can the AI take orders?",
              desc: "Allow the chatbot to process and place orders on behalf of buyers.",
            },
            {
              key: "can_give_quotes" as const,
              icon: Receipt,
              label: "Can the AI give price quotes?",
              desc: "Allow the chatbot to share product prices and order totals.",
            },
            {
              key: "collect_delivery_address" as const,
              icon: MapPin,
              label: "Collect delivery address from buyer?",
              desc: "The AI will ask for and save the buyer's delivery address during checkout.",
            },
          ].map((item, i) => (
            <div key={item.key}>
              {i > 0 && <Separator className="mb-5" />}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted/50 mt-0.5">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <Switch
                  checked={config[item.key]}
                  onCheckedChange={(v) => update(item.key, v)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Bottom Save */}
      <div className="flex justify-end pb-8">
        <Button onClick={handleSave} disabled={saveMutation.isPending} variant="hero">
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save All Settings
        </Button>
      </div>
    </div>
  );
}

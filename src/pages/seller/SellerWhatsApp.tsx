import { useState } from "react";
import {
  Phone,
  CheckCircle2,
  XCircle,
  Send,
  Unplug,
  Info,
  AlertTriangle,
  Bot,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/* ── Hardcoded state — swap with real data later ── */
const CONNECTED = false;
const CONNECTED_NUMBER = "+961 71 123 456";

const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function SellerWhatsApp() {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const isConnected = CONNECTED;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <WhatsAppIcon className="w-6 h-6 text-[#25D366]" />
          WhatsApp Integration
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Let your AI agent reply to customers on WhatsApp — 24/7, automatically.
        </p>
      </div>

      {/* ── 1. Connection Status Card ── */}
      <Card className="glass-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            /* ── Connected state ── */
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#25D366] animate-pulse" />
                <span className="font-medium">Connected</span>
                <Badge className="bg-[#25D366]/20 text-[#25D366] border-[#25D366]/30 text-xs">
                  Active
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{CONNECTED_NUMBER}</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Button variant="outline" size="sm" className="gap-2">
                  <Send className="w-4 h-4" />
                  Send Test Message
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <Unplug className="w-4 h-4" />
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            /* ── Not connected state ── */
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/40" />
                <span className="text-muted-foreground font-medium">Not Connected</span>
              </div>

              <Button
                size="lg"
                className="w-full sm:w-auto gap-2 bg-[#25D366] hover:bg-[#1da851] text-white"
                onClick={() => setShowSetupModal(true)}
              >
                <WhatsAppIcon className="w-5 h-5" />
                Connect WhatsApp Business
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── 4. Info Section ── */}
      <Card className="glass-card border-border">
        <CardContent className="p-5">
          <div className="flex gap-3">
            <div className="shrink-0 mt-0.5">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">How it works</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                When a customer messages your WhatsApp number, your AI agent
                (already configured in your shop settings) will reply
                automatically — same products, same personality, 24/7.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 2. Setup Modal ── */}
      <Dialog open={showSetupModal} onOpenChange={setShowSetupModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="w-9 h-9 rounded-xl bg-[#25D366] flex items-center justify-center">
                <WhatsAppIcon className="w-5 h-5 text-white" />
              </div>
              Connect Your WhatsApp Number
            </DialogTitle>
            <DialogDescription>
              Follow these simple steps to connect your business number.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Steps */}
            <ol className="space-y-4">
              {[
                {
                  step: 1,
                  text: "Click the button below to open Meta's secure signup",
                },
                {
                  step: 2,
                  text: "Enter your business phone number and verify with the OTP Meta sends you",
                },
                {
                  step: 3,
                  text: "Done — your AI agent will now reply to customers on WhatsApp automatically",
                },
              ].map(({ step, text }) => (
                <li key={step} className="flex gap-3">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center text-sm font-bold">
                    {step}
                  </div>
                  <p className="text-sm text-muted-foreground pt-0.5">{text}</p>
                </li>
              ))}
            </ol>

            {/* CTA Button */}
            <Button
              id="whatsapp-signup-btn"
              size="lg"
              className="w-full gap-2 bg-[#25D366] hover:bg-[#1da851] text-white text-base"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Start WhatsApp Setup
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              This takes about 3 minutes and happens only once.
            </p>

            {/* Warning */}
            <div className="flex gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-yellow-500 mt-0.5" />
              <p className="text-xs text-yellow-200 leading-relaxed">
                The phone number you connect cannot be used on the WhatsApp app
                simultaneously. We recommend using a dedicated business number.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

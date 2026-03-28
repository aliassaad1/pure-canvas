import { useState, useEffect } from "react";
import { useSellerProfile } from "@/hooks/useSellerProfile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Save, Loader2, Store, MapPin, Clock, CreditCard, Truck,
  User, Lock, Mail, Phone, Globe, Building2, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const businessTypes = [
  { value: "restaurant", label: "Restaurant" },
  { value: "grocery", label: "Grocery" },
  { value: "clothing", label: "Clothing" },
  { value: "electronics", label: "Electronics" },
  { value: "beauty", label: "Beauty" },
  { value: "services", label: "Services" },
  { value: "other", label: "Other" },
];

export default function SellerSettings() {
  const { data: seller, isLoading } = useSellerProfile();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Store info
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("other");
  const [businessDescription, setBusinessDescription] = useState("");
  const [cityArea, setCityArea] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");

  // Contact
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");

  // Operations
  const [workingHoursOpen, setWorkingHoursOpen] = useState("09:00");
  const [workingHoursClose, setWorkingHoursClose] = useState("21:00");
  const [deliveryOption, setDeliveryOption] = useState("both");
  const [acceptsCash, setAcceptsCash] = useState(false);
  const [acceptsCard, setAcceptsCard] = useState(false);
  const [acceptsOmt, setAcceptsOmt] = useState(false);
  const [acceptsWhish, setAcceptsWhish] = useState(false);

  // Location
  const [storeLatitude, setStoreLatitude] = useState<number | null>(null);
  const [storeLongitude, setStoreLongitude] = useState<number | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (seller) {
      setBusinessName(seller.business_name || "");
      setBusinessType(seller.business_type || "other");
      setBusinessDescription(seller.business_description || "");
      setCityArea(seller.city_area || "");
      setBusinessAddress(seller.business_address || "");
      setFullName(seller.full_name || "");
      setPhoneNumber(seller.phone_number || "");
      setWhatsappNumber(seller.whatsapp_number || "");
      setInstagramHandle(seller.instagram_handle || "");
      setWorkingHoursOpen(seller.working_hours_open || "09:00");
      setWorkingHoursClose(seller.working_hours_close || "21:00");
      setDeliveryOption(seller.delivery_option || "both");
      setAcceptsCash(seller.accepts_cash ?? false);
      setAcceptsCard(seller.accepts_card ?? false);
      setAcceptsOmt(seller.accepts_omt ?? false);
      setAcceptsWhish(seller.accepts_whish ?? false);
      setStoreLatitude((seller as any).store_latitude ?? null);
      setStoreLongitude((seller as any).store_longitude ?? null);
    }
  }, [seller]);

  async function handleSave() {
    if (!seller) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("sellers")
        .update({
          business_name: businessName,
          business_type: businessType as any,
          business_description: businessDescription,
          city_area: cityArea,
          business_address: businessAddress,
          full_name: fullName,
          phone_number: phoneNumber,
          whatsapp_number: whatsappNumber,
          instagram_handle: instagramHandle || null,
          working_hours_open: workingHoursOpen,
          working_hours_close: workingHoursClose,
          delivery_option: deliveryOption as any,
          accepts_cash: acceptsCash,
          accepts_card: acceptsCard,
          accepts_omt: acceptsOmt,
          accepts_whish: acceptsWhish,
          store_latitude: storeLatitude,
          store_longitude: storeLongitude,
        } as any)
        .eq("id", seller.id);
      if (error) throw error;
      toast.success("Settings saved");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords don't match");
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password changed successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  }

  function handleGetLocation() {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setStoreLatitude(pos.coords.latitude);
        setStoreLongitude(pos.coords.longitude);
        setGettingLocation(false);
        toast.success("Location captured");
      },
      (err) => {
        toast.error("Could not get location: " + err.message);
        setGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your store profile and account</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>

      {/* Account */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</Label>
              <Input value={user?.email || ""} disabled className="opacity-60" />
              <p className="text-xs text-muted-foreground">Contact support to change email</p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone Number</Label>
              <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+961 XX XXX XXX" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Instagram</Label>
              <Input value={instagramHandle} onChange={(e) => setInstagramHandle(e.target.value)} placeholder="@yourstore" />
            </div>
          </div>

          <Separator />

          <div>
            <Label className="flex items-center gap-1.5 mb-3"><Lock className="w-3.5 h-3.5" /> Change Password</Label>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <Input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={handleChangePassword} disabled={changingPassword || !newPassword}>
              {changingPassword ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Store Information */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Store className="w-4 h-4 text-muted-foreground" />
            Store Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Store Name</Label>
              <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Business Type</Label>
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger className="bg-muted/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Description</Label>
            <Textarea value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)} placeholder="Tell customers about your store..." rows={3} />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> WhatsApp Number</Label>
            <Input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="+961 XX XXX XXX" />
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>City / Area</Label>
              <Input value={cityArea} onChange={(e) => setCityArea(e.target.value)} placeholder="e.g. Hamra, Beirut" />
            </div>
            <div className="space-y-2">
              <Label>Street Address</Label>
              <Input value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} placeholder="e.g. Hamra Street, near AUB" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Store GPS Location</Label>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={handleGetLocation} disabled={gettingLocation}>
                {gettingLocation ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                {storeLatitude ? "Update My Location" : "Set My Location"}
              </Button>
              {storeLatitude && storeLongitude && (
                <span className="text-xs text-muted-foreground">
                  {storeLatitude.toFixed(6)}, {storeLongitude.toFixed(6)}
                </span>
              )}
            </div>
            {storeLatitude && storeLongitude && (
              <div className="mt-2 rounded-lg overflow-hidden border border-border h-48">
                <iframe
                  title="Store location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${storeLongitude - 0.005},${storeLatitude - 0.003},${storeLongitude + 0.005},${storeLatitude + 0.003}&layer=mapnik&marker=${storeLatitude},${storeLongitude}`}
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">Your location will be shared with customers for delivery and directions</p>
          </div>
        </CardContent>
      </Card>

      {/* Working Hours */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Working Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Opening Time</Label>
              <Input type="time" value={workingHoursOpen} onChange={(e) => setWorkingHoursOpen(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Closing Time</Label>
              <Input type="time" value={workingHoursClose} onChange={(e) => setWorkingHoursClose(e.target.value)} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">The AI agent will inform customers about your working hours</p>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Select the payment methods you accept. The AI agent will inform customers about these options.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: "Cash", desc: "Cash on delivery", value: acceptsCash, set: setAcceptsCash },
              { label: "Credit/Debit Card", desc: "Visa, Mastercard", value: acceptsCard, set: setAcceptsCard },
              { label: "OMT", desc: "OMT transfers", value: acceptsOmt, set: setAcceptsOmt },
              { label: "Whish", desc: "Whish Money", value: acceptsWhish, set: setAcceptsWhish },
            ].map((pm) => (
              <div key={pm.label} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                <div>
                  <p className="text-sm font-medium">{pm.label}</p>
                  <p className="text-xs text-muted-foreground">{pm.desc}</p>
                </div>
                <Switch checked={pm.value} onCheckedChange={pm.set} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Options */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Truck className="w-4 h-4 text-muted-foreground" />
            Delivery Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">How can customers get their orders?</p>
          <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption}>
            {[
              { value: "delivery", label: "Delivery Only", desc: "You deliver orders to customers" },
              { value: "pickup", label: "Pickup Only", desc: "Customers pick up from your store" },
              { value: "both", label: "Delivery & Pickup", desc: "Customers can choose either option" },
            ].map((opt) => (
              <div key={opt.value} className="flex items-start space-x-3 p-3 rounded-lg border border-border bg-muted/20">
                <RadioGroupItem value={opt.value} id={`delivery-${opt.value}`} className="mt-0.5" />
                <div>
                  <Label htmlFor={`delivery-${opt.value}`} className="font-medium cursor-pointer">{opt.label}</Label>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Save Button (bottom) */}
      <div className="flex justify-end pb-8">
        <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save All Changes
        </Button>
      </div>
    </div>
  );
}

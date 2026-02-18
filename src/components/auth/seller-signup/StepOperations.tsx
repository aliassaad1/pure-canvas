import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, ArrowLeft, Loader2 } from "lucide-react";
import { DELIVERY_OPTIONS } from "./SellerSignupSchema";
import type { SellerFormData } from "./SellerSignupSchema";

interface StepOperationsProps {
  form: UseFormReturn<SellerFormData>;
  onBack: () => void;
  isLoading: boolean;
}

const StepOperations = ({ form, onBack, isLoading }: StepOperationsProps) => {
  const { register, setValue, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center mx-auto mb-4">
          <Settings className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Operations & Contact</h2>
        <p className="text-muted-foreground text-sm mt-1">Set up delivery, payments, and contact info</p>
      </div>

      {/* Working Hours */}
      <div>
        <h3 className="text-lg font-semibold mb-4 gradient-text">Working Hours <span className="text-muted-foreground text-xs font-normal">(Optional)</span></h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workingHoursOpen">Opening Time</Label>
            <Input id="workingHoursOpen" type="time" {...register("workingHoursOpen")} className="bg-muted/50 border-border" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workingHoursClose">Closing Time</Label>
            <Input id="workingHoursClose" type="time" {...register("workingHoursClose")} className="bg-muted/50 border-border" />
          </div>
        </div>
      </div>

      {/* Delivery & Payments */}
      <div>
        <h3 className="text-lg font-semibold mb-4 gradient-text">Delivery & Payments</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Delivery Options</Label>
            <Select onValueChange={(value: any) => setValue("deliveryOption", value)}>
              <SelectTrigger className="bg-muted/50 border-border">
                <SelectValue placeholder="Select delivery option" />
              </SelectTrigger>
              <SelectContent>
                {DELIVERY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.deliveryOption && <p className="text-destructive text-sm">{errors.deliveryOption.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Accepted Payment Methods</Label>
            <div className="flex flex-wrap gap-6">
              {[
                { id: "cash", field: "acceptsCash" as const, label: "Cash", defaultChecked: true },
                { id: "card", field: "acceptsCard" as const, label: "Card" },
                { id: "omt", field: "acceptsOmt" as const, label: "OMT" },
                { id: "whish", field: "acceptsWhish" as const, label: "Whish" },
              ].map((pm) => (
                <div key={pm.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={pm.id}
                    defaultChecked={pm.defaultChecked}
                    onCheckedChange={(checked) => setValue(pm.field, !!checked)}
                  />
                  <label htmlFor={pm.id} className="text-sm cursor-pointer">{pm.label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div>
        <h3 className="text-lg font-semibold mb-4 gradient-text">Contact & Social</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">WhatsApp Business Number</Label>
            <Input id="whatsappNumber" placeholder="+961 XX XXX XXX" {...register("whatsappNumber")} className="bg-muted/50 border-border" />
            {errors.whatsappNumber && <p className="text-destructive text-sm">{errors.whatsappNumber.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagramHandle">Instagram Handle <span className="text-muted-foreground text-xs">(Optional)</span></Label>
            <Input id="instagramHandle" placeholder="@yourshop" {...register("instagramHandle")} className="bg-muted/50 border-border" />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="ghost" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button type="submit" variant="hero" className="flex-1" disabled={isLoading}>
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
          ) : (
            "Create Seller Account"
          )}
        </Button>
      </div>
    </div>
  );
};

export default StepOperations;

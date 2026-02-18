import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, ArrowRight } from "lucide-react";
import type { SellerFormData } from "./SellerSignupSchema";

interface StepPersonalInfoProps {
  form: UseFormReturn<SellerFormData>;
  onNext: () => void;
}

const StepPersonalInfo = ({ form, onNext }: StepPersonalInfoProps) => {
  const { register, formState: { errors }, trigger } = form;

  const handleNext = async () => {
    const valid = await trigger(["fullName", "email", "password", "phoneNumber"]);
    if (valid) onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
          <User className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Personal Information</h2>
        <p className="text-muted-foreground text-sm mt-1">Tell us about yourself</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" placeholder="John Doe" {...register("fullName")} className="bg-muted/50 border-border" />
          {errors.fullName && <p className="text-destructive text-sm">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" placeholder="+961 XX XXX XXX" {...register("phoneNumber")} className="bg-muted/50 border-border" />
          {errors.phoneNumber && <p className="text-destructive text-sm">{errors.phoneNumber.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john@example.com" {...register("email")} className="bg-muted/50 border-border" />
          {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" {...register("password")} className="bg-muted/50 border-border" />
          {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
        </div>
      </div>

      <Button type="button" variant="hero" className="w-full" onClick={handleNext}>
        Next <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

export default StepPersonalInfo;

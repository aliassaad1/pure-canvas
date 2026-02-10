import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { Product } from "@/pages/seller/SellerProducts";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  image_url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

type FormData = z.infer<typeof schema>;

const categories = [
  "Food",
  "Drinks",
  "Appetizers",
  "Desserts",
  "Clothing",
  "Electronics",
  "Beauty",
  "Services",
  "Other",
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  sellerId: string;
}

export function ProductFormModal({ open, onOpenChange, product, sellerId }: Props) {
  const queryClient = useQueryClient();
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "Other",
      image_url: "",
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description ?? "",
        price: Number(product.price),
        category: product.category,
        image_url: product.image_url ?? "",
      });
    } else {
      reset({ name: "", description: "", price: 0, category: "Other", image_url: "" });
    }
  }, [product, reset]);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        name: data.name,
        description: data.description || null,
        price: data.price,
        category: data.category,
        image_url: data.image_url || null,
        seller_id: sellerId,
      };

      if (isEditing) {
        const { error } = await supabase.from("products").update(payload).eq("id", product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      toast.success(isEditing ? "Product updated" : "Product added");
      onOpenChange(false);
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input {...register("name")} className="bg-muted/50 border-border" placeholder="Product name" />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...register("description")} className="bg-muted/50 border-border" placeholder="Optional description" rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price ($)</Label>
              <Input type="number" step="0.01" {...register("price")} className="bg-muted/50 border-border" />
              {errors.price && <p className="text-destructive text-sm">{errors.price.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={watch("category")} onValueChange={(v) => setValue("category", v)}>
                <SelectTrigger className="bg-muted/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input {...register("image_url")} className="bg-muted/50 border-border" placeholder="https://..." />
            {errors.image_url && <p className="text-destructive text-sm">{errors.image_url.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="hero" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditing ? "Update" : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { z } from "zod";

export const LEBANESE_CITIES = [
  "Beirut", "Tripoli", "Sidon", "Tyre", "Jounieh", "Byblos", "Baalbek",
  "Zahle", "Aley", "Batroun", "Beit Mery", "Broummana", "Nabatieh",
  "Baabda", "Jal el Dib", "Antelias", "Dbayeh", "Hazmieh", "Other",
];

export const BUSINESS_TYPES = [
  { value: "restaurant", label: "Restaurant" },
  { value: "grocery", label: "Grocery" },
  { value: "clothing", label: "Clothing" },
  { value: "electronics", label: "Electronics" },
  { value: "beauty", label: "Beauty" },
  { value: "services", label: "Services" },
  { value: "other", label: "Other" },
];

export const DELIVERY_OPTIONS = [
  { value: "pickup", label: "Pickup Only" },
  { value: "delivery", label: "Delivery Only" },
  { value: "both", label: "Both Pickup & Delivery" },
];

export const AI_AGENT_CAPABILITIES = [
  { value: "reply_messages", label: "Reply to customer messages" },
  { value: "take_orders", label: "Take and process orders" },
  { value: "recommend_products", label: "Recommend products to customers" },
  { value: "answer_faq", label: "Answer FAQs about the business" },
];

export const AI_TONE_OPTIONS = [
  { value: "friendly", label: "Friendly & Casual" },
  { value: "professional", label: "Professional & Formal" },
  { value: "enthusiastic", label: "Enthusiastic & Energetic" },
  { value: "concise", label: "Short & Concise" },
];

export const sellerSchema = z.object({
  // Step 1 - Personal
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().min(8, "Invalid phone number"),

  // Step 2 - Business + AI
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.enum(["restaurant", "grocery", "clothing", "electronics", "beauty", "services", "other"]),
  businessDescription: z.string().min(10, "Describe your business in at least 10 characters"),
  cityArea: z.string().min(1, "Please select a city"),
  businessAddress: z.string().optional(),
  aiCapabilities: z.array(z.string()).min(1, "Select at least one capability"),
  aiTone: z.string().min(1, "Select a tone for your AI agent"),
  aiCustomInstructions: z.string().optional(),

  // Step 3 - Operations
  workingHoursOpen: z.string().optional(),
  workingHoursClose: z.string().optional(),
  deliveryOption: z.enum(["pickup", "delivery", "both"]),
  acceptsCash: z.boolean(),
  acceptsCard: z.boolean(),
  acceptsOmt: z.boolean(),
  acceptsWhish: z.boolean(),
  whatsappNumber: z.string().min(8, "WhatsApp number is required"),
  instagramHandle: z.string().optional(),
});

export type SellerFormData = z.infer<typeof sellerSchema>;

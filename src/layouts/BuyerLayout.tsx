import { Outlet } from "react-router-dom";
import { BuyerNavbar } from "@/components/buyer/BuyerNavbar";
import { CartProvider } from "@/hooks/useCart";

export default function BuyerLayout() {
  return (
    <CartProvider>
      <div className="min-h-screen">
        <BuyerNavbar />
        <main className="pt-20 pb-8 px-4 container mx-auto max-w-7xl">
          <Outlet />
        </main>
      </div>
    </CartProvider>
  );
}

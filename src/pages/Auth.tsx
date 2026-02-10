import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageSquare, ShoppingBag, Store, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BuyerSignup from "@/components/auth/BuyerSignup";
import SellerSignup from "@/components/auth/SellerSignup";
import LoginForm from "@/components/auth/LoginForm";

type AuthView = "role-select" | "buyer-signup" | "seller-signup" | "login";

const Auth = () => {
  const [view, setView] = useState<AuthView>("role-select");
  const [selectedRole, setSelectedRole] = useState<"buyer" | "seller" | null>(null);

  const handleRoleSelect = (role: "buyer" | "seller") => {
    setSelectedRole(role);
    setView(role === "buyer" ? "buyer-signup" : "seller-signup");
  };

  const handleBackToRoles = () => {
    setView("role-select");
    setSelectedRole(null);
  };

  const handleSwitchToLogin = () => {
    setView("login");
  };

  const handleSwitchToSignup = () => {
    setView("role-select");
    setSelectedRole(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="hero-glow-1" />
      <div className="hero-glow-2" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(222,30%,15%,0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(222,30%,15%,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="w-full max-w-4xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:shadow-[0_0_30px_hsl(190,100%,50%,0.4)] transition-shadow duration-300">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">ByChat</span>
          </Link>
        </motion.div>

        <AnimatePresence mode="wait">
          {view === "role-select" && (
            <motion.div
              key="role-select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                  Welcome to <span className="gradient-text">ByChat</span>
                </h1>
                <p className="text-muted-foreground">Choose how you want to use the platform</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {/* Buyer Card */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect("buyer")}
                  className="glass-card p-8 text-left group cursor-pointer hover:border-primary/50 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <ShoppingBag className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">I'm a Buyer</h3>
                  <p className="text-muted-foreground">
                    Browse shops, chat with AI assistants, and place orders seamlessly.
                  </p>
                </motion.button>

                {/* Seller Card */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect("seller")}
                  className="glass-card p-8 text-left group cursor-pointer hover:border-secondary/50 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Store className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">I'm a Seller</h3>
                  <p className="text-muted-foreground">
                    Create your shop, add products, and let AI handle customer conversations.
                  </p>
                </motion.button>
              </div>

              <div className="text-center mt-8">
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    onClick={handleSwitchToLogin}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {view === "buyer-signup" && (
            <motion.div
              key="buyer-signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="ghost"
                onClick={handleBackToRoles}
                className="mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <BuyerSignup onSwitchToLogin={handleSwitchToLogin} />
            </motion.div>
          )}

          {view === "seller-signup" && (
            <motion.div
              key="seller-signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="ghost"
                onClick={handleBackToRoles}
                className="mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <SellerSignup onSwitchToLogin={handleSwitchToLogin} />
            </motion.div>
          )}

          {view === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LoginForm onSwitchToSignup={handleSwitchToSignup} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Auth;

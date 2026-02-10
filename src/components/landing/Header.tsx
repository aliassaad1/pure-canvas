import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:shadow-[0_0_30px_hsl(190,100%,50%,0.4)] transition-shadow duration-300">
            <MessageSquare className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold gradient-text">ByChat</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
            How it Works
          </a>
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
            Features
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/auth">
            <Button variant="ghost" className="hidden sm:inline-flex">
              Sign In
            </Button>
          </Link>
          <Link to="/auth">
            <Button variant="hero" size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;

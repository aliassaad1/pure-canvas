import { motion } from "framer-motion";
import { Bot, Zap, Shield, Globe, Clock, CreditCard } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Assistants",
    description: "Smart chatbots that understand context and provide personalized recommendations.",
  },
  {
    icon: Zap,
    title: "Instant Responses",
    description: "Get answers to your questions in seconds, any time of day or night.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Multiple payment options with bank-level security for peace of mind.",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Shop in Arabic or English — our AI speaks your language.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Shop whenever you want. Our AI assistants never sleep.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payments",
    description: "Pay with cash, card, OMT, or Whish — whatever works for you.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="gradient-text">ByChat</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the future of shopping with features designed for your convenience.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

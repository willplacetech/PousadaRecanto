import { motion } from "framer-motion";

export const ease = [0.22, 1, 0.36, 1];

export const Reveal = ({ children, delay = 0, y = 28, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.9, delay, ease }}
  >
    {children}
  </motion.div>
);

export const Eyebrow = ({ children, light = false }) => (
  <p
    className={`text-xs uppercase tracking-[0.28em] font-semibold ${
      light ? "text-sand/70" : "text-clay"
    }`}
  >
    {children}
  </p>
);

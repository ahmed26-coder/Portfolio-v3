"use client";
import { motion } from "framer-motion";

export default function WavingHand() {
  return (
    <motion.div
      animate={{
        rotate: [0, -20, 10, -20, 10, 0]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: 1.5,
        ease: "easeInOut",
      }}
      className="text-5xl inline-block"
      style={{
        display: "inline-block",
        transformOrigin: "bottom right",
      }}
    >
      👋
    </motion.div>
  );
}

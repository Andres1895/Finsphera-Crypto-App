"use client";

import { motion } from "framer-motion";
import type { ErrorProps } from "../lib/types";

export default function Error({ message, title = "Error" }: ErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-zinc-950/50 border border-red-800 rounded-2xl p-6 text-center"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="flex justify-center"
      >
        <div className="text-5xl mb-4">⚠️</div>
      </motion.div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 mb-4">{message}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
      >
        Retry Connection
      </motion.button>
    </motion.div>
  );
}

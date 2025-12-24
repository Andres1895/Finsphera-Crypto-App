"use client";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4 direction-column">
      <motion.div className="w-8 h-8 bg-blue-500 dark:bg-[#242e3d] rounded-full"
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 0, 270, 270, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <p className="text-sm text-gray-500 dark:text-gray-500">Loading...</p>
    </div>
  );
};

export default Loader;
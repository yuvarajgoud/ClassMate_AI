import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-6">
      <motion.div
        className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
}

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createChat } from "../api/api";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleStart = async () => {
    const { data } = await createChat();
    navigate(`/chat/${data._id}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-900 via-black to-indigo-900 text-white">
      <motion.h1 
        className="text-6xl font-extrabold bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Futuristic RAG Assistant
      </motion.h1>
      <p className="mt-4 text-lg text-gray-300 max-w-2xl text-center">
        Upload your files, add YouTube links, or crawl websites.  
        Then chat with an AI that understands your sources.
      </p>
      <motion.button
        onClick={handleStart}
        className="mt-8 px-8 py-4 bg-gradient-to-r from-pink-500 to-cyan-400 text-black rounded-2xl shadow-xl font-bold hover:scale-105 transition"
        whileHover={{ scale: 1.1 }}
      >
        🚀 Start New Chat
      </motion.button>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { addUserMessage, addAssistantMessage, getChat,getCredits,deleteChat} from "../api/api";
import { motion } from "framer-motion";
import MessageBubble from "./MessageBubble";
import LoadingSpinner from "./LoadingSpinner";
import axios from "axios";

export default function ChatInterface({ chatId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(null); // 👈 track remaining credits
  const scrollRef = useRef();

  // Fetch chat + credits on mount
  useEffect(() => {
    (async () => {
      const { data } = await getChat(chatId);
      setMessages(data.messages || []);
    })();
    fetchCredits();
    return () => {
      cleanupChat();
    };

  }, [chatId]);

  const cleanupChat = async () => {
    try {
      await deleteChat(chatId);
      console.log(`🧹 Chat ${chatId} cleaned from DB + VectorDB`);
    } catch (err) {
      console.error("❌ Failed to clean chat:", err);
    }
  };

  // Helper to fetch credits
  const fetchCredits = async () => {
    console.log(credits);
    try {
      const { data } = await getCredits()
      console.log(data)
      setCredits(data.credits);
    } catch (err) {
      console.error("❌ Failed to fetch credits:", err);
    }
  };

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      await addUserMessage(chatId, userMessage);

      const tempId = Date.now();
      setMessages((prev) => [
        ...prev,
        { _id: tempId, role: "assistant", content: "", loading: true },
      ]);
      setLoading(true);

      const { data: assistantMessage } = await addAssistantMessage(chatId, {
        content: input,
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId ? { ...assistantMessage, loading: false } : msg
        )
      );

      // 👇 After assistant reply, update credits
      fetchCredits();
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col w-full mx-auto space-y-4">
      {/* Chat Card */}
      <div className="flex flex-col h-[95vh] w-full max-w-[1600px] px-6 mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6">
        
        {/* Credits Info */}
        <div className="flex justify-end mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {credits !== null && (
            <span>
              💎 Remaining Credits: <b>{credits}</b>
            </span>
          )}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 chat-scroll">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {msg.loading ? (
                <div className="flex justify-start">
                  <LoadingSpinner size="sm" />
                </div>
              ) : (
                <MessageBubble {...msg} />
              )}
            </motion.div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* Input Box */}
        <div className="flex items-center gap-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 rounded-2xl bg-gray-100 dark:bg-gray-800 p-4 text-gray-900 dark:text-gray-100 focus:outline-none shadow-inner transition-colors duration-300"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <motion.button
            onClick={sendMessage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

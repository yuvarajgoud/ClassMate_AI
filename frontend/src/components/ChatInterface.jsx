import { useState, useEffect, useRef } from "react";
import { addUserMessage, addAssistantMessage, getChat } from "../api/api";
import { motion } from "framer-motion";
import MessageBubble from "./MessageBubble";
import LoadingSpinner from "./LoadingSpinner";

export default function ChatInterface({ chatId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // track assistant response
  const scrollRef = useRef();

  useEffect(() => {
    (async () => {
      const { data } = await getChat(chatId);
      setMessages(data.messages || []);
    })();
  }, [chatId]);

  const sendMessage = async () => {
    if (!input) return;

    // 1️⃣ Add user message immediately
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      // Call user message API
      await addUserMessage(chatId, userMessage);

      // 2️⃣ Show temporary assistant loading bubble
      const tempId = Date.now();
      setMessages((prev) => [
        ...prev,
        { _id: tempId, role: "assistant", content: "", loading: true }
      ]);
      setLoading(true);

      // 3️⃣ Call assistant API
      const { data: assistantMessage } = await addAssistantMessage(chatId, {
        content: input
      });

      // 4️⃣ Replace spinner with actual assistant message
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId ? { ...assistantMessage, loading: false } : msg
        )
      );
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

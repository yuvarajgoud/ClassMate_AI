import { useState, useEffect } from "react";
import { addMessage, getChat } from "../api/api";
import MessageBubble from "./MessageBubble";

export default function ChatInterface({ chatId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await getChat(chatId);
      setMessages(data.messages || []);
    })();
  }, [chatId]);

  const sendMessage = async () => {
    if (!input) return;
    const { data } = await addMessage(chatId, { content: input });
    setMessages((prev) => [...prev, ...data]); // AI + User
    setInput("");
  };

  return (
    <div className="w-2/3 bg-gray-900 rounded-2xl p-6 flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, i) => <MessageBubble key={i} {...msg} />)}
      </div>
      <div className="flex mt-4">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-gray-800 text-white" placeholder="Ask something..." />
        <button onClick={sendMessage} className="ml-2 px-6 py-3 bg-gradient-to-r from-cyan-400 to-pink-500 text-black rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
}

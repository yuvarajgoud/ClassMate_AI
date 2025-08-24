export default function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div
      className={`flex w-full my-2 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`p-3 rounded-2xl max-w-xl ${
          isUser
            ? "bg-gradient-to-r from-pink-500 to-cyan-400 text-black"
            : "bg-gray-700 text-white"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

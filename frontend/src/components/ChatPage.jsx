import UploadPanel from "./UploadPanel";
import ChatInterface from "./ChatInterface";
import { useParams } from "react-router-dom";

export default function ChatPage() {
  const { chatId } = useParams();
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-black via-gray-900 to-indigo-900 text-white p-6 gap-6">
      <UploadPanel chatId={chatId} />
      <ChatInterface chatId={chatId} />
    </div>
  );
}

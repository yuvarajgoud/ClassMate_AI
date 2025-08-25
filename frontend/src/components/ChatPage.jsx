import UploadPanel from "./UploadPanel";
import ChatInterface from "./ChatInterface";
import { useParams } from "react-router-dom";

export default function ChatPage() {
  const { chatId } = useParams();
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-black via-gray-900 to-indigo-900 text-white p-3 md:p-6 gap-4 md:gap-6">
      
      {/* Upload Panel */}
      <div className="w-full md:w-1/3 flex-shrink-0">
        <UploadPanel chatId={chatId} />
      </div>

      {/* Chat Interface */}
      <div className="w-full md:flex-1 flex">
        <ChatInterface chatId={chatId} />
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import {
  addFile,
  addWebsite,
  addYoutube,
  deleteSource,
  getChat,
  createChat,
} from "../api/api";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-hot-toast";
import { FaTrash, FaYoutube, FaGlobe, FaFileAlt, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function UploadPanel({ chatId }) {
  const [file, setFile] = useState(null);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [sources, setSources] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const { data } = await getChat(chatId);
        setSources(data.sources || []);
      } catch (err) {
        console.error("Failed to fetch sources", err);
        toast.error("❌ Failed to load sources");
      }
    };
    fetchSources();
  }, [chatId]);

  const handleSubmit = async (type) => {
    if(type === "file" && file == null){
      toast.error("Please select upload a file");
      return;
    }
    let tempId = Date.now();
    let newSource = {
      _id: tempId,
      type,
      title:
        type === "file"
          ? file?.name
          : type === "website"
          ? websiteUrl
          : youtubeUrl,
      loading: true,
    };
    setSources((prev) => [...prev, newSource]);

    try {
      let response;
      if (type === "file" && file) {
        response = await addFile(chatId, file);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
      if (type === "website" && websiteUrl) {
        response = await addWebsite(chatId, websiteUrl);
        setWebsiteUrl("");
      }
      if (type === "youtube" && youtubeUrl) {
        response = await addYoutube(chatId, youtubeUrl);
        setYoutubeUrl("");
      }

      setSources((prev) =>
        prev.map((src) =>
          src._id === tempId ? { ...src, _id: response.data._id, loading: false } : src
        )
      );
      toast.success(`${type} uploaded successfully 🚀`);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to upload source");
      setSources((prev) => prev.filter((s) => s._id !== tempId));
    }
  };

  const handleDelete = async (sourceId) => {
    try {
      const response = await deleteSource(chatId, sourceId);
      setSources(response.data);
      toast.success("Source deleted 🗑️");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete source");
    }
  };

  const handleNewChat = async () => {
    try {
      const { data } = await createChat();
      navigate(`/chat/${data._id}`);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to create new chat");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const getIcon = (type) => {
    switch (type) {
      case "file":
        return <FaFileAlt className="text-blue-400" />;
      case "website":
        return <FaGlobe className="text-green-400" />;
      case "youtube":
        return <FaYoutube className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-[95vh] bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl shadow-2xl flex flex-col">

      {/* Header */}
      <h2 className="text-2xl font-bold text-white tracking-wide drop-shadow-md mb-4">
        📂 Upload Sources
      </h2>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-4">
        <motion.button
          onClick={handleBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 px-5 py-3 bg-gray-700 text-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold tracking-wide"
        >
          <FaArrowLeft /> Back
        </motion.button>

        <motion.button
          onClick={handleNewChat}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 px-5 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 font-semibold tracking-wide"
        >
          New Chat
        </motion.button>
      </div>

      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-500 rounded-2xl p-4 mb-4 text-center hover:border-cyan-400 transition-all duration-300">
        <input
          ref={fileInputRef}
          type="file"
          className="w-full text-sm text-gray-200 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg file:text-gray-700 file:bg-gray-100 hover:file:bg-gray-200 transition-colors"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          onClick={() => handleSubmit("file")}
          className="mt-3 w-full py-3 bg-gradient-to-r from-pink-500 to-cyan-400 text-black font-semibold rounded-xl shadow hover:shadow-lg transition-all duration-300"
        >
          Upload File
        </button>
      </div>

      {/* Website & YouTube Inputs */}
      <div className="flex flex-col gap-3 mb-4">
        <div>
          <input
            type="text"
            placeholder="Enter Website URL"
            className="w-full p-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
          <button
            onClick={() => handleSubmit("website")}
            className="mt-2 w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 text-black font-semibold rounded-xl shadow hover:shadow-lg transition-all duration-300"
          >
            Add Website
          </button>
        </div>

        <div>
          <input
            type="text"
            placeholder="Enter YouTube URL"
            className="w-full p-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
          <button
            onClick={() => handleSubmit("youtube")}
            className="mt-2 w-full py-3 bg-gradient-to-r from-red-500 to-yellow-400 text-black font-semibold rounded-xl shadow hover:shadow-lg transition-all duration-300"
          >
            Add YouTube
          </button>
        </div>
      </div>

      {/* Sources List - Scrollable Card */}
     <div className="bg-gray-700 rounded-2xl shadow-inner p-4 flex flex-col gap-2 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
  {sources.map((src) => (
    <div
      key={src._id}
      className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded-xl shadow hover:bg-gray-600 transition-colors duration-300"
    >
      <div className="flex items-center gap-2 text-white truncate text-sm">
        {getIcon(src.type)}
        <span className="truncate max-w-[180px]">{src.title}</span>
      </div>
      <div>
        {src.loading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <button
            onClick={() => handleDelete(src._id)}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <FaTrash />
          </button>
        )}
      </div>
    </div>
  ))}

  {sources.length === 0 && (
    <p className="text-gray-400 text-sm text-center mt-2">
      No sources uploaded yet
    </p>
  )}
</div>

    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import {
  addFile,
  addWebsite,
  addYoutube,
  deleteSource,
  getChat, // <-- add this API
} from "../api/api";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "react-hot-toast";
import { FaTrash, FaYoutube, FaGlobe, FaFileAlt } from "react-icons/fa";

export default function UploadPanel({ chatId }) {
  const [file, setFile] = useState(null);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [sources, setSources] = useState([]);
  const fileInputRef = useRef(null); // 🔹 to reset <input type="file">

  // ✅ Fetch existing sources on mount
  useEffect(() => {
    const fetchSources = async () => {
      try {
        const {data} = await getChat(chatId); // GET /chat/:chatId
        console.log(data)
        setSources(data.sources || []);
      } catch (err) {
        console.error("Failed to fetch sources", err);
        toast.error("❌ Failed to load sources");
      }
    };
    fetchSources();
  }, [chatId]);

  const handleSubmit = async (type) => {
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
        if (fileInputRef.current) fileInputRef.current.value = ""; // ✅ reset input
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
          src._id === tempId
            ? { ...src, _id: response.data._id,loading:false }
            : src
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
      await deleteSource(chatId, sourceId); // ✅ should take both IDs
      setSources((prev) => prev.filter((s) => s._id !== sourceId));
      toast.success("Source deleted 🗑️");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete source");
    }
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
    <div className="w-1/3 bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-white">📂 Upload Sources</h2>

      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-500 rounded-xl p-6 text-center hover:border-cyan-400">
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          onClick={() => handleSubmit("file")}
          className="mt-2 w-full py-2 bg-gradient-to-r from-pink-500 to-cyan-400 text-black rounded-lg"
        >
          Upload File
        </button>
      </div>

      {/* Website URL */}
      <div>
        <input
          type="text"
          placeholder="Enter Website URL"
          className="w-full p-2 rounded-lg bg-gray-700 text-white"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
        />
        <button
          onClick={() => handleSubmit("website")}
          className="mt-2 w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-black rounded-lg"
        >
          Add Website
        </button>
      </div>

      {/* YouTube URL */}
      <div>
        <input
          type="text"
          placeholder="Enter YouTube URL"
          className="w-full p-2 rounded-lg bg-gray-700 text-white"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />
        <button
          onClick={() => handleSubmit("youtube")}
          className="mt-2 w-full py-2 bg-gradient-to-r from-red-500 to-yellow-400 text-black rounded-lg"
        >
          Add YouTube
        </button>
      </div>

      {/* Sources List */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-white mb-3">📑 Sources</h3>
        <div className="flex flex-col gap-3">
          {sources.map((src) => (
            <div
              key={src._id}
              className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
            >
              <div className="flex items-center gap-2 text-white">
                {getIcon(src.type)}
                <span className="truncate max-w-[200px]">{src.title}</span>
              </div>
              <div>
                {src.loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <button
                    onClick={() => handleDelete(src._id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
          {sources.length === 0 && (
            <p className="text-gray-400 text-sm">No sources uploaded yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

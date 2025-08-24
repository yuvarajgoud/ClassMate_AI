import { useState } from "react";
import { addFile, addWebsite, addYoutube } from "../api/api";
import LoadingSpinner from "./LoadingSpinner";

export default function UploadPanel({ chatId }) {
  const [file, setFile] = useState(null);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (type) => {
    try {
      setLoading(true);
      if (type === "file" && file) {
        await addFile(chatId, file);
        setFile(null)
      }
      if (type === "website" && websiteUrl) {
        await addWebsite(chatId, websiteUrl);
        setWebsiteUrl("")
      }
      if (type === "youtube" && youtubeUrl){
        await addYoutube(chatId, youtubeUrl);
        setYoutubeUrl("")
      }
    } catch (err) {
      alert("❌ Failed to upload source");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-1/3 bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-white">📂 Upload Sources</h2>

      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-500 rounded-xl p-6 text-center cursor-pointer hover:border-cyan-400">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={() => handleSubmit("file")} className="mt-2 w-full py-2 bg-gradient-to-r from-pink-500 to-cyan-400 text-black rounded-lg">
          Upload File
        </button>
      </div>

      {/* Website URL */}
      <div>
        <input type="text" placeholder="Enter Website URL"
          className="w-full p-2 rounded-lg bg-gray-700 text-white"
          value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
        <button onClick={() => handleSubmit("website")} className="mt-2 w-full py-2 bg-gradient-to-r from-green-400 to-blue-500 text-black rounded-lg">
          Add Website
        </button>
      </div>

      {/* YouTube URL */}
      <div>
        <input type="text" placeholder="Enter YouTube URL"
          className="w-full p-2 rounded-lg bg-gray-700 text-white"
          value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
        <button onClick={() => handleSubmit("youtube")} className="mt-2 w-full py-2 bg-gradient-to-r from-red-500 to-yellow-400 text-black rounded-lg">
          Add YouTube
        </button>
      </div>

      {loading && <LoadingSpinner />}
    </div>
  );
}


import ChatSession from "../models/ChatSession.js";
import path from "path";
import fs from "fs";
import { loadPDF, loadDOCX, loadXLSX, loadTXT } from "../utils/sourceLoader.js"; 


export const addFileSource = async (req, res) => {
  try {
    console.log("inside addFileSource")
    const { chatId } = req.params;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    
    const ext = path.extname(file.originalname).toLowerCase();
    let type = null;

    if (ext === ".pdf") type = "pdf";
    else if (ext === ".docx") type = "docx";
    else if (ext === ".xlsx") type = "xlsx";
    else if (ext === ".txt") type = "txt";
    else return res.status(400).json({ error: "Unsupported file type" });

    
    const chat = await ChatSession.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Chat session not found" });

    const newSource = {
      type,
      title: file.originalname,
      metadata: { path: file.path, size: file.size }
    };

    chat.sources.push(newSource);
    await chat.save();

    
    if (type === "pdf") {
      await loadPDF(file.path, chatId);
    } else if (type === "docx") {
      await loadDOCX(file.path, chatId);
    } else if (type === "xlsx") {
      await loadXLSX(file.path, chatId);
    } else if (type === "txt") {
      await loadTXT(file.path, chatId);
    }

    res.json({ message: "File source added", source: newSource });
  } catch (err) {
    console.error("❌ Error adding file source:", err);
    res.status(500).json({ error: "Failed to add file source" });
  }
};


export const addYoutubeSource = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { url } = req.body;

    if (!url) return res.status(400).json({ error: "YouTube URL required" });

    const chat = await ChatSession.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Chat session not found" });

    const newSource = {
      type: "youtube",
      title: "YouTube Video",
      metadata: { url }
    };

    chat.sources.push(newSource);
    await chat.save();

    
    res.json({ message: "YouTube source added", source: newSource });
  } catch (err) {
    console.error("❌ Error adding YouTube source:", err);
    res.status(500).json({ error: "Failed to add YouTube source" });
  }
};


export const addWebsiteSource = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { url } = req.body;

    if (!url) return res.status(400).json({ error: "Website URL required" });

    const chat = await ChatSession.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Chat session not found" });

    const newSource = {
      type: "website",
      title: "Website",
      metadata: { url }
    };

    chat.sources.push(newSource);
    await chat.save();

    
    res.json({ message: "Website source added", source: newSource });
  } catch (err) {
    console.error("❌ Error adding Website source:", err);
    res.status(500).json({ error: "Failed to add Website source" });
  }
};



export const deleteSource = async (req, res) => {
  try {
    const { chatId, sourceId } = req.params;

    const chat = await ChatSession.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Session not found" });

    chat.sources = chat.sources.filter(
      (src) => src._id.toString() !== sourceId
    );
    await chat.save();

    res.json({ success: true, message: "Source removed" });
  } catch (err) {
    console.error("❌ Error deleting source:", err);
    res.status(500).json({ error: "Failed to delete source" });
  }
};

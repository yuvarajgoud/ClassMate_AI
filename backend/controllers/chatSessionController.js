import ChatSession from "../models/ChatSession.js";
import { queryLLM } from "../utils/query.js"

import { ips,MAX_CREDITS } from "../middlewares/ratelimit.js";
import { deleteChatEmbeddings } from "../utils/db.js";

export const getCredits = (req, res) => {
  const ip = req.ip;
  const credits = ips.get(ip);

  return res.json({
    credits: credits !== undefined ? credits : MAX_CREDITS,
  });
};

export const getChatByChatId = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await ChatSession.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.json(chat);
  } catch (err) {
    console.error("❌ Error fetching chat session:", err);
    res.status(500).json({ error: "Failed to fetch chat session" });
  }
};


export const createChatSession = async (req, res) => {
  try {
    
    const chat = await ChatSession.create({
      title: "New Chat",
      messages: [
        {role :"assistant" , content:"Hi there! I'm your ClassMateAI👨‍🎓 assistant. How can I help you today?"}
      ],
      sources: []
    });
    res.status(201).json(chat);
  } catch (err) {
    console.error("❌ Error creating chat session:", err);
    res.status(500).json({ error: "Failed to create chat session" });
  }
};

export const addUserMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;

    const chat = await ChatSession.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Session not found" });

    const userMessage = { role: "user", content };
    chat.messages.push(userMessage);
    await chat.save();

    res.status(201).json(userMessage);
  } catch (err) {
    console.error("❌ Error adding user message:", err);
    res.status(500).json({ error: "Failed to add user message" });
  }
};


export const addAssistantMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;

    const chat = await ChatSession.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Session not found" });

    const AIresponse = await queryLLM(content,chatId);
    const AImessage = {role : "assistant",content:AIresponse}
    
    chat.messages.push(AImessage);
    await chat.save();

    res.status(201).json(AImessage);
  } catch (err) {
    console.error("❌ Error adding assistant message:", err);
    res.status(500).json({ error: "Failed to add assistant message" });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    // 1️⃣ Remove from MongoDB
    await ChatSession.findByIdAndDelete(chatId);

    await deleteChatEmbeddings(chatId);

    res.json({ success: true, message: "Chat cleaned successfully!" });
  } catch (err) {
    console.error("❌ Error deleting chat:", err);
    res.status(500).json({ error: "Failed to clean chat" });
  }
};


// export const addMessage = async (req, res) => {
//   try {
//     const { chatId } = req.params;
//     const { role, content, citations } = req.body;

//     const chat = await ChatSession.findById(chatId);
//     if (!chat) return res.status(404).json({ error: "Session not found" });

//     const userMessage = { role:"user", content, citations };
//     chat.messages.push(userMessage);

//     const AIresponse = await queryLLM(content,chatId);
//     const AImessage = {role : "assistant",content:AIresponse,citations}
//     chat.messages.push(AImessage);
//     await chat.save();
//     const combinedResponse = [userMessage,AImessage]

//     res.status(201).json(combinedResponse);

//   } catch (err) {
//     console.error("❌ Error adding message:", err);
//     res.status(500).json({ error: "Failed to add message" });
//   }
// };

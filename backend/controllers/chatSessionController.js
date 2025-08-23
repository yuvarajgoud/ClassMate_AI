import ChatSession from "../models/ChatSession.js";


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
    const { title } = req.body;
    
    const chat = await ChatSession.create({
      title: title || "New Chat",
      messages: [
        {role :"assistant" , content:"hey There , Upload your sources and start asking questions..."}
      ],
      sources: []
    });
    res.status(201).json(chat);
  } catch (err) {
    console.error("❌ Error creating chat session:", err);
    res.status(500).json({ error: "Failed to create chat session" });
  }
};

export const addMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { role, content, citations } = req.body;

    const chat = await ChatSession.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Session not found" });

    const newMessage = { role, content, citations };
    chat.messages.push(newMessage);
    await chat.save();

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("❌ Error adding message:", err);
    res.status(500).json({ error: "Failed to add message" });
  }
};

import ChatSession from "./models/ChatSession.js";

export const createChatSession = async (req, res) => {
  const { title } = req.body;

  const session = await ChatSession.create({
    userId,
    title: title || "New Chat",
    messages: [],
    sources: []
  });

  res.json(session);
}


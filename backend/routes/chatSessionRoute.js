import express from "express";
import {
  createChatSession,
  getChatByChatId,
  addUserMessage,
  addAssistantMessage,
} from "../controllers/chatSessionController.js";

const router = express.Router();

// GET single chat session by id
router.get("/:chatId", getChatByChatId);

// POST new chat session
router.post("/", createChatSession);

// POST add message to session
// Add user message
router.post("/:chatId/messages/user", addUserMessage);

// Add assistant message
router.post("/:chatId/messages/assistant", addAssistantMessage);

export default router;

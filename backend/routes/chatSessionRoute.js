import express from "express";
import {
  createChatSession,
  addMessage,
  getChatByChatId
} from "../controllers/chatSessionController.js";

const router = express.Router();

// GET single chat session by id
router.get("/:chatId", getChatByChatId);

// POST new chat session
router.post("/", createChatSession);

// POST add message to session
router.post("/:chatId/messages", addMessage);

export default router;

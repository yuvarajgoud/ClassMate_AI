import express from "express";
import {
  createChatSession,
  getChatByChatId,
  addUserMessage,
  addAssistantMessage,
  getCredits,
  deleteChat 
} from "../controllers/chatSessionController.js";
import { checkIP } from "../middlewares/ratelimit.js";

const router = express.Router();

router.get("/getCredits",getCredits);

// GET single chat session by id
router.get("/:chatId", getChatByChatId);

// POST new chat session
router.post("/", createChatSession);

// POST add message to session
// Add user message
router.post("/:chatId/messages/user", addUserMessage);

// Add assistant message
router.post("/:chatId/messages/assistant",checkIP, addAssistantMessage);

router.delete("/:chatId", deleteChat);

export default router;

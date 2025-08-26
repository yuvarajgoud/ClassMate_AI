import ChatSession from "../models/ChatSession.js";

export const ips = new Map();
export const MAX_CREDITS = 30; // lifetime credits

export const checkIP = async (req, res, next) => {
  const ip = req.ip;

  if (!ips.has(ip)) {
    ips.set(ip, MAX_CREDITS - 1); // first request consumes 1 credit
    return next();
  }

  let credits = ips.get(ip);

  if (credits > 0) {
    ips.set(ip, credits - 1)
    return next();
  }
  const { chatId } = req.params;
  const chat = await ChatSession.findById(chatId);
  if (!chat) return res.status(404).json({ error: "Session not found" });

  const outOfCreditMessage = { role:"assistant", content:"You are out of credits"  };
    chat.messages.push(outOfCreditMessage);
    await chat.save();

  return res.status(201).json(outOfCreditMessage);
};
import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant","system"], required: true },
  content: { type: String, required: true },
  citations: { type: Array, default: [] },  // e.g. [{sourceId, page}]
  createdAt: { type: Date, default: Date.now }
});

const sourceSchema = new mongoose.Schema({
  type: { type: String, enum: ["file","youtube","website"], required: true },
  title: String,
  metadata: Object,
  createdAt: { type: Date, default: Date.now }
});

const chatSessionSchema = new mongoose.Schema({
  title: { type: String, default: "New Chat" },
  messages: [messageSchema],
  sources: [sourceSchema],
}, { timestamps: true });

export default mongoose.model("ChatSession", chatSessionSchema);

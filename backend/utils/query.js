
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { QdrantVectorStore } from "@langchain/qdrant"
import { OpenAI } from "openai/client.js";
import { queryEmbeddings } from "./db.js";
import "dotenv/config"



export const queryLLM = async (userQuery, chatId) => {
  try {
    // 1. Fetch relevant docs from vector DB
    const relevantDocs = await queryEmbeddings(userQuery, chatId, 5);

    // 2. Prepare system prompt
    const SYSTEM_PROMPT = `
        You are a helpful assistant that answers questions strictly based on the provided context.
        Each context entry includes the document text and its metadata (chatId, sourceId, page, etc).
        Always use both the content and metadata when forming your answer.
        If metadata contains page number or title, mention it in your response.

        Context:
        ${relevantDocs.map(d => `
        ---
        Text: ${d.text}
        Metadata: ${JSON.stringify(d.metadata, null, 2)}
        Score: ${d.score}
        ---`).join("\n")}
`;
    console.log(SYSTEM_PROMPT);
    // 3. Call LLM safely
    const openai = new OpenAI({
      apiKey: process.env.GOOGLE_API_KEY,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
    });

    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userQuery },
      ],
    });

    // 4. Extract and normalize response
    let content = response.choices?.[0]?.message?.content ?? "";

    if (Array.isArray(content)) {
      content = content.map(c => (c.text || c)).join("\n");
    }
    if (typeof content !== "string") {
      content = JSON.stringify(content);
    }

    return content.trim() || "⚠️ Sorry, I couldn’t generate a response this time.";

  } catch (err) {
    console.error("❌ LLM API error:", err.message || err);

    // return a safe, user-friendly fallback message
    return "⚠️ Sorry, I couldn’t connect to the AI service. Please try again later.";
  }
};




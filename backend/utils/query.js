
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { QdrantVectorStore } from "@langchain/qdrant"
import { OpenAI } from "openai/client.js";

import "dotenv/config"



const chat = async (userQuery) => {
    const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings, 
        {
            url : "http://localhost:6333",
            collectionName : "YTVideos"
        }
    )
    const vectorRetriver = vectorStore.asRetriever({ k : 5});

    const relevantChunks = await vectorRetriver.invoke(userQuery);
    const SYSTEM_PROMPT = `
    You are an helpful assistant that answers questions based on the context available to you from a PDF file and also your knowledge.
    with content and its explanation and also page number.
    Only answer based on the available context from the file only.
    Context:
    ${JSON.stringify(relevantChunks)}
    `

    const openai = new OpenAI({
        apiKey: process.env.GOOGLE_API_KEY,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
    });

    const response = await openai.chat.completions.create({
    model: "gemini-2.5-pro",
    messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
                role: "user",
                content: userQuery,
            },
        ],
    });

    console.log(response.choices[0].message.content)
}


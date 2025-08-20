import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { QdrantVectorStore } from "@langchain/qdrant"
import { OpenAI } from "openai/client.js";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import "dotenv/config"

const storeEmbeddings = async (docs) => {
    const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
    });

    const vectorStore = await QdrantVectorStore.fromDocuments(
        docs , 
        embeddings,
        {
            url : "http://localhost:6333",
            collectionName : "YTVideos"
        }
    )

    console.log("Indexing of documents is done");
}

const indexYoutubeVideo = async (youtubeUrl) => {
    const loader = YoutubeLoader.createFromUrl(youtubeUrl, {
        language: "en",
        addVideoInfo: true,
    });

    const docs = await loader.load();

    storeEmbeddings(docs);
}

const indexPdf = async (pdfFilePath) => {
    const loader = new PDFLoader(pdfFilePath);
    const docs = await loader.load();
    storeEmbeddings(docs);
}

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
    //console.log(relevantChunks);

    
    

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


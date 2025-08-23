import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { QdrantVectorStore } from "@langchain/qdrant"
import "dotenv/config"


export const loadPDF = async (pdfFilePath, chatId) => {
  const loader = new PDFLoader(pdfFilePath);
  const docs = await loader.load();
  await storeEmbeddings(docs, chatId);  
};

export const loadDOCX = async (docFilePath, chatId) => {

}

export const loadXLSX = async (excelFilePath, chatId) => {

}

const loadWebsite = async (websiteURL, chatId) => {

}

export const loadTXT = async (textFilePath, chatId) => {


}

export const LoadYoutubeVideo = async (youtubeUrl, chatId) => {
    const loader = YoutubeLoader.createFromUrl(youtubeUrl, {
        language: "en",
        addVideoInfo: true,
    });
    const docs = await loader.load();
    storeEmbeddings(docs);
}

const storeEmbeddings = async (docs, chatId) => {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
  });

  await QdrantVectorStore.fromDocuments(
    docs,
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: `chat_${chatId}`,  
    }
  );

  console.log(`✅ Indexed docs into collection chat_${chatId}`);
};

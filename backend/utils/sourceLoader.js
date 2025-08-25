import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveUrlLoader } from "@langchain/community/document_loaders/web/recursive_url";
import { compile } from "html-to-text";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { QdrantVectorStore } from "@langchain/qdrant"
import { storeEmbeddings } from "./db.js";
import "dotenv/config"


export const loadPDF = async (pdfFilePath, chatId, sourceId, fileName) => {
  const loader = new PDFLoader(pdfFilePath);
  const docs = await loader.load()
  await storeEmbeddings(docs, chatId,sourceId, fileName);  
};

export const loadDOCX = async (docFilePath, chatId, sourceId, fileName) => {
  const loader = new DocxLoader(docFilePath);
  const docs = await loader.load();
  await storeEmbeddings(docs, chatId, sourceId, fileName); 
}

export const loadWebsite = async (websiteURL, chatId, sourceId) => {
  const compiledConvert = compile({ wordwrap: 130 }); // returns (text: string) => string;

  const loader = new RecursiveUrlLoader(websiteURL, {
    extractor: compiledConvert,
    maxDepth: 2
  });
  const docs = await loader.load();
  await storeEmbeddings(docs, chatId, sourceId);
}

export const loadTXT = async (textFilePath, chatId, sourceId, fileName) => {
    const loader = new TextLoader(textFilePath);
    const docs = await loader.load();
    await storeEmbeddings(docs, chatId, sourceId, fileName); 
}

export const loadYoutubeVideo = async (youtubeUrl, chatId, sourceId) => {
    const loader = YoutubeLoader.createFromUrl(youtubeUrl, {
        language: "en",
        addVideoInfo: true,
    });
    const docs = await loader.load();
    storeEmbeddings(docs, chatId, sourceId);
}

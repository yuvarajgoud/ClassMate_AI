import { QdrantClient } from "@qdrant/js-client-rest";
import { GoogleGenerativeAIEmbeddings} from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { randomUUID } from "crypto";
import 'dotenv/config';

const qdrant = new QdrantClient({ url: process.env.QDRANTDB_URL, apiKey: process.env.QDRANT_API_KEY });

// Google embeddings instance
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  taskType: TaskType.RETRIEVAL_DOCUMENT,
});



export const storeEmbeddings = async (docs, chatId, sourceId, fileName=null) => {
  const collectionName = "chat_docs";

  // Ensure collection exists
  await qdrant.createCollection(collectionName, {
    vectors: { size: 768, distance: "Cosine" },
  }).catch(() => {}); // ignore if exists

  await qdrant.createPayloadIndex(collectionName, {
    field_name: "chatId",
    field_schema: "keyword"
  }).catch(() => {});

  await qdrant.createPayloadIndex("chat_docs", {
    field_name: "sourceId",
    field_schema: "keyword"
  }).catch(() => {}); // ignore if already exists


  const vectors = [];
  for (const doc of docs) {
    const [embedding] = await embeddings.embedDocuments([doc.pageContent]);

    vectors.push({
      id: randomUUID(), // ✅ safe unique ID
      vector: embedding,
      payload: {
        text: doc.pageContent,
        chatId,
        sourceId,
        fileName:fileName ? fileName : "This Doc is not extracted from file",
        ...(doc.metadata || {}),
      },
    });
  }

  await qdrant.upsert(collectionName, { points: vectors });
  //console.log(`✅ Stored ${vectors.length} docs for chat=${chatId}, source=${sourceId}`);
};

export const queryEmbeddings = async (userQuery, chatId, topK = 5) => {
  const collectionName = "chat_docs";

  // Convert query into embedding
  const queryEmbedding = await embeddings.embedQuery(userQuery);

  // Search in Qdrant filtering only this chatId
  const results = await qdrant.search(collectionName, {
    vector: queryEmbedding,
    limit: topK,
    filter: {
      must: [{ key: "chatId", match: { value: chatId } }],
    },
  });

  // Each result contains score + payload
  return results.map(r => ({
    score: r.score,
    text: r.payload.text,
    metadata: r.payload,
  }));
};


export const deleteEmbeddings = async (chatId, sourceId) => {
  const collectionName = "chat_docs";

  await qdrant.delete(collectionName, {
    filter: {
      must: [
        { key: "chatId", match: { value: chatId } },
        { key: "sourceId", match: { value: sourceId } },
      ],
    },
  });
};

export const deleteChatEmbeddings = async (chatId) => {
  const collectionName = "chat_docs";
  await qdrant.delete(collectionName, {
    filter: {
      must: [
        { key: "chatId", match: { value: chatId } }
      ],
    },
  });
}



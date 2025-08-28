import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export const getCredits = () => {
  return api.get("/chat/getCredits");
}

export const createChat = () => {
  return api.post("/chat")
};
export const getChat = (chatId) => {
  return api.get(`/chat/${chatId}`)
};

export const addUserMessage = (chatId, message) =>
  api.post(`/chat/${chatId}/messages/user`, message);

// Add **assistant** message
export const addAssistantMessage = (chatId, payload) =>
  api.post(`/chat/${chatId}/messages/assistant`, payload);


export const addWebsite = (chatId, url) => {
  console.log("Inside Add website")
  return api.post(`/sources/${chatId}/website`, { url })
};
export const addYoutube = (chatId, url) => {
  return api.post(`/sources/${chatId}/youtube`, { url })
};

export const addFile = (chatId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post(`/sources/${chatId}/file`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteSource = (chatId, sourceId) => api.delete(`/sources/${chatId}/${sourceId}`);

export const deleteChat = (chatId) => api.delete(`/chat/${chatId}`);

export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const createChat = () => {
  return api.post("/chat")
};
export const getChat = (chatId) => {
  return api.get(`/chat/${chatId}`)
};
export const addMessage = (chatId, data) => {
  return api.post(`/chat/${chatId}/messages`, data)
};

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

export default api;

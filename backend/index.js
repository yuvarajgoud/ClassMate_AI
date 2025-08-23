import express from "express";
import "dotenv/config";
import {connectDB} from "./config/connection.js"
import ChatSessionRoute from "./routes/chatSessionRoute.js"
import sourceRoute from "./routes/sourceRoute.js"

const app = express();
app.use(express.json());
await connectDB();

// Routes
app.use("/api/chat", ChatSessionRoute);
app.use("/api/sources", sourceRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on "+PORT));

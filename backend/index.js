import express from "express";
import "dotenv/config";

const app = express();
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// Index YouTube
app.post("/api/index/youtube", async (req, res) => {
  try {
    const { url } = req.body;
    await indexYoutubeVideo(url);
    res.json({ success: true, message: "YouTube video indexed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Index PDF
app.post("/api/index/pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // full path of uploaded file
    const pdfFilePath = path.join(__dirname, req.file.path);

    indexPdf(pdfFilePath);
    fs.unlinkSync(pdfFilePath);

    res.json({ success: true, message: "PDF indexed successfully"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { query } = req.body;
    const answer = await chat(query);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));

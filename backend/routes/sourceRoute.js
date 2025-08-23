import express from "express";
import multer from "multer";
import {
  addFileSource,
  addYoutubeSource,
  addWebsiteSource,
  deleteSource
} from "../controllers/sourceController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// File upload (pdf/docx/xlsx/txt)
router.post("/:chatId/file", upload.single("file"), addFileSource);

// YouTube URL
router.post("/:chatId/youtube", addYoutubeSource);

// Website URL
router.post("/:chatId/website", addWebsiteSource);

router.delete("/:chatId/:sourceId", deleteSource);

export default router;

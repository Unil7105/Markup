import express from "express";
import { handleReadFile } from "../controllers/md.controller.js";

const router = express.Router();

router.post("/:filePath", handleReadFile)

export default router;
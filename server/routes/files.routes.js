import { getAllFiles } from "../controllers/file.controller.js";

import express from "express";

const router = express.Router()

router.get("/",getAllFiles);

export default router;
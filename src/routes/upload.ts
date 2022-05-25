import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import multer from "multer";
import multerConfig from "../controller/multer";

const router = Router();
const database = new PrismaClient();

router.get("/", async (req, res) => {
    res.status(200).json({ status: 200, message: "Upload's is working!" })
})

router.post("/", multer(multerConfig).single("file"), async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ status: 401, message: "You need a token to use this endpoint." });
    if (token !== process.env.SECRET_TOKEN) return res.status(401).json({ status: 401, message: "Invalid token!" });

    console.log(req.file);

    const mangaId = req.query.mangaId;
    if (!mangaId) return res.status(401).json({ status: 401, message: "You need a manga id to use this endpoint." });

    const chapterId = req.query.chapterId;
    if (!chapterId) return res.status(401).json({ status: 401, message: "You need a chapter id to use this endpoint." });

    const isDefault = req.query.default === "true";

    console.log(`Manga ID: ${mangaId}\nChapter ID: ${chapterId}${isDefault ? "\nDefault: true" : ""}`);
    console.log(req.file);

    return res.status(200).json({ status: 200, message: "File uploaded." });
})

export default router;
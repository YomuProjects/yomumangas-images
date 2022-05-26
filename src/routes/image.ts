import { Router } from "express";
import multer from "multer";
import multerConfig from "../controller/multer";

const router = Router();

router.get("/", async (req, res) => {
    res.status(200).json({ message: "Upload's is working!" })
})

router.post("/", multer(multerConfig).single("file"), async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: "You need a token to use this endpoint." });
    if (token !== process.env.SECRET_TOKEN) return res.status(401).json({ message: "Invalid token!" });

    const file = req.file;
    if (!file) return res.status(400).json({ message: "No image provided." });

    const mangaId = req.query.mangaId;
    const chapterId = req.params.chapterId;
    const isDefault = req.query.default === "true";

    const data = {
        message: "image uploaded successfully",
        file: file.filename,
        size: file.size,
        url: `https://images.yomumangas.com/${mangaId}/${isDefault ? file.filename : `${chapterId}/${file.filename}`}`
    }

    return res.status(200).json(data);
})

export default router;
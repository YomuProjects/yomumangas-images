import { Router } from "express";
import { existsSync, rmdirSync, rmSync } from "fs";
import sizeOf from "image-size";
import multer from "multer";
import path from "path";
import multerConfig from "../controller/multer";

const router = Router();

router.get("/", async (req, res) => {
    res.status(200).json({ message: "Hello World!" })
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

    const image = sizeOf(file.path);

    const data = {
        message: "image uploaded successfully",
        file: file.filename,
        size: file.size,
        url: `https://images.yomumangas.com/${mangaId}/${isDefault ? file.filename : `${chapterId}/${file.filename}`}`,
        width: image.width,
        height: image.height
    }

    return res.status(200).json(data);
})

router.delete("/", async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: "You need a token to use this endpoint." });
    if (token !== process.env.SECRET_TOKEN) return res.status(401).json({ message: "Invalid token!" });

    const type = req.query.type as string;
    const mangaId = req.query.mangaId;
    const chapterId = req.query.chapterId;
    const file = req.query.file;
    const isDefault = req.query.default === "true";

    if (!type) return res.status(400).json({ message: "No type provided." });
    if (!["manga", "chapter", "image"].includes(type)) return res.status(400).json({ message: "Invalid type.", available: ["manga", "chapter", "image"] });

    if (type === "manga") {
        if (!mangaId) return res.status(400).json({ message: "No manga id provided." });

        if (!existsSync(path.resolve(__dirname, "..", "..", "images", mangaId.toString())))
            return res.status(400).json({ message: "Manga doesn't exist." });

        rmSync(path.resolve(__dirname, "..", "..", "images", mangaId.toString()));

        return res.status(200).json({ message: "Manga deleted successfully." });
    }

    if (type === "chapter") {
        if (!mangaId) return res.status(400).json({ message: "No mangaId provided." });
        if (!chapterId) return res.status(400).json({ message: "No chapterId provided." });

        if (!existsSync(path.resolve(__dirname, "..", "..", "images", mangaId.toString(), chapterId.toString())))
            return res.status(400).json({ message: "Chapter doesn't exist." });

        rmdirSync(path.resolve(__dirname, "..", "..", "images", mangaId.toString(), chapterId.toString()), { recursive: true });

        return res.status(200).json({ message: "Chapter deleted successfully." });
    }

    if (type === "image") {
        if (!mangaId) return res.status(400).json({ message: "No mangaId provided." });
        if (!file) return res.status(400).json({ message: "No file provided." });

        if (isDefault) {
            if (!existsSync(path.resolve(__dirname, "..", "..", "images", mangaId.toString(), file.toString())))
                return res.status(400).json({ message: "Image doesn't exist." });

            rmSync(path.resolve(__dirname, "..", "..", "images", mangaId.toString(), file.toString()));

            return res.status(200).json({ message: "Image deleted successfully." });
        }

        if (!chapterId) return res.status(400).json({ message: "No chapterId provided." });

        if (!existsSync(path.resolve(__dirname, "..", "..", "images", mangaId.toString(), chapterId.toString(), file.toString())))
            return res.status(400).json({ message: "Image doesn't exist." });

        rmSync(path.resolve(__dirname, "..", "..", "images", mangaId.toString(), chapterId.toString(), file.toString()));

        return res.status(200).json({ message: "Image deleted successfully." });
    }
})

export default router;
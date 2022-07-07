import { randomBytes } from "crypto";
import { Router } from "express";
import { existsSync, mkdirSync, readdirSync, rmSync } from "fs";
import sizeOf from "image-size";
import multer, { diskStorage } from "multer";
import path from "path";
import { create, remove } from "../functions/webhook";

const router = Router();
const mainPath = path.resolve(__dirname, "..", "..", "data");
const mimetypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/avif"];

router.get("/", async (req, res) => {
    res.status(200).json({ message: "Hello World!" })
})

router.post("/", multer({
    dest: path.resolve(mainPath),
    storage: diskStorage({
        destination: (req, _file, cb) => {
            const chapterId = req.query.id as string;

            if (!chapterId) return cb(new Error("No chapterId provided."), undefined);

            const chapterPath = path.join(mainPath, "chapters", chapterId);

            if (!existsSync(chapterPath)) mkdirSync(chapterPath);
            return cb(null, chapterPath);
        },
        filename: (_req, file, cb) => cb(null, randomBytes(16).toString("hex"))
    }),
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter: (_req, file, cb) => mimetypes.includes(file.mimetype) ? cb(null, true) : cb("Invalid mimetype." as any, false)
}).single("file"), async (req, res) => {
    try {
        const file = req.file;
        const chapterId = req.query.id as string;

        if (!file) return res.status(400).json({ message: "No image provided." });

        const username = req.headers["username"] as string ?? "NullUser";

        const image = sizeOf(file.path);

        const data = {
            message: "image uploaded successfully",
            file: file.filename,
            size: file.size,
            url: `https://images.yomumangas.com/chapters/${chapterId}/${file.filename}`,
            width: image.width,
            height: image.height
        }

        create(data.url, data.file, data.size, data.width, data.height, username, data.url, "Cover criado!");

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
})

router.delete("/", async (req, res) => {
    res.status(200).json({ message: "You need use the endpoints \'/chapter/all\' or \'/chapter/unique\'" })
})

router.delete("/all", async (req, res) => {
    try {
        const id = req.query.id as string;

        if (!id) return res.status(401).json({ message: "No id provided." });

        const filePath = path.join(__dirname, "../../../images/chapters", id);

        if (!existsSync(filePath)) return res.status(401).json({ message: "Chapter not found." });

        const key = readdirSync(filePath)[0];

        await remove(`https://images.yomumangas.com/chapters/${id}/${key}`, key, "ADMIN", `https://images.yomumangas.com/covers/default-${Math.floor(Math.random() * 20)}`, "Capítulo Deletado!");

        rmSync(filePath);

        return res.status(200).json({ message: "Chapter deleted successfully." });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete("/unique", async (req, res) => {
    try {
        const id = req.query.id as string;
        const key = req.query.key as string;

        if (!id) return res.status(401).json({ message: "No id provided." });
        if (!key) return res.status(401).json({ message: "No key provided." });

        const filePath = path.join(__dirname, "../../../images/chapters", id, key);

        if (!existsSync(filePath)) return res.status(401).json({ message: "Image not found." });

        await remove(`https://images.yomumangas.com/chapters/${id}/${key}`, key, "ADMIN", `https://images.yomumangas.com/covers/default-${Math.floor(Math.random() * 20)}`, "Imagem Deletada!");

        rmSync(filePath);

        return res.status(200).json({ message: "Imagem deleted successfully." });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
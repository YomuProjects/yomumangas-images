import { randomBytes } from "crypto";
import { Router } from "express";
import { existsSync, rmSync } from "fs";
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
        destination: (_req, _file, cb) => cb(null, path.resolve(mainPath, "covers")),
        filename: (_req, file, cb) => cb(null, randomBytes(16).toString("hex"))
    }),
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter: (_req, file, cb) => mimetypes.includes(file.mimetype) ? cb(null, true) : cb("Invalid mimetype." as any, false)
}).single("file"), async (req, res) => {
    try {
        const file = req.file;

        if (!file) return res.status(400).json({ message: "No image provided." });

        const username = req.headers["username"] as string ?? "NullUser";

        const image = sizeOf(file.path);

        const data = {
            message: "image uploaded successfully",
            file: file.filename,
            size: file.size,
            url: `https://images.yomumangas.com/covers/${file.filename}`,
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
    try {
        const key = req.query.key as string;

        if (!key) return res.status(401).json({ message: "No key provided." });

        const filePath = path.join(__dirname, "../../../images/covers", key);

        if (!existsSync(filePath)) return res.status(401).json({ message: "File not found." });

        await remove(`https://images.yomumangas.com/covers/${key}`, key, "ADMIN", `https://images.yomumangas.com/covers/default-${Math.floor(Math.random() * 20)}`, "Cover Deletada!");

        rmSync(filePath);

        return res.status(200).json({ message: "Image deleted successfully." });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
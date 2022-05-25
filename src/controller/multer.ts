import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { existsSync, mkdirSync } from "fs";
import { diskStorage, Options } from "multer";
import path from "path";

const database = new PrismaClient();

const config: Options = {
    dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
    storage: diskStorage({
        destination: async (req, file, cb) => {
            try {
                const mangaId = Number(req.query.mangaId);
                const chapterId = Number(req.params.chapterId);
                const isDefault = req.query.default === "true";

                if (!mangaId) throw new Error("You need a manga id to use this endpoint.");
                const manga = await database.simpleProjects.findUnique({ where: { id: mangaId } });
                if (!manga) throw new Error("Manga not found.");

                if (!existsSync(path.resolve(__dirname, "..", "..", "tmp", "uploads", mangaId.toString()))) {
                    mkdirSync(path.resolve(__dirname, "..", "..", "tmp", "uploads", mangaId.toString()));
                }

                if (isDefault) return cb(null, path.resolve(__dirname, "..", "..", "tmp", "uploads", mangaId.toString()));

                if (!chapterId) throw new Error("You need a chapter id to use this endpoint.");
                const chapter = await database.chapters.findFirst({ where: { projectId: mangaId, number: chapterId }, orderBy: { number: "desc" } });
                if (chapter) throw new Error("Chapter already exists.");

                if (!existsSync(path.resolve(__dirname, "..", "..", "tmp", "uploads", mangaId.toString(), chapterId.toString()))) {
                    mkdirSync(path.resolve(__dirname, "..", "..", "tmp", "uploads", mangaId.toString(), chapterId.toString()));
                }

                cb(null, path.resolve(__dirname, "..", "..", "tmp", "uploads", mangaId.toString(), chapterId.toString()));
            } catch (err) {
                cb(err, undefined);
            }
        },
        filename: async (req, file, cb) => {
            try {
                const hash = crypto.randomBytes(10).toString("hex");
                const fileName = `${hash}-${file.originalname}`;

                cb(null, fileName);
            } catch (err) {
                cb(err, undefined);
            }
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        try {
            const alowedMimes = ["image/jpeg", "image/pjpeg", "image/png", "image/gif", "image/webp"];

            if (!alowedMimes.includes(file.mimetype)) throw new Error("Invalid file type.");

            cb(null, true);
        } catch (err) {
            cb(err, undefined);
        }
    }
};

export default config;
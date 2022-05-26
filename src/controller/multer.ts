import crypto from "crypto";
import { existsSync, mkdirSync } from "fs";
import { diskStorage, Options } from "multer";
import path from "path";

const fileLimit = 1024 * 1024 * 10; // 10MB

const config: Options = {
    dest: path.resolve(__dirname, "..", "..", "images"),
    storage: diskStorage({
        destination: async (req, file, cb) => {
            try {
                const mangaId = Number(req.query.mangaId);
                const chapterId = Number(req.params.chapterId);
                const isDefault = req.query.default === "true";

                if (!mangaId) throw new Error("You need a manga id to use this endpoint.");

                if (!existsSync(path.resolve(__dirname, "..", "..", "images", mangaId.toString()))) {
                    mkdirSync(path.resolve(__dirname, "..", "..", "images", mangaId.toString()));
                }

                if (isDefault) return cb(null, path.resolve(__dirname, "..", "..", "images", mangaId.toString()));

                if (!chapterId) throw new Error("You need a chapter id to use this endpoint.");

                if (!existsSync(path.resolve(__dirname, "..", "..", "images", mangaId.toString(), chapterId.toString()))) {
                    mkdirSync(path.resolve(__dirname, "..", "..", "images", mangaId.toString(), chapterId.toString()));
                }

                cb(null, path.resolve(__dirname, "..", "..", "images", mangaId.toString(), chapterId.toString()));
            } catch (err) {
                cb(err, undefined);
            }
        },
        filename: async (req, file, cb) => {
            try {
                const key = req.query.key ?? file.originalname;
                const hash = crypto.randomBytes(10).toString("hex");

                cb(null, `${hash}-${key}`);
            } catch (err) {
                cb(err, undefined);
            }
        }
    }),
    limits: { fileSize: fileLimit },
    fileFilter: (req, file, cb) => {
        try {
            const alowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/avif"];

            if (!alowedMimes.includes(file.mimetype)) throw new Error("Invalid file type.");

            cb(null, true);
        } catch (err) {
            cb(err, undefined);
        }
    }
};

export default config;
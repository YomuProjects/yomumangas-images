import { PrismaClient } from "@prisma/client";
import { readdirSync } from "fs";
import path from "path";

const db = new PrismaClient();

const mangas = readdirSync(path.resolve(__dirname, "tmp", "uploads"));

mangas.map(async manga => {
    const dirs = readdirSync(path.resolve(__dirname, "tmp", "uploads", manga));
    const chapters = dirs.filter(f => !isNaN(Number(f))).map(f => Number(f)).sort((a, b) => a - b);

    chapters.map(async chapter => {
        const images = readdirSync(path.resolve(__dirname, "tmp", "uploads", manga, chapter.toString()));

        const createdChapter = await db.chapters.create({
            data: {
                projectId: Number(manga),
                number: chapter,
                volume: 1
            }
        })

        const createdImages = images.map(async (image, i) => {
            return await db.chapterImage.create({
                data: {
                    chapterId: createdChapter.id,
                    key: image,
                    url: `https://images.yomumangas.com/${manga}/${chapter}/${image}`
                }
            })
        });

        const a = await Promise.all(createdImages);
        console.log(`Manga: ${manga} - Chapter: ${chapter}`, a);
    });
})
/*
  Warnings:

  - You are about to drop the column `coins` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `donated` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UP', 'DOWN');

-- CreateEnum
CREATE TYPE "Monographc" AS ENUM ('MANGA', 'MANHWA', 'MANHUA', 'VISUAL_NOVEL', 'LIGHT_NOVEL', 'CARTOON', 'WEBTOON', 'WEBCOMIC', 'COMIC');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "coins",
DROP COLUMN "donated",
DROP COLUMN "views",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "passwd" TEXT,
ADD COLUMN     "recovery" TEXT;

-- CreateTable
CREATE TABLE "SimpleProjects" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "otherTitles" TEXT[],
    "description" VARCHAR(2000) NOT NULL,
    "image" VARCHAR(2000) NOT NULL,
    "banner" VARCHAR(2000) NOT NULL,
    "demographc" "Monographc" NOT NULL,
    "author" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "released" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SimpleProjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectsComments" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "comment" VARCHAR(2000) NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectsComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapters" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "number" INTEGER NOT NULL,
    "volume" INTEGER,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "Chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterComments" (
    "id" SERIAL NOT NULL,
    "chapterId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment" VARCHAR(2000) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ChapterComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentsVotes" (
    "id" SERIAL NOT NULL,
    "commentId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vote" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "projectsCommentsId" INTEGER,

    CONSTRAINT "CommentsVotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterVotes" (
    "id" SERIAL NOT NULL,
    "chapterId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "vote" "VoteType" NOT NULL,

    CONSTRAINT "ChapterVotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectsVotes" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "vote" "VoteType" NOT NULL,

    CONSTRAINT "ProjectsVotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stats" (
    "id" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "coins" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lists" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SimpleProjectsToTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ChaptersToSimpleProjects" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_favorites" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_readings" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_readed" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_toReads" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_hiatus" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_dropped" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tags_name_key" ON "Tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_slug_key" ON "Tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_SimpleProjectsToTags_AB_unique" ON "_SimpleProjectsToTags"("A", "B");

-- CreateIndex
CREATE INDEX "_SimpleProjectsToTags_B_index" ON "_SimpleProjectsToTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChaptersToSimpleProjects_AB_unique" ON "_ChaptersToSimpleProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_ChaptersToSimpleProjects_B_index" ON "_ChaptersToSimpleProjects"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_favorites_AB_unique" ON "_favorites"("A", "B");

-- CreateIndex
CREATE INDEX "_favorites_B_index" ON "_favorites"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_readings_AB_unique" ON "_readings"("A", "B");

-- CreateIndex
CREATE INDEX "_readings_B_index" ON "_readings"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_readed_AB_unique" ON "_readed"("A", "B");

-- CreateIndex
CREATE INDEX "_readed_B_index" ON "_readed"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_toReads_AB_unique" ON "_toReads"("A", "B");

-- CreateIndex
CREATE INDEX "_toReads_B_index" ON "_toReads"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_hiatus_AB_unique" ON "_hiatus"("A", "B");

-- CreateIndex
CREATE INDEX "_hiatus_B_index" ON "_hiatus"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_dropped_AB_unique" ON "_dropped"("A", "B");

-- CreateIndex
CREATE INDEX "_dropped_B_index" ON "_dropped"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ProjectsComments" ADD CONSTRAINT "ProjectsComments_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "SimpleProjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsComments" ADD CONSTRAINT "ProjectsComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterComments" ADD CONSTRAINT "ChapterComments_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterComments" ADD CONSTRAINT "ChapterComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentsVotes" ADD CONSTRAINT "CommentsVotes_projectsCommentsId_fkey" FOREIGN KEY ("projectsCommentsId") REFERENCES "ProjectsComments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentsVotes" ADD CONSTRAINT "CommentsVotes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "ChapterComments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentsVotes" ADD CONSTRAINT "CommentsVotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterVotes" ADD CONSTRAINT "ChapterVotes_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterVotes" ADD CONSTRAINT "ChapterVotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsVotes" ADD CONSTRAINT "ProjectsVotes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "SimpleProjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsVotes" ADD CONSTRAINT "ProjectsVotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lists" ADD CONSTRAINT "Lists_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SimpleProjectsToTags" ADD FOREIGN KEY ("A") REFERENCES "SimpleProjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SimpleProjectsToTags" ADD FOREIGN KEY ("B") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChaptersToSimpleProjects" ADD FOREIGN KEY ("A") REFERENCES "Chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChaptersToSimpleProjects" ADD FOREIGN KEY ("B") REFERENCES "SimpleProjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_favorites" ADD FOREIGN KEY ("A") REFERENCES "Lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_favorites" ADD FOREIGN KEY ("B") REFERENCES "SimpleProjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_readings" ADD FOREIGN KEY ("A") REFERENCES "Lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_readings" ADD FOREIGN KEY ("B") REFERENCES "SimpleProjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_readed" ADD FOREIGN KEY ("A") REFERENCES "Lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_readed" ADD FOREIGN KEY ("B") REFERENCES "SimpleProjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_toReads" ADD FOREIGN KEY ("A") REFERENCES "Lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_toReads" ADD FOREIGN KEY ("B") REFERENCES "SimpleProjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_hiatus" ADD FOREIGN KEY ("A") REFERENCES "Lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_hiatus" ADD FOREIGN KEY ("B") REFERENCES "SimpleProjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dropped" ADD FOREIGN KEY ("A") REFERENCES "Lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dropped" ADD FOREIGN KEY ("B") REFERENCES "SimpleProjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

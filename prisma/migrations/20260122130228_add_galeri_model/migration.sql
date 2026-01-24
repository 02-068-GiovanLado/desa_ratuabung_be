/*
  Warnings:

  - You are about to drop the `galeri` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "galeri";

-- CreateTable
CREATE TABLE "Galeri" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "image" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'Admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Galeri_pkey" PRIMARY KEY ("id")
);

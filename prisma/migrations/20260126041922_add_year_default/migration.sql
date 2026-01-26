/*
  Warnings:

  - You are about to drop the `infografis` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "infografis";

-- CreateTable
CREATE TABLE "Infografis" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "year" INTEGER NOT NULL DEFAULT 2026,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Infografis_pkey" PRIMARY KEY ("id")
);

/*
  Warnings:

  - You are about to drop the column `type` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('ORG', 'MEMBER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "type",
ADD COLUMN     "role" "ROLE" NOT NULL DEFAULT 'MEMBER';

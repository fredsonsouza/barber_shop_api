/*
  Warnings:

  - Made the column `updated_at` on table `haircuts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "haircuts" ALTER COLUMN "updated_at" SET NOT NULL;

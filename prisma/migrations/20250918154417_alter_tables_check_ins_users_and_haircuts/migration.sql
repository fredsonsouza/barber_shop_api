/*
  Warnings:

  - Added the required column `barber_id` to the `check_ins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `haircut_id` to the `check_ins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `check_ins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "check_ins" ADD COLUMN     "barber_id" TEXT NOT NULL,
ADD COLUMN     "haircut_id" TEXT NOT NULL,
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "haircuts" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_barber_id_fkey" FOREIGN KEY ("barber_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_haircut_id_fkey" FOREIGN KEY ("haircut_id") REFERENCES "public"."haircuts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

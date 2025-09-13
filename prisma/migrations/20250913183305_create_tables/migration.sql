-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'EMPLOYEE', 'CUSTOMER');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'CUSTOMER',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "sex" TEXT NOT NULL,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."barber_customers" (
    "id" TEXT NOT NULL,
    "user_barber_id" TEXT NOT NULL,
    "user_customer_id" TEXT NOT NULL,

    CONSTRAINT "barber_customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."barber_shops" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "phone" TEXT,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "barber_shops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."haircuts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "haircuts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."check_ins" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validate_at" TIMESTAMP(3),
    "barber_shop_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "check_ins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_CustomerHaircuts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CustomerHaircuts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CustomerHaircuts_B_index" ON "public"."_CustomerHaircuts"("B");

-- AddForeignKey
ALTER TABLE "public"."barber_customers" ADD CONSTRAINT "barber_customers_user_barber_id_fkey" FOREIGN KEY ("user_barber_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."barber_customers" ADD CONSTRAINT "barber_customers_user_customer_id_fkey" FOREIGN KEY ("user_customer_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."check_ins" ADD CONSTRAINT "check_ins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."check_ins" ADD CONSTRAINT "check_ins_barber_shop_id_fkey" FOREIGN KEY ("barber_shop_id") REFERENCES "public"."barber_shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CustomerHaircuts" ADD CONSTRAINT "_CustomerHaircuts_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."haircuts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CustomerHaircuts" ADD CONSTRAINT "_CustomerHaircuts_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "public"."user_favorite_haircuts" (
    "user_id" TEXT NOT NULL,
    "haircut_id" TEXT NOT NULL,

    CONSTRAINT "user_favorite_haircuts_pkey" PRIMARY KEY ("user_id","haircut_id")
);

-- AddForeignKey
ALTER TABLE "public"."user_favorite_haircuts" ADD CONSTRAINT "user_favorite_haircuts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_favorite_haircuts" ADD CONSTRAINT "user_favorite_haircuts_haircut_id_fkey" FOREIGN KEY ("haircut_id") REFERENCES "public"."haircuts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

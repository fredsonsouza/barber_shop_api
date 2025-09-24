-- CreateTable
CREATE TABLE "user_favorite_haircuts" (
    "user_id" TEXT NOT NULL,
    "haircut_id" TEXT NOT NULL,

    CONSTRAINT "user_favorite_haircuts_pkey" PRIMARY KEY ("user_id","haircut_id")
);

-- AddForeignKey
ALTER TABLE "user_favorite_haircuts" ADD CONSTRAINT "user_favorite_haircuts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorite_haircuts" ADD CONSTRAINT "user_favorite_haircuts_haircut_id_fkey" FOREIGN KEY ("haircut_id") REFERENCES "haircuts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

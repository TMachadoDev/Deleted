-- CreateTable
CREATE TABLE "Accounts" (
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_name_key" ON "Accounts"("name");

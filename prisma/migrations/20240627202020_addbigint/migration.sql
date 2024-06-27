/*
  Warnings:

  - The primary key for the `Accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `expire` on the `Bans` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Accounts" (
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL
);
INSERT INTO "new_Accounts" ("name", "role") SELECT "name", "role" FROM "Accounts";
DROP TABLE "Accounts";
ALTER TABLE "new_Accounts" RENAME TO "Accounts";
CREATE UNIQUE INDEX "Accounts_name_key" ON "Accounts"("name");
CREATE TABLE "new_Bans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "player" TEXT NOT NULL,
    "world" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "characters" TEXT NOT NULL,
    "proof" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expire" BIGINT NOT NULL
);
INSERT INTO "new_Bans" ("characters", "createdAt", "expire", "id", "player", "proof", "reason", "world") SELECT "characters", "createdAt", "expire", "id", "player", "proof", "reason", "world" FROM "Bans";
DROP TABLE "Bans";
ALTER TABLE "new_Bans" RENAME TO "Bans";
CREATE UNIQUE INDEX "Bans_player_key" ON "Bans"("player");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

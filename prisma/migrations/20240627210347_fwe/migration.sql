-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "player" TEXT NOT NULL,
    "world" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "characters" TEXT NOT NULL,
    "proof" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expire" TEXT NOT NULL
);
INSERT INTO "new_Bans" ("characters", "createdAt", "expire", "id", "player", "proof", "reason", "world") SELECT "characters", "createdAt", "expire", "id", "player", "proof", "reason", "world" FROM "Bans";
DROP TABLE "Bans";
ALTER TABLE "new_Bans" RENAME TO "Bans";
CREATE UNIQUE INDEX "Bans_player_key" ON "Bans"("player");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

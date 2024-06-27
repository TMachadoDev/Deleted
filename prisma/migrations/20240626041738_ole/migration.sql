-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Accounts" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL
);
INSERT INTO "new_Accounts" ("name", "role") SELECT "name", "role" FROM "Accounts";
DROP TABLE "Accounts";
ALTER TABLE "new_Accounts" RENAME TO "Accounts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateTable
CREATE TABLE "Bans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "player" TEXT NOT NULL,
    "world" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "characters" TEXT NOT NULL,
    "proof" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expire" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Expired" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "player" TEXT NOT NULL,
    "world" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "characters" TEXT NOT NULL,
    "proof" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "deletedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Fdp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "player" TEXT NOT NULL,
    "world" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "characters" TEXT NOT NULL,
    "proof" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DeletedPlayers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "player" TEXT NOT NULL,
    "world" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "characters" TEXT NOT NULL,
    "proof" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Bans_player_key" ON "Bans"("player");

-- CreateIndex
CREATE UNIQUE INDEX "Fdp_player_key" ON "Fdp"("player");

-- CreateIndex
CREATE UNIQUE INDEX "DeletedPlayers_player_key" ON "DeletedPlayers"("player");

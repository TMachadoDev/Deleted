/*
  Warnings:

  - A unique constraint covering the columns `[player]` on the table `Bans` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[player]` on the table `DeletedPlayers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[player]` on the table `Expired` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[player]` on the table `Fdp` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bans_player_key" ON "Bans"("player");

-- CreateIndex
CREATE UNIQUE INDEX "DeletedPlayers_player_key" ON "DeletedPlayers"("player");

-- CreateIndex
CREATE UNIQUE INDEX "Expired_player_key" ON "Expired"("player");

-- CreateIndex
CREATE UNIQUE INDEX "Fdp_player_key" ON "Fdp"("player");

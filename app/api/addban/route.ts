import { NextResponse } from "next/server";
import { prisma } from "@/app/services/prisma";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// Define setTimeout_ function here

function setTimeout_(
  fn: () => void,
  delay: number,
  ...args: any[]
): NodeJS.Timeout {
  const maxDelay = Math.pow(2, 31) - 1;

  if (delay > maxDelay) {
    setTimeout(function () {
      //@ts-ignore
      setTimeout_.apply(undefined, [fn, delay - maxDelay].concat(args));
    }, maxDelay);

    //@ts-ignore
    return;
  }

  //@ts-ignore
  return setTimeout(fn, delay, ...args);
}

interface Props {
  player: string;
  world: string;
  reason: string;
  characters: string;
  proof: string;
  duration: number; // assuming duration is in seconds
}

export async function POST(req: Request) {
  try {
    const { player, world, reason, characters, proof, duration }: Props =
      await req.json();

    if (!player || !world || !reason || !characters || !proof || !duration) {
      return NextResponse.json(
        { error: "Missing Information" },
        {
          status: 405,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", // Adjust the origin as necessary
            "Access-Control-Allow-Methods": "GET,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    }

    const now = dayjs().tz("America/Sao_Paulo");
    const expireDate = now.add(duration, "second");
    const expireDateUnix = expireDate.unix();

    const newBan = await prisma.bans.create({
      data: {
        player,
        world,
        reason,
        characters,
        proof,
        expire: expireDateUnix, // Store as Unix timestamp
      },
    });

    const webhookUrl =
      "https://discord.com/api/webhooks/1255950802783047764/cb4cSLryleu9_o7xyIrOaoAFvtdOkkLZHW5MBxvunilOIeMobSpVS5ovIE3Ea6ulkoba";
    await axios.post(webhookUrl, {
      username: "Gestor de Bans",
      embeds: [
        {
          title: "Ban Adicionado",
          color: 15258703,
          fields: [
            { name: "Player", value: `\`${player}\``, inline: false },
            { name: "Mundo", value: `\`${world}\``, inline: false },
            { name: "Motivo", value: `\`${reason}\``, inline: false },
            {
              name: "Outros Personagens",
              value: `\`${characters}\``,
              inline: false,
            },
          ],
          footer: {
            text: "Desenvolvido por machado.dev",
          },
        },
      ],
    });

    if (duration > 0) {
      const nowUnix = now.unix();
      const timeUntilExpire = (expireDateUnix - nowUnix) * 1000;

      setTimeout_(async () => {
        try {
          const webhookUrl =
            "https://discord.com/api/webhooks/1254869153194446882/oNBqNtbdqb5jVtQzTy6xiXzwy0PMdEq5GsQUm1PYe1Km8IO5jsQH-0fIC-Ltyn1LtinB";
          await axios.post(webhookUrl, {
            username: "Gestor de Bans",
            embeds: [
              {
                title: "Ban Expirado",
                color: 15258703,
                fields: [
                  { name: "Player", value: `\`${player}\``, inline: false },
                  { name: "Mundo", value: `\`${world}\``, inline: false },
                  { name: "Motivo", value: `\`${reason}\``, inline: false },
                  {
                    name: "Outros Personagens",
                    value: `\`${characters}\``,
                    inline: false,
                  },
                ],
                footer: {
                  text: "Desenvolvido por machado.dev",
                },
              },
            ],
          });

          await prisma.expired.create({
            data: {
              player,
              world,
              reason,
              characters,
              proof,
              createdAt: newBan.createdAt,
            },
          });

          await prisma.bans.delete({
            where: {
              id: newBan.id,
            },
          });
        } catch (err) {
          console.error("Error in scheduled task:", err);
        }
      }, timeUntilExpire);
    }

    return NextResponse.json(
      { result: newBan },
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Adjust the origin as necessary
          "Access-Control-Allow-Methods": "GET,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("Something Went Wrong:", error);
    return NextResponse.json(
      { error: "Something went wrong while creating ban: " + error },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Adjust the origin as necessary
          "Access-Control-Allow-Methods": "GET,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }
}

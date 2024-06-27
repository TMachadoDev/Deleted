import { prisma } from '@/app/services/prisma';
import axios from 'axios';

// Define the setTimeout_ function (if not already defined)
function setTimeout_(fn: () => void, delay: number, ...args: any[]): NodeJS.Timeout {
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

const processActiveBans = async () => {
    const activeBans = await prisma.bans.findMany();

    for (const ban of activeBans) {
        const { player, world, reason, characters, expire } = ban;

        // Calculate time remaining until ban expiration
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const timeRemaining = expire - currentTime;

        // Only set the timeout if the ban has not expired yet
        if (timeRemaining > 0) {
            setTimeout_(async () => {
                await handleBanExpiration(ban);
            }, timeRemaining * 1000);
        } else {
            // Process immediately if ban has already expired
            await handleBanExpiration(ban);
        }
    }
};

const handleBanExpiration = async (ban: any) => {
    const { player, world, reason, characters, expire } = ban;
    try {
        const webhookUrl = 'https://discord.com/api/webhooks/1254869153194446882/oNBqNtbdqb5jVtQzTy6xiXzwy0PMdEq5GsQUm1PYe1Km8IO5jsQH-0fIC-Ltyn1LtinB';
        await axios.post(webhookUrl, {
            "username": "Gestor de Bans",
            "embeds": [
                {
                    "title": "Ban Expirado",
                    "color": 15258703,
                    "fields": [
                        {
                            "name": 'Player',
                            "value": '`' + player +  '`',
                            "inline": false,
                        },
                        {
                            "name": 'World',
                            "value": '`' + world +  '`',
                            "inline": false,
                        },
                        {
                            "name": 'Motivo',
                            "value": '`' + reason +  '`',
                            "inline": false,
                        },
                        {
                            "name": 'Characters',
                            "value": '`' + characters +  '`',
                            "inline": false,
                        }
                    ],
                    "footer": {
                        "text": "Developed by machado.dev",
                    }
                }
            ]
        });

        // Check if the ban record already exists in the expired table
        const existingBan = await prisma.expired.findMany({
            where: {
                player: ban.player,
            },
        });

        if (!existingBan || existingBan.length === 0) {
            await prisma.expired.create({
                data: {
                    player,
                    world,
                    reason,
                    proof: 'Impossivel acessar',
                    characters,
                    createdAt: new Date(expire * 1000),
                }
            });

            await prisma.bans.deleteMany({
                where: {
                    player: player,
                }
            });
        }
    } catch (err) {
        console.error('Error processing expired ban:', err);
    }
};

export async function register() {
    processActiveBans();
}

import {prisma} from '@/app/services/prisma';
import axios from 'axios'



const processActiveBans = async () => {
    const activeBans = await prisma.bans.findMany();

    for (const ban of activeBans) {
        const { player, world, reason, characters, expire } = ban;

        // Calcular o tempo restante até a expiração do banimento
        const currentTime = Math.floor(Date.now() / 1000); // Tempo atual em segundos
        const timeRemaining = expire - currentTime;

        // Apenas configurar o timeout se o banimento ainda não tiver expirado
        if (timeRemaining > 0) {
            setTimeout(async () => {
                await handleBanExpiration(ban);
            }, timeRemaining * 1000);
        } else {
            // Processar imediatamente os banimentos já expirados
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

        if (!existingBan) {
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
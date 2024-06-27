import { NextResponse as res } from "next/server";
import { prisma } from '@/app/services/prisma';
export async function POST(req: Request) {

    const { player } = await req.json();

    try {

        if (!player) {
             return res.json({ message: 'Missing Information' }, { status: 405, headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust the origin as necessary
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }, })
            
        }

        const result = await prisma.bans.delete({
            where: {
                id: player
            }
        });

        if (!result) {
               return res.json({ message: 'Character not Found' }, { status: 404, headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }, })
        
            
        }

        await prisma.deletedPlayers.create({
            data: {
                player: result.player,
                characters: result.characters,
                world: result.world,
                proof: result.proof,
                reason: result.reason,
                createdAt: result.createdAt
            }
        })


        return res.json({ message: 'ok' }, { status: 200, headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust the origin as necessary
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }, })
        
        
    } catch (error) {
        return res.json({ message: 'something went wrong' + error}, {status: 500, headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust the origin as necessary
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },})
    }
}

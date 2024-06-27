import { NextResponse } from 'next/server';
import { prisma } from '@/app/services/prisma';
import { api } from '@/app/services/api';



interface Props {
    player: string;
    world: string;
    proof: string;
    reason: string;
    characters: string;
    duration: number; // assuming duration is in seconds
}

export async function POST(req: Request) {
    try {
        const { player, duration }: Props = await req.json();

        if (!player || !duration) {
            return NextResponse.json({ error: 'Missing Information' }, { status: 405,  headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust the origin as necessary
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }, });
        }

        const result = await prisma.expired.delete({
            where: {
                id: player
            }
        })

        const newresult = await api.post('/addban', {
            player: result.player,
            world: result.world,
            duration: duration,
            proof: result.proof,
            reason: result.reason,
            characters: result.characters,

        })
        
        return NextResponse.json({
            newresult,
         }, { status: 201,  headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust the origin as necessary
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }, });
    } catch (error) {
        console.error('Something Went Wrong:', error);
        return NextResponse.json({ error: 'Something went wrong while creating ban: ' + error }, { status: 500, headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust the origin as necessary
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }, });
    }
}
 
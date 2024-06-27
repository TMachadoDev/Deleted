import { NextResponse } from 'next/server';
import { prisma } from '@/app/services/prisma';

interface Props {
    player: string; 
    world: string;
    reason: string;
    characters: string;
    proof: string;
}

export async function POST(req: Request) {
    try {
        const { player, world, reason, characters, proof }: Props = await req.json();

        if (!player || !world || !reason || !characters || !proof) {
            return NextResponse.json({ error: 'Missing Information' }, { status: 405, headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust the origin as necessary
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }, });
        }

        const result = await prisma.fdp.create({
            data: {
                player,  
                world,
                reason,
                characters,
                proof,

            }
        });

        return NextResponse.json({ result }, { status: 201, headers: {
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

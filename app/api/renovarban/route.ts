import { NextResponse } from 'next/server';
import { prisma } from '@/app/services/prisma';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

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

        const now = dayjs().tz('America/Sao_Paulo');
        const expireDate = now.add(duration, 'second');
        const expireDateUnix = expireDate.unix();

        const result = await prisma.expired.findFirst({
            where: {
                id: player
            }
        })

        if (!result) {
            return NextResponse.json({ message: 'Character Not Found' }, { status: 404,  headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }, });
            
        }

        const newBan = await prisma.bans.create({
             data: {
                 player: result?.player,
                 world: result.world ,
                 reason: result?.reason,
                 characters: result?.characters,
                 proof: result?.proof,
                 expire: expireDateUnix,
             }
        });


        return NextResponse.json({
            result, expireDateUnix, expireDate, duration, now
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
 
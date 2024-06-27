import { NextResponse as res } from "next/server";
import { prisma } from '@/app/services/prisma';
export async function POST(req: Request) {

    const { name } = await req.json();

    try {

        const result = await prisma.accounts.deleteMany({ where: { name } });

        return res.json({ result }, { status: 200, headers: {
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

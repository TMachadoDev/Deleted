import { NextResponse } from 'next/server';
import { prisma } from '@/app/services/prisma';

export async function POST(req: Request) {
    try {
        const { name, role } = await req.json();

        if (!name || !role) {
            return NextResponse.json({ error: 'Missing Information' }, {
                status: 405,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*', // Adjust the origin as necessary
                    'Access-Control-Allow-Methods': 'GET,OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            });
        }

        // Create a new account
        const result = await prisma.accounts.create({
            data: {
                name: name,
                role: role
            }
        });

        return NextResponse.json({
            result
        }, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Adjust the origin as necessary
                'Access-Control-Allow-Methods': 'GET,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: 'Something went wrong while: ' + error }, {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Adjust the origin as necessary
                'Access-Control-Allow-Methods': 'GET,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }
}

import { NextResponse } from 'next/server';
import cheerio from 'cheerio';

interface CharacterProps {
    name: string;
    world: string;
}

export async function POST(req: Request) {
    try {
        const { name } = await req.json();

        if (!name || typeof name !== 'string') {
            return NextResponse.json({ error: 'Character name is required' }, { status: 405 });
        }

        const url = `https://www.exaioros.com/?subtopic=characters&name=${encodeURIComponent(name)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch character information');
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const table = $('table[border="0"][cellspacing="1"][cellpadding="4"][width="100%"]');
        
        const characterNameElement = table.find('tr').eq(1).find('td').eq(1);
        const characterName = characterNameElement.text().trim();

        if (!characterName || characterName === "Name:") {
            return NextResponse.json({ error: 'Character not found' }, {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            });
        }

        // Determine character online status by name color
        const nameColor = characterNameElement.find('font').attr('color');
        let status = 'offline';
        if (nameColor === 'green') {
            status = 'online';
        }

        const world = table.find('tr').filter((_, el) => $(el).find('td').eq(0).text().trim() === 'World:')
            .find('td').eq(1).text().trim();

        const characters: CharacterProps[] = [];

        const charactersTable = $('table[border="0"][cellspacing="1"][cellpadding="4"][width="100%"]').filter((i, el) => {
            return $(el).find('b').first().text().trim() === 'Characters';
        });

        charactersTable.find('tr').slice(2).each((_, element) => {
            const cols = $(element).find('td');
            const charName = cols.eq(0).text().trim();
            const charWorld = cols.eq(1).text().trim();
            if (charName && charWorld) {
                characters.push({ name: charName, world: charWorld });
            }
        });

        return NextResponse.json({ characterName, world, characters, status }, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    } catch (error: any) {
        console.error('Error fetching character information:', error.message);
        return NextResponse.json({ error: 'Something went wrong while fetching character information' }, {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }
}

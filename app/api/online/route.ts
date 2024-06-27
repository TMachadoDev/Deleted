import { NextResponse } from 'next/server';
import cheerio from 'cheerio';
import { api } from '@/app/services/api';

interface CharacterProps {
    name: string;
    world: string;
    status: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: Request) {


    
    try {
        const { num } = await req.json();
        const url = 'https://www.exaioros.com/?subtopic=pokesfind&search=bylast';
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch character information');
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const nibiru: string[] = [];
        const pandora: string[] = [];
        const playersToCheck: any = new Set<string>();
     
        const rows = $('table').find('tr');

        rows.each((index, element) => {
            if (index > 0 && index <= num) { // Skip header row and limit to 10 records
                const lastPlayerUse = $(element).find('td').eq(5).text().trim();
                if (lastPlayerUse) {
                    playersToCheck.add(lastPlayerUse);
                }
            }
        });

        for (const playerName of playersToCheck) {
            try {
                const playerResponse = await api.post('/character', {
                    name: playerName
                });
                const playerData: CharacterProps = playerResponse.data;

                if (playerData.status === 'online') {
                    if (playerData.world === 'Nibiru' && !nibiru.includes(playerName)) {
                        nibiru.push(playerName);
                    } else if (playerData.world === 'Pandora' && !pandora.includes(playerName)) {
                        pandora.push(playerName);
                    }
                }
            } catch (error: any) {
                console.error(`Request failed for player ${playerName}: ${error.message}`);
            }

        }

        return NextResponse.json({ nibiru, pandora }, { status: 200, headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust the origin as necessary
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }, });
    } catch (error) {
        console.error('Error fetching character information:', error);
        return NextResponse.json({ error: 'Something went wrong while fetching character information' }, { status: 500, headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust the origin as necessary
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }, });
    }
}

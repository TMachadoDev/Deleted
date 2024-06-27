// Importar o Prisma Client
// Função para tratar a requisição GET
import { NextResponse as res } from "next/server";
import { prisma } from '@/app/services/prisma';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// Função para formatar timestamp UNIX para a data no formato YYYY-MM-DD
function formatDate(timestamp: number, tz: string) {
  return dayjs.unix(timestamp).tz(tz).format('YYYY-MM-DD');
}

// Função para obter todos os bans que expiram no mesmo dia
async function getBansExpiringOnSameDay() {
  const timezone = 'America/Sao_Paulo'; // Substitua pelo timezone desejado

  // Obter todos os bans do Prisma
  const bans = await prisma.bans.findMany();

  // Criar um mapa para armazenar bans por data de expiração
  const bansByExpiryDate = new Map();

  bans.forEach(ban => {
    const expiryDate = formatDate(ban.expire, timezone);

    if (!bansByExpiryDate.has(expiryDate)) {
      bansByExpiryDate.set(expiryDate, []);
    }

    bansByExpiryDate.get(expiryDate).push(ban);
  });

  // Filtrar os bans que expiram no mesmo dia
  const result: { expiryDate: any; bans: any; }[] = [];
  bansByExpiryDate.forEach((bans, expiryDate) => {
    if (bans.length > 1) {
      result.push({ expiryDate, bans });
    }
  });

  return result;
}



export async function GET() {
  try {
    const result = await getBansExpiringOnSameDay();

    return res.json({ result }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust the origin as necessary
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error: any) {
    return res.json({ message: 'something went wrong: ' + error.message }, {
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

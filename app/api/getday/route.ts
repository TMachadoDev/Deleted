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

// Função para obter todos os bans que expiram até o fim do dia (no timezone especificado)
async function getBansExpiringToday() {
  const timezone = 'America/Sao_Paulo'; // Fuso horário do Brasil

  // Data de hoje no fuso horário do Brasil
  const today = dayjs().tz(timezone);

  // Data do final do dia (23:59:59) no fuso horário do Brasil
  const endOfDay = today.endOf('day');

  // Obter todos os bans do Prisma que expiram até o final do dia de hoje
  const bans = await prisma.bans.findMany({
    where: {
      expire: {
        lte: endOfDay.unix(), // Considerar bans que expirem até o final do dia de hoje
      }
    }
  });

  return bans;
}

export async function GET() {
  try {
    const bans = await getBansExpiringToday();

    return res.json({ bans }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Ajuste conforme necessário
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error: any) {
    return res.json({ message: 'Something went wrong: ' + error.message }, {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Ajuste conforme necessário
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
}

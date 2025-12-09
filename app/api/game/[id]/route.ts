import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const game = await Game.findById(params.id);
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 });
  }
}

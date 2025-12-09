import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { playerId } = await request.json();

    const game = await Game.findById(params.id);
    if (!game || game.status !== 'active') {
      return NextResponse.json({ error: 'Game not found or not active' }, { status: 400 });
    }

    const currentPlayer = game.players[game.currentPlayerIndex];
    if (currentPlayer.id !== playerId) {
      return NextResponse.json({ error: 'Not your turn' }, { status: 400 });
    }

    // Check if draw pile is empty and reshuffle if needed
    if (game.drawPile.length === 0) {
      // Reshuffle played cards (except current card) back into draw pile
      if (game.playedCards && game.playedCards.length > 0) {
        // Shuffle the played cards
        const shuffled = [...game.playedCards].sort(() => Math.random() - 0.5);
        game.drawPile = shuffled;
        game.playedCards = [];
        console.log(`Reshuffled ${shuffled.length} played cards back into draw pile`);
      } else {
        // No cards left at all - game is stuck
        return NextResponse.json({ error: 'No cards available to draw' }, { status: 400 });
      }
    }

    // Pick up a card from draw pile
    const drawnCard = game.drawPile.shift();
    if (drawnCard) {
      currentPlayer.cards.push(drawnCard);
    }

    // Move to next player
    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;

    await game.save();
    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to pickup card' }, { status: 500 });
  }
}

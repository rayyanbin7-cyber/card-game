import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';
import Card from '@/models/Card';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const oldGame = await Game.findById(params.id);
    if (!oldGame) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const playerNames = oldGame.players.map((p: any) => p.name);
    const cardsPerPlayer = 5;
    const numPlayers = playerNames.length;

    const allCards = await Card.find({});
    if (allCards.length < cardsPerPlayer * numPlayers + 1) {
      return NextResponse.json({ error: 'Not enough cards in database' }, { status: 400 });
    }

    // Shuffle cards
    const shuffled = [...allCards].sort(() => Math.random() - 0.5);
    
    // Deal cards to players
    const players = playerNames.map((name: string, index: number) => ({
      id: `player-${index}`,
      name,
      cards: shuffled.slice(index * cardsPerPlayer, (index + 1) * cardsPerPlayer).map(c => c._id.toString())
    }));

    // Set current card (skip wild cards for starting card)
    let currentCardIndex = cardsPerPlayer * numPlayers;
    while (shuffled[currentCardIndex]?.isWildCard && currentCardIndex < shuffled.length - 1) {
      currentCardIndex++;
    }
    
    const currentCard = shuffled[currentCardIndex]._id.toString();
    const currentCardData = shuffled[currentCardIndex];
    
    // Create draw pile with remaining cards
    const drawPile = shuffled.slice(cardsPerPlayer * numPlayers + 1).map(c => c._id.toString());

    // Update the game
    oldGame.players = players;
    oldGame.currentCard = currentCard;
    oldGame.currentColors = currentCardData.colors;
    oldGame.currentPlayerIndex = 0;
    oldGame.drawPile = drawPile;
    oldGame.playedCards = [];
    oldGame.status = 'active';
    oldGame.winner = undefined;

    await oldGame.save();

    return NextResponse.json(oldGame);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to restart game' }, { status: 500 });
  }
}

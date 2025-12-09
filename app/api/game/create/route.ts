import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';
import Card from '@/models/Card';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { playerNames, cardsPerPlayer = 5 } = await request.json();

    if (!playerNames || playerNames.length < 2 || playerNames.length > 4) {
      return NextResponse.json({ error: '2-4 players required' }, { status: 400 });
    }

    const allCards = await Card.find({});
    if (allCards.length < cardsPerPlayer * 4 + 1) {
      return NextResponse.json({ error: 'Not enough cards in database' }, { status: 400 });
    }

    // Shuffle cards
    const shuffled = [...allCards].sort(() => Math.random() - 0.5);
    
    // Deal cards to players (5 cards each)
    const numPlayers = playerNames.length;
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

    const game = await Game.create({
      players,
      currentCard,
      currentColors: currentCardData.colors,
      currentPlayerIndex: 0,
      drawPile,
      playedCards: [],
      status: 'active'
    });

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';
import Card from '@/models/Card';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { playerId, cardId, selectedColor } = await request.json();

    const game = await Game.findById(params.id);
    if (!game || game.status !== 'active') {
      return NextResponse.json({ error: 'Game not found or not active' }, { status: 400 });
    }

    const currentPlayer = game.players[game.currentPlayerIndex];
    if (currentPlayer.id !== playerId) {
      return NextResponse.json({ error: 'Not your turn' }, { status: 400 });
    }

    // Get card details
    const playedCard = await Card.findById(cardId);

    if (!playedCard) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Check if card can be played
    if (!playedCard.isWildCard) {
      // Regular card: must share at least one color with current colors
      const hasMatchingColor = playedCard.colors.some((color: string) => 
        game.currentColors.includes(color)
      );
      
      if (!hasMatchingColor) {
        return NextResponse.json({ error: 'Card colors do not match any current colors' }, { status: 400 });
      }
    }

    // Remove card from player's hand
    currentPlayer.cards = currentPlayer.cards.filter((c: string) => c !== cardId);

    // Add previous current card to played cards pile (for reshuffling later)
    if (game.currentCard && game.currentCard !== cardId) {
      if (!game.playedCards) {
        game.playedCards = [];
      }
      game.playedCards.push(game.currentCard);
    }

    // Check if player won
    if (currentPlayer.cards.length === 0) {
      game.status = 'finished';
      game.winner = currentPlayer.name;
    } else {
      // Move to next player
      game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
    }

    // Update current card and colors
    game.currentCard = cardId;
    
    if (playedCard.isWildCard && selectedColor) {
      // Wild card: player chooses the color
      game.currentColors = [selectedColor];
    } else {
      // Regular card: use its colors
      game.currentColors = playedCard.colors;
    }

    await game.save();
    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to play card' }, { status: 500 });
  }
}

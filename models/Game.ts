import mongoose, { Schema, model, models } from 'mongoose';

export interface IGame {
  _id?: string;
  players: {
    id: string;
    name: string;
    cards: string[];
  }[];
  currentCard: string;
  currentColors: string[]; // Active colors that can be played
  currentPlayerIndex: number;
  drawPile: string[]; // Remaining cards to draw from
  playedCards: string[]; // Cards that have been played (for reshuffling)
  status: 'waiting' | 'active' | 'finished';
  winner?: string;
  createdAt: Date;
}

const GameSchema = new Schema<IGame>({
  players: [{
    id: String,
    name: String,
    cards: [String]
  }],
  currentCard: { type: String, required: true },
  currentColors: { type: [String], required: true },
  currentPlayerIndex: { type: Number, default: 0 },
  drawPile: { type: [String], default: [] },
  playedCards: { type: [String], default: [] },
  status: { type: String, enum: ['waiting', 'active', 'finished'], default: 'waiting' },
  winner: String,
  createdAt: { type: Date, default: Date.now }
});

export default models.Game || model<IGame>('Game', GameSchema);

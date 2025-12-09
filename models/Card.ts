import mongoose, { Schema, model, models } from 'mongoose';

export interface ICard {
  _id?: string;
  name: string;
  company: string;
  colors: string[]; // Multiple colors now
  position?: string;
  isWildCard?: boolean; // Special wild card
}

const CardSchema = new Schema<ICard>({
  name: { type: String, required: true },
  company: { type: String, required: true },
  colors: { type: [String], required: true },
  position: { type: String },
  isWildCard: { type: Boolean, default: false }
});

export default models.Card || model<ICard>('Card', CardSchema);

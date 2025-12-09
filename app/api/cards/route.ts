import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Card from '@/models/Card';

export async function GET() {
  try {
    await dbConnect();
    const cards = await Card.find({});
    return NextResponse.json(cards);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const card = await Card.create(body);
    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}

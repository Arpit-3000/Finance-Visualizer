import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Transaction } from "@/models/transaction";

export async function GET() {
  await connectDB();
  const transactions = await Transaction.find();
  return NextResponse.json(transactions);
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const transaction = await Transaction.create(body);
  return NextResponse.json(transaction);
}

export async function DELETE(request: Request) {
  await connectDB();
  const { id } = await request.json();
  await Transaction.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  await connectDB();
  const { _id, amount, date, description } = await request.json();
  const updated = await Transaction.findByIdAndUpdate(
    _id,
    { amount, date, description },
    { new: true }
  );
  return NextResponse.json(updated);
}

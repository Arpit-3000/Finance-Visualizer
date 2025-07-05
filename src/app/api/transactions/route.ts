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
  const { amount, date, description, category } = body;

  if (!amount || !date || !description || !category?.trim()) {
    return NextResponse.json(
      { error: "All fields including category are required" },
      { status: 400 }
    );
  }

  const transaction = await Transaction.create({ amount, date, description, category });
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
  const { _id, amount, date, description, category } = await request.json(); 
  const updated = await Transaction.findByIdAndUpdate(
    _id,
    { amount, date, description, category }, 
    { new: true }
  );
  return NextResponse.json(updated);
}


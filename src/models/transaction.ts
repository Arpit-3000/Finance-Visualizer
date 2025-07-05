import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
});

export const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);

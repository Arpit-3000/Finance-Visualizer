"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TransactionForm({ onAdd }: { onAdd: () => void }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0 || !date || !description.trim()) {
      return toast.error("All fields are required and amount must be positive");
    }

    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), date, description }),
    });
    toast.success("Transaction Added");
    setAmount("");
    setDate("");
    setDescription("");
    onAdd();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white shadow-md rounded-xl border">
  <h2 className="text-xl font-bold text-indigo-600">Add Transaction</h2>
      <Input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
      <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <Input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
       <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Submit</Button>
    </form>
  );
}
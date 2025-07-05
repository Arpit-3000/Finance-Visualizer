"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const predefinedCategories = [
  "Food", "Travel", "Shopping", "Rent", "Groceries", "Utilities", "Health", "Education", "Entertainment", "Savings", "Other"
];

export default function TransactionForm({ onAdd }: { onAdd: () => void }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date || !description.trim() || !category) {
      return toast.error("All fields are required");
    }
   const selectedDate = new Date(date);
   const today = new Date();
   today.setHours(0, 0, 0, 0); 

  if (selectedDate > today) {
    return toast.error("Date cannot be in the future");
  }


    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        date,
        description,
        category
      }),
    });

    toast.success("Transaction Added");
    setAmount(""); setDate(""); setDescription(""); setCategory("");
    onAdd();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white w-full rounded-2xl p-6 shadow-md border border-zinc-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">➕ Add New Transaction</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input type="number" placeholder="Amount (₹)" value={amount} onChange={e => setAmount(e.target.value)} />
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <Input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <select className="w-full p-2 border rounded-md text-gray-700" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {predefinedCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <Button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3">Add Transaction</Button>
    </form>
  );
}

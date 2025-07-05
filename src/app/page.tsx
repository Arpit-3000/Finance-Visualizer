"use client";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { useState } from "react";

export default function Home() {
  const [reload, setReload] = useState(false);

  const handleAdd = () => {
    setReload(!reload);
  };

  return (
    <main className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">Personal Finance Tracker</h1>
        <TransactionForm onAdd={handleAdd} />
        <TransactionList reload={reload} />
      </div>
    </main>
  );
}

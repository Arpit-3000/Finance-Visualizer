"use client";
import { useState } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";

export default function Home() {
  const [reload, setReload] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-tr from-slate-50 to-indigo-100 py-10 px-6 sm:px-8 md:px-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-indigo-700 mb-10 tracking-tight">
        💰 Personal Finance Tracker
      </h1>

      <div className="w-full max-w-[1600px] mx-auto space-y-10">
        <TransactionForm onAdd={() => setReload(!reload)} />
        <TransactionList reload={reload} />
      </div>
    </main>
  );
}

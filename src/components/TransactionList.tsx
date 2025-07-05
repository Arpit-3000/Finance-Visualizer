"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { toast } from "sonner";

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

const COLORS = ["#6366f1", "#22c55e", "#fbbf24", "#f97316", "#06b6d4"];

const predefinedCategories = [
  "Food", "Travel", "Shopping", "Rent", "Groceries", "Utilities", "Health", "Education", "Entertainment", "Savings", "Other"
];

export default function TransactionList({ reload }: { reload: boolean }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [edit, setEdit] = useState<Transaction | null>(null);

  useEffect(() => {
    fetch("/api/transactions")
      .then(res => res.json())
      .then(setTransactions);
  }, [reload]);

  const handleDelete = async (id: string) => {
    const res = await fetch("/api/transactions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setTransactions(transactions.filter(t => t._id !== id));
      toast.success("Transaction deleted");
    } else {
      toast.error("Failed to delete");
    }
  };

  const handleUpdate = async () => {
    if (!edit || !edit.amount || !edit.date || !edit.description.trim() || !edit.category) {
      toast.error("All fields are required");
      return;
    }
    const res = await fetch("/api/transactions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(edit),
    });
    if (res.ok) {
      toast.success("Transaction updated");
      setEdit(null);
      const updated = await fetch("/api/transactions");
      setTransactions(await updated.json());
    } else {
      toast.error("Failed to update");
    }
  };

  const monthlyData = transactions.reduce((acc: any[], t) => {
    const month = new Date(t.date).toLocaleString("default", { month: "short" });
    const existing = acc.find(m => m.month === month);
    if (existing) existing.total += t.amount;
    else acc.push({ month, total: t.amount });
    return acc;
  }, []);

  const categoryData = transactions.reduce((acc: any[], t) => {
    const existing = acc.find(c => c.name === t.category);
    if (existing) existing.value += t.amount;
    else acc.push({ name: t.category, value: t.amount });
    return acc;
  }, []);

  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white rounded-xl shadow-md border border-zinc-200 p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-semibold">
        <div className="bg-indigo-100 text-indigo-700 px-4 py-3 rounded-lg shadow-sm">Total Spent: ₹{totalExpenses}</div>
        <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg shadow-sm">Categories: {categoryData.length}</div>
        <div className="bg-yellow-100 text-yellow-700 px-4 py-3 rounded-lg shadow-sm">Transactions: {transactions.length}</div>
      </div>

      <h3 className="text-xl font-semibold text-gray-700">Transactions History</h3>
      <ul className="space-y-3">
        {recentTransactions.map(t => (
          <li key={t._id} className="border rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm text-gray-700 w-full">
              <p>
                <span className="font-medium text-gray-600">Price: </span>
                ₹{t.amount}
              </p>
              <p>
                <span className="font-medium text-gray-600">Date: </span>
                {new Date(t.date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium text-gray-600">Description: </span>
                {t.description}
              </p>
              <p>
                <span className="font-medium text-gray-600">Category: </span>
                {t.category ? (
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full ml-1">
                    {t.category}
                  </span>
                ) : (
                  <span className="inline-block bg-gray-100 text-gray-500 text-xs font-medium px-2 py-0.5 rounded-full italic ml-1">
                    Uncategorized
                  </span>
                )}
              </p>
            </div>


            <div className="flex gap-2 mt-3 sm:mt-0">
              <Button size="sm" variant="outline" onClick={() => setEdit({ ...t })}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(t._id)}>Delete</Button>
            </div>
          </li>
        ))}
      </ul>

      {edit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl space-y-4 w-[90%] max-w-md">
            <h2 className="text-lg font-bold">Edit Transaction</h2>
            <Input type="number" value={edit.amount} onChange={e => setEdit({ ...edit, amount: Number(e.target.value) })} />
            <Input type="date" value={edit.date} onChange={e => setEdit({ ...edit, date: e.target.value })} />
            <Input value={edit.description} onChange={e => setEdit({ ...edit, description: e.target.value })} />
            <select className="w-full p-2 border rounded-md" value={edit.category} onChange={e => setEdit({ ...edit, category: e.target.value })}>
              <option value="">Select Category</option>
              {predefinedCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setEdit(null)}>Cancel</Button>
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={handleUpdate}>Update</Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="h-64">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Monthly Expenses</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-64">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

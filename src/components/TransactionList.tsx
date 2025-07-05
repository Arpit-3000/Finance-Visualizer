"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export default function TransactionList({ reload }: { reload: boolean }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [edit, setEdit] = useState<any | null>(null);

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
    if (!edit.amount || !edit.date || !edit.description) {
      toast.error("All fields are required");
      return;
    }
    const res = await fetch("/api/transactions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(edit),
    });
    if (res.ok) {
      toast.success("Transaction Updated");
      setEdit(null);
      const res = await fetch("/api/transactions");
      setTransactions(await res.json());
    } else {
      toast.error("Failed to update transaction");
    }
  };

  const monthlyData = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString("default", { month: "short" });
    const entry = acc.find((a: any) => a.month === month);
    if (entry) entry.total += t.amount;
    else acc.push({ month, total: t.amount });
    return acc;
  }, [] as any[]);

  return (
    <div className="space-y-6 bg-white border rounded-md p-4">
      <h2 className="text-lg font-semibold">Transaction History</h2>
      <ul className="space-y-2">
        {transactions.map(t => (
          <li key={t._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm hover:bg-gray-100 transition">
            <span className="text-gray-800 text-sm">
              {t.date} — ₹{t.amount} — {t.description}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="text-blue-600 border-blue-600"
                onClick={() => setEdit({ ...t })}
              >
                Edit
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(t._id)}>Delete</Button>
            </div>
          </li>
        ))}
      </ul>

      {edit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md space-y-4 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800">Edit Transaction</h2>
            <Input
              type="number"
              value={edit.amount}
              onChange={e => setEdit({ ...edit, amount: Number(e.target.value) })}
            />
            <Input
              type="date"
              value={edit.date}
              onChange={e => setEdit({ ...edit, date: e.target.value })}
            />
            <Input
              value={edit.description}
              onChange={e => setEdit({ ...edit, description: e.target.value })}
            />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setEdit(null)}>Cancel</Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleUpdate}>Save</Button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold">Monthly Expenses</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

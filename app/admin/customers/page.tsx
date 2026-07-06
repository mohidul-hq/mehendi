"use client";

import { useEffect, useState } from "react";
import { Phone, Search } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  async function load(q = "") {
    setLoading(true);
    try {
      const url = `/api/customers${q ? `?search=${encodeURIComponent(q)}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      setCustomers(data.customers || []);
      setTotal(data.total || 0);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    load(search);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-burgundy-900">Customers</h1>
          <p className="text-gray-400 text-sm mt-1">{total} total customers</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            className="input pl-10"
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary px-5">Search</button>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="skeleton h-12 rounded-xl" />)}
          </div>
        ) : customers.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            {search ? "No customers found for this search." : "No customers yet. They appear automatically from bookings."}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-400 tracking-wide">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Joined</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {customers.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                      <td className="px-4 py-3 text-gray-600">{c.phone}</td>
                      <td className="px-4 py-3 text-gray-400">{c.email || "—"}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {c.createdAt ? format(new Date(c.createdAt), "MMM d, yyyy") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`tel:${c.phone}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors"
                        >
                          <Phone size={12} /> Call
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-50">
              {customers.map((c) => (
                <div key={c._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-gray-900">{c.name}</div>
                      <div className="text-sm text-gray-600">{c.phone}</div>
                    </div>
                    <a
                      href={`tel:${c.phone}`}
                      className="inline-flex items-center justify-center p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      <Phone size={16} />
                    </a>
                  </div>
                  {c.email && <div className="text-xs text-gray-400 mb-1">{c.email}</div>}
                  <div className="text-xs text-gray-400">
                    Joined {c.createdAt ? format(new Date(c.createdAt), "MMM d, yyyy") : "—"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

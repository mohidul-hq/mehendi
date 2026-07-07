"use client";

import { useState, useEffect } from "react";
import { Shield, Trash2, Key, UserPlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

interface AdminUser {
  _id: string;
  email: string;
  createdAt: string;
}

export default function AdminsPage() {
  const { data: session } = useSession();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // New Admin Form State
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);

  // Password Update Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [updatePassword, setUpdatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin/admins");
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.admins || []);
      }
    } catch (error) {
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newPassword) {
      toast.error("Email and password are required");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, password: newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Admin created successfully");
        setNewEmail("");
        setNewPassword("");
      } else {
        toast.error(data.error || "Failed to create admin");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAdmin = async (id: string, email: string) => {
    if (session?.user?.email === email) {
      toast.error("You cannot delete your own account");
      return;
    }

    if (!confirm(`Are you sure you want to delete the admin ${email}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/admins/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Admin deleted");
        setAdmins(admins.filter((a) => a._id !== id));
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete admin");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (updatePassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    if (updatePassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch("/api/admin/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword: updatePassword,
        }),
      });

      if (res.ok) {
        toast.success("Password updated successfully");
        setCurrentPassword("");
        setUpdatePassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update password");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-gold-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600">
          <Shield size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-playfair font-bold text-burgundy-900">
            Admin Management
          </h1>
          <p className="text-gray-500 mt-1">Manage administrators and update your password.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: List of Admins & Add New */}
        <div className="space-y-8">
          {/* Add New Admin */}
          <div className="card">
            <h2 className="text-xl font-playfair font-bold text-burgundy-900 mb-6 flex items-center gap-2">
              <UserPlus size={20} className="text-gold-600" />
              Add New Admin
            </h2>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  className="input"
                  placeholder="admin@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={creating}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {creating ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
                Create Admin
              </button>
            </form>
          </div>

          {/* List of Admins */}
          <div className="card">
            <h2 className="text-xl font-playfair font-bold text-burgundy-900 mb-6 flex items-center gap-2">
              <Shield size={20} className="text-gold-600" />
              Current Administrators
            </h2>
            <div className="space-y-4">
              {admins.map((admin) => (
                <div key={admin._id} className="flex items-center justify-between p-4 border rounded-xl hover:border-gold-300 transition-colors">
                  <div>
                    <div className="font-semibold text-burgundy-900">{admin.email}</div>
                    <div className="text-xs text-gray-500">
                      Added {new Date(admin.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {session?.user?.email !== admin.email && (
                    <button
                      onClick={() => handleDeleteAdmin(admin._id, admin.email)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Admin"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  {session?.user?.email === admin.email && (
                    <span className="text-xs bg-gold-100 text-gold-800 px-2 py-1 rounded-full font-medium">
                      You
                    </span>
                  )}
                </div>
              ))}
              {admins.length === 0 && (
                <div className="text-center text-gray-500 py-4">No admins found</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Update Password */}
        <div className="space-y-8">
          <div className="card border-t-4 border-t-gold-500">
            <h2 className="text-xl font-playfair font-bold text-burgundy-900 mb-6 flex items-center gap-2">
              <Key size={20} className="text-gold-600" />
              Update My Password
            </h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="label">Current Password</label>
                <input
                  type="password"
                  className="input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">New Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Minimum 6 characters"
                  value={updatePassword}
                  onChange={(e) => setUpdatePassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="label">Confirm New Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="btn-outline w-full flex items-center justify-center gap-2 border-burgundy-900 text-burgundy-900 hover:bg-burgundy-900 hover:text-white"
                >
                  {updating ? <Loader2 className="animate-spin" size={18} /> : <Key size={18} />}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

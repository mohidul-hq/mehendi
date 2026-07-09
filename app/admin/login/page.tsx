"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Invalid email or password");
      setLoading(false);
    } else {
      toast.success("Welcome back!");
      window.location.href = "/admin/dashboard";
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #1a0d11 0%, #3d1420 50%, #6B2737 100%)",
      }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌿</div>
          <h1 className="font-playfair text-3xl font-bold text-white">
            Taslima Mehendi
          </h1>
          <p className="text-cream-200 text-sm mt-1">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="font-playfair text-xl font-bold text-burgundy-900 mb-6">
            Sign in to Admin
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                type="email"
                className="input"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
              />
            </div>

            <div>
              <label className="label" htmlFor="admin-password">Password</label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPw ? "text" : "password"}
                  className="input pr-12"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="admin-login-btn"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <LogIn size={18} />
              )}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-cream-300 text-xs mt-6">
          <a href="/" className="hover:text-white transition-colors">
            ← Back to public site
          </a>
        </p>
      </div>
    </div>
  );
}

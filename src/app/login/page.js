"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiArrowLeft,
  FiShield,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiLock,
  FiMail,
} from "react-icons/fi";
import { signIn, useSession } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (session?.user) {
      router.push("/admin");
    }
  }, [session, router]);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const adminEmail = (
      process.env.NEXT_PUBLIC_ADMIN_EMAIL || "mdmoynulislam.dev@gmail.com"
    ).toLowerCase();

    // Restrict login to authorized admin email only
    if (email.trim().toLowerCase() !== adminEmail) {
      setError("Access denied: Only the portfolio administrator can sign in.");
      setLoading(false);
      return;
    }

    try {
      const res = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
        callbackURL: "/admin",
      });
      if (res?.error) {
        setError(res.error.message || "Invalid credentials.");
      } else {
        router.push("/admin");
      }
    } catch (err) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0e14]">
        <div className="w-8 h-8 rounded-full border-2 border-[#2D8CFF] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gray-50/70 dark:bg-[#0c0e14] transition-colors">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2D8CFF]/15 dark:bg-[#2D8CFF]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-zinc-400 hover:text-[#2D8CFF] dark:hover:text-[#2D8CFF] transition-colors mb-6 group"
          >
            <FiArrowLeft className="text-sm transition-transform group-hover:-translate-x-1" />
            <span>Back to Portfolio</span>
          </Link>

          <div className="w-14 h-14 rounded-2xl bg-[#2D8CFF]/10 dark:bg-[#2D8CFF]/15 text-[#2D8CFF] flex items-center justify-center mx-auto mb-4 border border-[#2D8CFF]/20 shadow-lg shadow-[#2D8CFF]/10">
            <FiShield className="text-2xl" />
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Admin Portal
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
            Sign in with authorized administrator credentials
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8 backdrop-blur-2xl border border-gray-200/90 dark:border-white/10 shadow-2xl bg-white/90 dark:bg-[#12131a]/80">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2.5">
              <FiAlertCircle className="text-base flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-2">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mdmoynulislam.dev@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF]/30 focus:border-[#2D8CFF] transition-all"
                />
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF]/30 focus:border-[#2D8CFF] transition-all"
                />
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors p-1 rounded-md"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FiEyeOff className="text-lg" />
                  ) : (
                    <FiEye className="text-lg" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 mt-3 rounded-xl bg-[#2D8CFF] hover:bg-[#1f73df] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-[0_8px_20px_rgba(45,140,255,0.25)] hover:shadow-[0_12px_25px_rgba(45,140,255,0.35)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

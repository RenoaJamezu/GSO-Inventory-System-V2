import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../api/auth.api";

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await signIn(email, password);

      navigate("/inventory-accounts");
    } catch (error) {
      console.error(error);
      alert("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl"
    >
      {/* Header */}
      <div className="bg-emerald-800 p-4 flex justify-between items-center">
        <img
          src="/images/sibagat-logo.png"
          alt="Municipality Logo"
          className="h-24 w-24 object-contain"
        />
        <div className="flex flex-col items-center text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-100">
            Republic of the Philippines
          </p>

          <p className="text-sm text-emerald-100">
            Province of Agusan del Sur
          </p>

          <h1 className="text-lg font-bold tracking-wide text-white">
            MUNICIPALITY OF SIBAGAT
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-6 p-8">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Email Address
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full text-sm rounded-lg border border-slate-300 px-4 py-2 transition outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Password
          </label>

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full text-sm rounded-lg border border-slate-300 px-4 py-2 transition outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full text-sm rounded-lg bg-emerald-700 py-2 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="border-t border-slate-200 pt-5 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Authorized Personnel Only
          </p>

          <p className="mt-2 text-xs text-slate-400">
            © {new Date().getFullYear()} Municipality of Sibagat
          </p>
        </div>
      </div>
    </form>
  );
}

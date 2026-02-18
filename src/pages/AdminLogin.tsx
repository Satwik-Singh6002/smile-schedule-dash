import { useState } from "react";
import { Lock, Stethoscope, Eye, EyeOff } from "lucide-react";

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@dentacare.com" && password === "admin123") {
      onLogin();
    } else {
      setError("Invalid credentials. Try admin@dentacare.com / admin123");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--gradient-hero)" }}>
      <div className="w-full max-w-sm animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-soft"
            style={{ background: "var(--gradient-primary)" }}>
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>DentaCare Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your dashboard</p>
        </div>

        <div className="card-dental p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input className="input-dental" type="email" placeholder="admin@dentacare.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input className="input-dental pr-10" type={showPw ? "text" : "password"} placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-600 p-3 rounded-lg bg-red-50 border border-red-200">{error}</div>
            )}

            <button type="submit" className="btn-primary w-full">
              <Lock className="w-4 h-4" /> Sign In
            </button>
          </form>

          <div className="mt-6 p-3 rounded-lg text-xs text-muted-foreground" style={{ background: "hsl(var(--muted))" }}>
            <p className="font-medium mb-1">Demo credentials:</p>
            <p>Email: admin@dentacare.com</p>
            <p>Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

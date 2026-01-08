"use client";

import {
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  RefreshCcw,
  ShieldPlus,
  StepBack,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function makeCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  return { a, b, answer: a + b };
}

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [captcha, setCaptcha] = useState(() => makeCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshCaptcha = () => {
    setCaptcha(makeCaptcha());
    setCaptchaInput("");
  };

  const canSubmit = useMemo(() => {
    return email.trim() && password.trim() && captchaInput.trim();
  }, [email, password, captchaInput]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // captcha validation
    const userAns = Number(captchaInput);
    if (!Number.isFinite(userAns) || userAns !== captcha.answer) {
      setError("Captcha is incorrect. Please try again.");
      refreshCaptcha();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Login failed");
      }

      // ✅ save token in localStorage
      // localStorage.setItem("admin_access_token", data.token);

      router.push("/admin");
    } catch (err) {
      setError(err?.message || "Login failed.");
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-amber-50 to-white p-4 overflow-hidden">
      {/* background blobs */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-200/50 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-orange-200/50 blur-3xl" />

      <Card className="w-full max-w-md shadow-xl border-amber-200/60">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
            <ShieldPlus className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-amber-900">
            Admin Login
          </CardTitle>
          <p className="text-sm text-amber-900/70">
            Secure access for restaurant management
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {/* email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-amber-900">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="text"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dekleineman.nl"
                  required
                />
              </div>
            </div>

            {/* password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-amber-900">
                Password
              </Label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-9 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* captcha */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-amber-900">Captcha</Label>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="text-xs flex items-center gap-1 text-amber-800 hover:text-amber-900"
                >
                  <RefreshCcw className="h-3.5 w-3.5" />
                  Refresh
                </button>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-amber-900">
                  Solve:{" "}
                  <span className="px-2 py-1 rounded bg-white border">
                    {captcha.a} + {captcha.b}
                  </span>
                </div>
                <div className="w-28">
                  <Input
                    inputMode="numeric"
                    placeholder="Answer"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* actions */}
            <div className="flex justify-between items-center pt-2">
              <Link
                href="/"
                className="font-sans text-[14px] p-2 rounded-xl text-white bg-amber-800 font-semibold flex items-center gap-2 justify-center hover:bg-amber-900 transition"
              >
                <StepBack className="h-4 w-4" /> Back
              </Link>

              <Button
                type="submit"
                disabled={!canSubmit || loading}
                className={cn(
                  "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg",
                  "min-w-[120px]"
                )}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Tip: For production, validate captcha on the server or use
              hCaptcha/reCAPTCHA.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

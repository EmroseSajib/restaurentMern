"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useAdminAuth } from "@/app/context/admin-auth-context";
import { AlertCircle, Loader2, StepBack } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  const { login, isLoading } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    console.log("email==========>>>", email, password);
    const credentials = { username: email, password: password };
    try {
      await login(credentials);
    } catch {
      setError(t("loginError"));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t("login")}</CardTitle>
          {/* <CardDescription>{t("loginDescription")}</CardDescription> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              {/* <Label htmlFor="email">{t("email")}</Label> */}
              <Label htmlFor="email">email</Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dekleineman.nl"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              {/* <Label htmlFor="password">{t("password")}</Label> */}
              <Label htmlFor="password">password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex justify-between items-center">
              <Link
                href="/"
                className="font-sans text-[16px] p-1 rounded-2xl text-white px-2 bg-amber-800 font-bold flex items-center gap-2 justify-center"
              >
                <StepBack /> Back
              </Link>

              <Button type="submit" className="mt-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {/* {t("loggingIn")} */}
                    loggingIn
                  </>
                ) : (
                  t("login")
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

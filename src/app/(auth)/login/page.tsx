"use client";

import { useState } from "react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { authService } from "@/features/user/services/auth-service";
import { Globe, MessageCircle, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("guardian@destinyrisinghub.com");
  const [password, setPassword] = useState("demo123456");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.signInWithEmail(email, password);
      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        router.push("/profile");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.loginAsDemo();
      router.push("/profile");
    } catch (err) {
      setError("Demo login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))]">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <Typography variant="h2">Welcome Back</Typography>
          <Typography variant="body" textColor="secondary">
            Sign in to your Destiny Rising Hub account
          </Typography>
        </div>

        {/* Login Card */}
        <Card>
          <CardContent className="space-y-4">
            {/* Social Login Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                size="lg"
                disabled={isLoading}
                className="flex flex-col gap-1 h-auto py-3"
              >
                <Globe className="h-5 w-5" />
                <span className="text-[10px]">Google</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                disabled={isLoading}
                className="flex flex-col gap-1 h-auto py-3"
              >
                <Globe className="h-5 w-5" />
                <span className="text-[10px]">GitHub</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                disabled={isLoading}
                className="flex flex-col gap-1 h-auto py-3"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-[10px]">Discord</span>
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[rgb(var(--color-border))]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[rgb(var(--color-surface))] px-2 text-[rgb(var(--color-text-tertiary))]">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div className="space-y-1">
                <Typography variant="bodySm" weight="medium">Email</Typography>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Typography variant="bodySm" weight="medium">Password</Typography>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="rounded-lg bg-[rgb(var(--color-error)/0.1)] border border-[rgb(var(--color-error)/0.2)] p-3">
                  <Typography variant="bodySm" textColor="error">{error}</Typography>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Sign In
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            {/* Demo Login */}
            <div className="pt-2 border-t border-[rgb(var(--color-border))]">
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                Continue as Demo User
              </Button>
            </div>

            {/* Register Link */}
            <div className="text-center pt-2">
              <Typography variant="bodySm" textColor="secondary">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-[rgb(var(--color-primary))] hover:underline font-medium">
                  Create one
                </Link>
              </Typography>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center">
          <Typography variant="caption" textColor="tertiary">
            Protected by Better Auth • Your data is encrypted and secure
          </Typography>
        </div>
      </div>
    </div>
  );
}

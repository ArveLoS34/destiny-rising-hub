"use client";

import { useState } from "react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { UserPlus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Client-side password confirmation validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Password length validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp(email, username, displayName, password);
      if (result.error) {
        setError(result.error);
      } else {
        // Registration successful, session is created, redirect to profile
        router.push("/profile");
      }
    } catch (err) {
      setError("An unexpected error occurred");
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
              <UserPlus className="h-6 w-6 text-white" />
            </div>
          </div>
          <Typography variant="h2">Create Account</Typography>
          <Typography variant="body" textColor="secondary">
            Join Destiny Rising Hub community
          </Typography>
        </div>

        {/* Register Card */}
        <Card>
          <CardContent className="space-y-4">
            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-3">
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
                <Typography variant="bodySm" weight="medium">Username</Typography>
                <Input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Typography variant="bodySm" weight="medium">Display Name</Typography>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
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
                  minLength={8}
                />
              </div>

              <div className="space-y-1">
                <Typography variant="bodySm" weight="medium">Confirm Password</Typography>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              {error && (
                <div className="rounded-lg bg-[rgb(var(--color-error)/0.1)] border border-[rgb(var(--color-error)/0.2)] p-3">
                  <Typography variant="bodySm" textColor="error">{error}</Typography>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Create Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-2">
              <Typography variant="bodySm" textColor="secondary">
                Already have an account?{" "}
                <Link href="/login" className="text-[rgb(var(--color-primary))] hover:underline font-medium">
                  Sign in
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

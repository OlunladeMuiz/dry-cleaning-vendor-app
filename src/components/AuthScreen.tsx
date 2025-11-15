import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { apiRequest } from "../utils/api";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { UserRole } from "../types";
import { supabase } from "../utils/supabase/client";

interface AuthScreenProps {
  onBack: () => void;
  onAuthSuccess: (userId: string, role: UserRole) => void;
}

export function AuthScreen({ onBack, onAuthSuccess }: AuthScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as UserRole;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;

    try {
      // Sign up with Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            phone,
            address,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpError) {
        // Handle specific error cases
        if (signUpError.message.includes("already been registered")) {
          throw new Error("This email is already registered. Please try logging in instead.");
        }
        if (signUpError.message.includes("Email not confirmed")) {
          throw new Error("Please check your email and confirm your account before logging in.");
        }
        throw signUpError;
      }

      if (signUpData.user) {
        // Check if email confirmation is required
        if (signUpData.user.identities && signUpData.user.identities.length === 0) {
          setError("This email is already registered. Please try logging in instead.");
          setIsLoading(false);
          return;
        }

        // Also try to call the backend API if it exists
        try {
          await apiRequest("/signup", {
            method: "POST",
            body: JSON.stringify({ email, password, name, role, phone, address }),
          });
        } catch (apiError) {
          // Ignore API errors since we already have auth working
          console.log("Backend API not available, using Supabase Auth only");
        }

        // Check if user needs to confirm email
        if (signUpData.session) {
          // Auto sign-in successful (email confirmation disabled)
          localStorage.setItem("access_token", signUpData.session.access_token);
          localStorage.setItem("user_id", signUpData.user.id);
          localStorage.setItem("user_role", role);
          onAuthSuccess(signUpData.user.id, role);
        } else {
          // Email confirmation required
          setError("Account created! Please check your email to confirm your account, then log in.");
          setIsLoading(false);
        }
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      
      // Friendly error messages
      let errorMessage = err.message || "Failed to sign up. Please try again.";
      
      if (errorMessage.includes("rate limit")) {
        errorMessage = "Too many attempts. Please wait a minute and try again.";
      } else if (errorMessage.includes("Invalid email")) {
        errorMessage = "Please enter a valid email address.";
      } else if (errorMessage.includes("Password should be at least")) {
        errorMessage = "Password must be at least 6 characters long.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Handle email not confirmed error
        if (signInError.message.includes("Email not confirmed")) {
          setError(
            "Your email is not confirmed yet. Please check your inbox for a confirmation email. " +
            "If you didn't receive it, you can request a new one below."
          );
          setIsLoading(false);
          return;
        }
        throw signInError;
      }

      if (data.session && data.user) {
        localStorage.setItem("access_token", data.session.access_token);
        localStorage.setItem("user_id", data.user.id);
        const role = data.user.user_metadata.role as UserRole;
        localStorage.setItem("user_role", role);
        onAuthSuccess(data.user.id, role);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      
      // Friendly error messages
      let errorMessage = err.message || "Failed to log in. Please check your credentials.";
      
      if (errorMessage.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (errorMessage.includes("Email not confirmed")) {
        errorMessage = "Your email is not confirmed yet. Please check your inbox for a confirmation email.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    const emailInput = document.getElementById("login-email") as HTMLInputElement;
    const email = emailInput?.value;

    if (!email) {
      setError("Please enter your email address first.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      setSuccessMessage("Confirmation email sent! Please check your inbox and spam folder.");
    } catch (err: any) {
      console.error("Resend error:", err);
      setError(err.message || "Failed to resend confirmation email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-white hover:bg-white/10 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to TrinityClean</CardTitle>
            <CardDescription>Sign in or create an account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                      {error}
                    </div>
                  )}

                  {successMessage && (
                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
                      {successMessage}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Log In"
                    )}
                  </Button>

                  <Button
                    variant="link"
                    className="text-sm text-gray-500 hover:text-gray-700"
                    onClick={handleResendConfirmation}
                    disabled={isLoading}
                  >
                    Resend confirmation email
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="you@trinity.edu"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-role">I am a...</Label>
                    <Select name="role" required defaultValue="student">
                      <SelectTrigger id="signup-role">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="vendor">Vendor</SelectItem>
                        <SelectItem value="agent">Delivery Agent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-address">Address</Label>
                    <Input
                      id="signup-address"
                      name="address"
                      type="text"
                      placeholder="Campus dorm or street address"
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                      {error}
                    </div>
                  )}

                  {successMessage && (
                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
                      {successMessage}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
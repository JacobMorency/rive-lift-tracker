"use client";

import supabase from "@/app/lib/supabaseClient";
import { FormEvent, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

type LoginFormProps = {
  onLoginSuccess: (user: User | null, session: Session | null) => void;
};

type AuthMode = "login" | "register" | "forgot-password";

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (mode === "login" || mode === "register") {
      if (!password) {
        newErrors.password = "Password is required";
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    if (mode === "register") {
      if (!firstName) {
        newErrors.firstName = "First name is required";
      }
      if (!lastName) {
        newErrors.lastName = "Last name is required";
      }
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Login successful!");
      onLoginSuccess(data.user, data.session);
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;

      toast.success(
        "Registration successful! Please check your email and click the verification link to activate your account."
      );
      setMode("login");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFirstName("");
      setLastName("");
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success("Password reset email sent! Please check your inbox.");
      setMode("login");
      setEmail("");
    } catch (error: any) {
      toast.error(
        error.message || "Failed to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setErrors({});
  };

  const getTitle = (): string => {
    switch (mode) {
      case "login":
        return "Sign In";
      case "register":
        return "Create Account";
      case "forgot-password":
        return "Reset Password";
      default:
        return "Sign In";
    }
  };

  const getSubmitText = (): string => {
    switch (mode) {
      case "login":
        return "Sign In";
      case "register":
        return "Create Account";
      case "forgot-password":
        return "Send Reset Email";
      default:
        return "Submit";
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-base-200">
      <div className="w-full max-w-md">
        <div className="bg-base-100 rounded-lg shadow-lg p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="bg-primary shrink-0 rounded-full h-20 w-20 flex items-center justify-center text-5xl mx-auto mb-4">
              💪
            </div>
            <h2 className="text-2xl font-bold text-base-content">
              {getTitle()}
            </h2>
            {mode !== "login" && (
              <button
                onClick={() => {
                  setMode("login");
                  resetForm();
                }}
                className="btn btn-ghost btn-sm mt-2"
              >
                <ArrowLeft className="size-4 mr-1" />
                Back to Sign In
              </button>
            )}
          </div>

          {/* Form */}
          <form
            onSubmit={
              mode === "login"
                ? handleLogin
                : mode === "register"
                ? handleRegister
                : handleForgotPassword
            }
            className="space-y-4"
          >
            {/* Email Field */}
            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-error text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* First Name & Last Name (Register only) */}
            {mode === "register" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName)
                        setErrors({ ...errors, firstName: "" });
                    }}
                    className={`input input-bordered w-full ${
                      errors.firstName ? "input-error" : ""
                    }`}
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <p className="text-error text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Last Name</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (errors.lastName)
                        setErrors({ ...errors, lastName: "" });
                    }}
                    className={`input input-bordered w-full ${
                      errors.lastName ? "input-error" : ""
                    }`}
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <p className="text-error text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>
            )}

            {/* Password Field (Login & Register only) */}
            {(mode === "login" || mode === "register") && (
              <div>
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors({ ...errors, password: "" });
                    }}
                    className={`input input-bordered w-full pr-10 ${
                      errors.password ? "input-error" : ""
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-error text-sm mt-1">{errors.password}</p>
                )}
              </div>
            )}

            {/* Confirm Password (Register only) */}
            {mode === "register" && (
              <div>
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword)
                        setErrors({ ...errors, confirmPassword: "" });
                    }}
                    className={`input input-bordered w-full pr-10 ${
                      errors.confirmPassword ? "input-error" : ""
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-error text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                getSubmitText()
              )}
            </button>
          </form>

          {/* Mode Switcher */}
          {mode === "login" && (
            <div className="space-y-3">
              <div className="divider">OR</div>
              <button
                onClick={() => setMode("register")}
                className="btn btn-outline w-full"
                disabled={loading}
              >
                Create New Account
              </button>
              <div className="text-center">
                <button
                  onClick={() => setMode("forgot-password")}
                  className="text-primary text-sm hover:underline"
                  disabled={loading}
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          )}

          {/* Social Login (Coming Soon) */}
          {mode === "login" && (
            <div className="space-y-3">
              <div className="divider">OR</div>
              <button className="btn btn-outline w-full" disabled>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.5 0 6.2 1.5 8.1 2.8l6-6C34.1 2.6 29.4 0 24 0 14.6 0 6.6 5.6 2.7 13.7l7.2 5.6C12 13.4 17.5 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.5 24.5c0-1.5-.1-2.9-.4-4.2H24v8h12.7c-.6 3.4-2.6 6.2-5.4 8.1l8.4 6.5C43.9 38.5 46.5 32 46.5 24.5z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10 28.1c-1.2-3.6-1.2-7.6 0-11.2L2.7 11.3c-4.1 8.3-4.1 17.8 0 26.1L10 28.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c5.4 0 10.1-1.8 13.5-4.9l-8.4-6.5c-2.3 1.5-5.2 2.4-8.4 2.4-6.5 0-12-3.9-14.4-9.5l-7.2 5.6C6.6 42.4 14.6 48 24 48z"
                  />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
                Sign in with Google
              </button>
              <button className="btn btn-outline w-full" disabled>
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16.365 1.43c-.94.06-2.08.66-2.75 1.45-.6.69-1.17 1.81-.96 2.86 1.07.04 2.17-.58 2.83-1.36.62-.68 1.09-1.74 1.14-2.95-.12 0-.3 0-.46 0zm-4.23 4.54c-1.69-.1-3.14.99-3.95.99-.83 0-2.11-.96-3.48-.93-1.79.03-3.45 1.06-4.36 2.7-1.87 3.26-.48 8.07 1.34 10.71.89 1.3 1.94 2.75 3.34 2.7 1.33-.06 1.84-.87 3.45-.87 1.6 0 2.06.87 3.48.84 1.44-.03 2.34-1.33 3.21-2.64.69-1 1.02-1.51 1.59-2.65-4.18-1.58-4.84-7.47-.72-9.3-.94-1.12-2.34-1.64-3.9-1.55z" />
                </svg>
                Sign in with Apple
              </button>
              <p className="text-center text-sm text-base-content/60">
                Social sign-in coming soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

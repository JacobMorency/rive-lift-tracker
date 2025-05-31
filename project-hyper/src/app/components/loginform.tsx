"use client";

import supabase from "@/app/lib/supabaseClient";
import { FormEvent, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import Link from "next/link";

type LoginFormProps = {
  onLoginSuccess: (user: User | null, session: Session | null) => void;
  handleForgotPassword: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [emailEmpty, setEmailEmpty] = useState<boolean>(false);
  const [passwordEmpty, setPasswordEmpty] = useState<boolean>(false);
  const [isPasswordActive, setIsPasswordActive] = useState<boolean>(false);

  const handleLogin = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    setEmailEmpty(false);
    setPasswordEmpty(false);
    setErrorMessage("");

    let hasError = false;

    if (!email) {
      setEmailEmpty(true);
      hasError = true;
    }

    if (!password) {
      setPasswordEmpty(true);
      hasError = true;
    }

    // Stops for the form from being submitted so the supabase error message does not appear if a field is blank
    if (hasError) {
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }
      onLoginSuccess(data.user, data.session);
    } catch (error) {
      // TODO: Handle error more gracefully
      console.error("Login error:", error);
      setErrorMessage("Invalid email or password.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <form onSubmit={handleLogin} className="w-full max-w-md p-6 space-y-3">
        <h2 className="text-2xl font-bold text-center">Sign in</h2>
        <div className="flex justify-center">
          <div className="bg-primary shrink-0 rounded-full h-20 w-20 flex items-center justify-center text-5xl">
            {isPasswordActive ? <p>🙈</p> : <p>💪</p>}
          </div>
        </div>
        {errorMessage && (
          <p className="text-center text-error italic text-sm">
            {errorMessage}
          </p>
        )}
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailEmpty(false);
              setErrorMessage("");
            }}
          />
          {emailEmpty && (
            <p className="text-error italic text-sm">Email is required</p>
          )}
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="Password"
            onBlur={() => setIsPasswordActive(false)}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordEmpty(false);
              setErrorMessage("");
              setIsPasswordActive(true);
            }}
          />
          {passwordEmpty && (
            <p className="text-error italic text-sm">Password is required</p>
          )}
        </div>
        <div className="text-right">
          <Link href="/underconstruction" className="text-primary text-sm">
            Forgot Password?
          </Link>
        </div>
        <div>
          <button className="btn btn-primary w-full" type="submit">
            Login
          </button>
        </div>
        <div className="divider">OR</div>
        <button className="btn btn-outline w-full mb-2" type="button">
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
        <button className="btn btn-outline w-full" type="button">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.365 1.43c-.94.06-2.08.66-2.75 1.45-.6.69-1.17 1.81-.96 2.86 1.07.04 2.17-.58 2.83-1.36.62-.68 1.09-1.74 1.14-2.95-.12 0-.3 0-.46 0zm-4.23 4.54c-1.69-.1-3.14.99-3.95.99-.83 0-2.11-.96-3.48-.93-1.79.03-3.45 1.06-4.36 2.7-1.87 3.26-.48 8.07 1.34 10.71.89 1.3 1.94 2.75 3.34 2.7 1.33-.06 1.84-.87 3.45-.87 1.6 0 2.06.87 3.48.84 1.44-.03 2.34-1.33 3.21-2.64.69-1 1.02-1.51 1.59-2.65-4.18-1.58-4.84-7.47-.72-9.3-.94-1.12-2.34-1.64-3.9-1.55z" />
          </svg>
          Sign in with Apple
        </button>
        <p className="text-center text-sm text-secondary">
          Google and Apple sign-in are coming soon!
        </p>
      </form>
    </div>
  );
};

export default LoginForm;

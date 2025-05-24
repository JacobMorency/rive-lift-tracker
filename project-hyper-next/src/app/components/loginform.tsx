"use client";

import supabase from "@/app/lib/supabaseClient";
import { FormEvent, useState } from "react";

type LoginFormProps = {
  onLoginSuccess: (data: any) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailEmpty, setEmailEmpty] = useState(false);
  const [passwordEmpty, setPasswordEmpty] = useState(false);

  const handleLogin = async (e: FormEvent) => {
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
      onLoginSuccess(data);
    } catch (error) {
      setErrorMessage("Invalid email or password.");
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
          <legend className="fieldset-legend">Sign in</legend>
          {errorMessage && (
            <p className="text-center text-error italic text-sm">
              {errorMessage}
            </p>
          )}
          <label className="label">Email</label>
          <input
            type="email"
            className="input w-full"
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
          <label className="label">Password</label>
          <input
            type="password"
            className="input w-full"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordEmpty(false);
              setErrorMessage("");
            }}
          />
          {passwordEmpty && (
            <p className="text-error italic text-sm">Password is required</p>
          )}
          <button className="btn btn-primary mt-4" type="submit">
            Login
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default LoginForm;

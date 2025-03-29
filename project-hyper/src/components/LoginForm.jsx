import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "../supabaseClient";
import { useState } from "react";

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailEmpty, setEmailEmpty] = useState(false);
  const [passwordEmpty, setPasswordEmpty] = useState(false);

  // TODO: remove console.log statements
  const handleLogin = async (e) => {
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
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Welcome! Please login to your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin}>
            {errorMessage && (
              <p className="text-center text-error italic text-sm">
                {errorMessage}
              </p>
            )}
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className={emailEmpty ? "border-error" : ""}
              />
              {emailEmpty && (
                <p className="text-error italic text-sm">Email is required</p>
              )}
            </div>
            <div className="space-y-1.5 my-3">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className={passwordEmpty ? "border-error" : ""}
              />
              {passwordEmpty && (
                <p className="text-error italic text-sm">
                  Password is required
                </p>
              )}
            </div>
            <div className="my-3">
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;

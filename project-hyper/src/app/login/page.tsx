"use client";

import LoginForm from "@/app/components/loginform";
import { useRouter } from "next/navigation";
import { User, Session } from "@supabase/supabase-js";

const LoginPage = () => {
  const router = useRouter();

  const handleLoginSuccess = (
    user: User | null,
    session: Session | null
  ): void => {
    if (user && session) {
      router.push("/workouts");
    }
    // TODO: Handle case where login fails or user is null
  };

  // TODO: Implement forgot password functionality
  const handleForgotPassword = (): void => {
    router.push("/underconstruction");
  };

  return (
    <div>
      <LoginForm
        onLoginSuccess={handleLoginSuccess}
        handleForgotPassword={handleForgotPassword}
      />
    </div>
  );
};

export default LoginPage;

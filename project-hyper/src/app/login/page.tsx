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
  };

  return (
    <div>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default LoginPage;

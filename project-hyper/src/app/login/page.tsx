"use client";

import LoginForm from "@/app/components/loginform";

import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  const handleLoginSuccess = (data: any) => {
    router.push("/dashboard");
  };

  return (
    <div>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default LoginPage;

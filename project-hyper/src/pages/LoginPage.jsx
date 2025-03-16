import React from "react";
import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const handleSuccessfulLogin = () => {
    navigate("/dashboard"); //TODO: Redirect to dashboard eventually
  };

  return (
    <div>
      <h1 className="text-center text-xl font-bold">Project Hyper</h1>
      <LoginForm onLoginSuccess={handleSuccessfulLogin} />
    </div>
  );
};

export default LoginPage;

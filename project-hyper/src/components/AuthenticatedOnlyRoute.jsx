import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthenticatedOnlyRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

export { AuthenticatedOnlyRoute };

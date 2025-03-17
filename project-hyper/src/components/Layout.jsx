import BottomNav from "./BottomNav";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full max-w-md">{children}</div>
      {user && <BottomNav />}
    </div>
  );
};

export default Layout;

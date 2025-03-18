import BottomNav from "./BottomNav";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="h-screen flex flex-col">
      <div className="w-full max-w-md mx-auto">{children}</div>
      {user && <BottomNav />}
    </div>
  );
};

export default Layout;

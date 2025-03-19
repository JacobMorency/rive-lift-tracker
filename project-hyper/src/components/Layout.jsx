import BottomNav from "./BottomNav";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children, header }) => {
  const { user } = useAuth();

  return (
    <div className="h-screen flex flex-col">
      {header && <div className="w=full">{header}</div>}
      <div className="flex flex-1 flex-col">
        <div className="w-full max-w-md mx-auto">{children}</div>
      </div>
      {user && <BottomNav />}
    </div>
  );
};

export default Layout;

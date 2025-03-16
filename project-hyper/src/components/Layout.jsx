import BottomNav from "./BottomNav";

const Layout = ({ children }) => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full max-w-md">{children}</div>
      <BottomNav />
    </div>
  );
};

export default Layout;

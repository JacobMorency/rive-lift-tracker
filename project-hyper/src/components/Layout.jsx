const Layout = ({ children }) => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
};

export default Layout;

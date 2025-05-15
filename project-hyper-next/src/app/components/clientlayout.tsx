"use client";

import { useAuth } from "@/app/context/authcontext";
import { ReactNode } from "react";
import BottomNav from "@/app/components/bottomnav";

type ClientLayoutProps = {
  children: ReactNode;
  header?: ReactNode;
};

const ClientLayout = ({ children, header }: ClientLayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="h-screen flex flex-col">
      {header && <div className="w-full">{header}</div>}
      <div className="flex flex-1 flex-col">
        <div className="w-full max-w-md mx-auto px-3">{children}</div>
      </div>
      {user && <BottomNav />}
    </div>
  );
};

export default ClientLayout;

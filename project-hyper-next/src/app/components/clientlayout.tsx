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
      <div className="flex flex-1 flex-col">{children}</div>
      {user && <BottomNav />}
    </div>
  );
};

export default ClientLayout;

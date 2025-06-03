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
    <div className="min-h-screen flex flex-col pb-[env(safe-area-inset-bottom)]">
      {header && <div className="w-full">{header}</div>}
      <div className="flex flex-1 flex-col px-3">{children}</div>
      {user && <BottomNav />}
      {user && <div className="h-[env(safe-area-inset-bottom)]" />}
    </div>
  );
};

export default ClientLayout;

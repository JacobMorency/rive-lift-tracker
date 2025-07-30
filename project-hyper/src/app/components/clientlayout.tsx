"use client";

import { useAuth } from "@/app/context/authcontext";
import { useModal } from "@/app/context/modalcontext";
import { ReactNode } from "react";
import BottomNav from "@/app/components/bottomnav";

type ClientLayoutProps = {
  children: ReactNode;
  header?: ReactNode;
};

const ClientLayout = ({ children, header }: ClientLayoutProps) => {
  const { user } = useAuth();
  const { isExerciseSelectorOpen } = useModal();

  return (
    <div className="min-h-screen flex flex-col">
      {header && <div className="w-full">{header}</div>}
      <div className="flex flex-1 flex-col px-3 pb-20">{children}</div>
      {user && !isExerciseSelectorOpen && <BottomNav />}
    </div>
  );
};

export default ClientLayout;

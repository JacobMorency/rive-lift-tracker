"use client";

import { useAuth } from "@/app/context/authcontext";

const DashboardHeader = () => {
  const { userData } = useAuth();

  if (!userData) {
    return (
      <div>
        <h1 className="text-3xl font-bold my-3">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="px-4">
      <h1 className="text-3xl font-bold my-3">Hiya, {userData.first_name}</h1>
    </div>
  );
};

export default DashboardHeader;

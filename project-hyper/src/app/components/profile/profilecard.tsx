"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import supabase from "@/app/lib/supabaseClient";
import { useState } from "react";

const ProfileCard = () => {
  const { userData } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const handleLogout = async (): Promise<void> => {
    setIsLoggingOut(true);

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Error logging out:", error.message);
      setIsLoggingOut(false);
      return;
    }
    router.push("/");
  };

  return (
    <div className="p-4">
      <div className="card card-border bg-base-300 shadow-md">
        <div className="card-body">
          <h2 className="card-title">
            {userData?.first_name} {userData?.last_name}
          </h2>
          <p>{userData?.email}</p>
          {isLoggingOut ? (
            <div className="card-actions justify-center">
              <span className="loading loading-spinner"></span>
            </div>
          ) : (
            <div className="card-actions justify-end">
              <button onClick={handleLogout} className="btn btn-primary">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

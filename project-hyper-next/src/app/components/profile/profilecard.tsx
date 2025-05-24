"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import supabase from "@/app/lib/supabaseClient";

const ProfileCard = () => {
  const { user, userData } = useAuth();
  const router = useRouter();
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Error logging out:", error.message);
      return;
    }
    router.push("/");

    if (!userData) {
      return <p>Loading...</p>; // TODO: Add loading spinner or skeleton
    }
  };

  return (
    <div className="p-4">
      <div className="card card-border bg-base-300 shadow-md">
        <div className="card-body">
          <h2 className="card-title">
            {userData?.first_name} {userData?.last_name}
          </h2>
          <p>{userData?.email}</p>
          <div className="card-actions justify-end">
            <button onClick={handleLogout} className="btn btn-primary">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
import supabase from "@/app/lib/supabaseClient";
import { useState, useEffect } from "react";

const ProfileCard = () => {
  const { userData, user } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [userStats, setUserStats] = useState({
    totalSessions: 0,
    thisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchUserStats = async () => {
    if (!user?.id) return;

    try {
      // Get total sessions
      const { count: totalSessions } = await supabase
        .from("workout_sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Get this month's sessions
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: thisMonth } = await supabase
        .from("workout_sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("started_at", startOfMonth.toISOString());

      setUserStats({
        totalSessions: totalSessions || 0,
        thisMonth: thisMonth || 0,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, [user?.id]);

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
    <div className="animate-fade-in-up transition-opacity duration-500 mt-3">
      <div className="p-4 space-y-4">
        {/* User Stats */}
        <div className="stats stats-horizontal shadow w-full">
          <div className="stat">
            <div className="stat-title">Total Sessions</div>
            <div className="stat-value">
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                userStats.totalSessions
              )}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">This Month</div>
            <div className="stat-value">
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                userStats.thisMonth
              )}
            </div>
          </div>
        </div>

        {/* Profile Card */}
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
    </div>
  );
};

export default ProfileCard;

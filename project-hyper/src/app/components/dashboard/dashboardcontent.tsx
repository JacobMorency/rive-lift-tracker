"use client";

import DashboardCard from "@/app/components/dashboard/dashboardcard";
import supabase from "@/app/lib/supabaseClient";
import { Dumbbell, Gift } from "lucide-react";
import { useAuth } from "@/app/context/authcontext";
import { useState, useEffect } from "react";
import Image from "next/image";

const DashboardContent = () => {
  const [totalWorkouts, setTotalWorkouts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showEasterEgg, setShowEasterEgg] = useState<boolean>(false);

  const { user } = useAuth();
  // Easter egg for a specific user
  const FRIEND_ID = "7e3e5578-fba6-448a-930f-5b0f8ab5746f";
  const isFriend = user?.id === FRIEND_ID;

  useEffect(() => {
    const fetchTotalWorkouts = async (): Promise<void> => {
      if (user !== null) {
        const { data, error } = await supabase
          .from("workouts")
          .select("*", { count: "exact" })
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching workouts:", error.message);
        } else {
          setTotalWorkouts(data.length);
          setLoading(false);
        }
      }
    };

    fetchTotalWorkouts();
  }, [user]);

  return (
    <div className="pb-24">
      {!loading && (
        <div>
          <div className="animate-fade-in-up transition-opacity duration-500 mt-3">
            <DashboardCard
              title={"Total Workouts"}
              description={"Your total amount of workouts."}
              content={totalWorkouts.toString()}
              icon={<Dumbbell />}
            />
          </div>
          {/* Easter egg for a specific user. Can be removed later. */}
          {isFriend && (
            <div className="animate-fade-in-up transition-opacity duration-500 mt-3">
              <div className="px-4">
                <div
                  className="card card-border bg-primary"
                  onClick={() => setShowEasterEgg(!showEasterEgg)}
                >
                  <div className="card-body">
                    <div className="flex items-center justify-between w-full">
                      <div className="card-title flex justify-center items-center w-full text-center">
                        Click For a Surprise!
                      </div>
                    </div>
                    <div className="text-3xl font-medium justify-center items-center flex">
                      <Gift size={48} />
                    </div>
                    <div
                      className={`transition-all duration-700 mt-4 flex justify-center overflow-hidden ${
                        showEasterEgg
                          ? "h-[200px] opacity-100 scale-100 animate-bounce"
                          : "h-0 opacity-0 scale-0"
                      }`}
                    >
                      <Image
                        src="/images/purple_flower.png"
                        alt="Easter Egg"
                        width={200}
                        height={200}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardContent;

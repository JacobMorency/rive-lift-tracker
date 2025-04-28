import DashboardCard from "@/components/dashboard/DashboardCard";
import { Dumbbell } from "lucide-react";
import { supabase } from "@/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

const DashboardContent = () => {
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const { user } = useAuth();

  const fetchTotalWorkouts = async () => {
    const { data, error } = await supabase
      .from("workouts")
      .select("*", { count: "exact" })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching workouts:", error.message);
    } else {
      setTotalWorkouts(data.length);
    }
  };

  useEffect(() => {
    fetchTotalWorkouts();
  }, []);

  return (
    <div>
      <DashboardCard
        title={"Total Workouts"}
        description={"Your total amount of workouts."}
        content={totalWorkouts}
        icon={<Dumbbell />}
      />
    </div>
  );
};

export default DashboardContent;

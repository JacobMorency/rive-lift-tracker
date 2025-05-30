"use client";
import WorkoutHistoryTab from "@/app/components/workouthistory/workouthistorytab";
import supabase from "@/app/lib/supabaseClient";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authcontext";
import { Workout } from "@/types/workout";

const WorkoutHistory = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const { user } = useAuth();

  const fetchWorkoutHistory = async (): Promise<void> => {
    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching workouts:", error.message);
    } else {
      setWorkouts(data);
    }
  };
  useEffect(() => {
    fetchWorkoutHistory();
  }, []);
  return (
    <div>
      <WorkoutHistoryTab workouts={workouts} />
    </div>
  );
};

export default WorkoutHistory;

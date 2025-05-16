"use client";

import { useRouter } from "next/navigation";
import supabase from "@/app/lib/supabaseClient";
import { useAuth } from "@/app/context/authcontext";
import { useEffect, useState } from "react";

import WorkoutHistory from "@/app/components/workouthistory/workouthistory";

const WorkoutsPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [workoutInProgress, setWorkoutInProgress] = useState(false);
  const [workoutId, setWorkoutId] = useState(null);

  useEffect(() => {
    const savedWorkoutId = localStorage.getItem("workoutId");
    if (savedWorkoutId) {
      setWorkoutId(savedWorkoutId);
      setWorkoutInProgress(true);
    }
  }, []);

  const handleStartNewWorkout = async () => {
    let newWorkoutId = await createNewWorkout();
    if (newWorkoutId) {
      setWorkoutId(newWorkoutId);
      localStorage.setItem("workoutId", newWorkoutId);
      setWorkoutInProgress(true);
      navigate(`/add-workout/${workoutId}`);
    }
  };

  const createNewWorkout = async () => {
    const { data, error } = await supabase
      .from("workouts")
      .insert([{ user_id: user.id, date: new Date() }])
      .select("id", "user_id", "date")
      .single();

    if (error) {
      console.error("Error creating new workout:", error.message);
      return null;
    }
    return data?.id;
  };

  const handleContinueWorkout = () => {
    if (workoutId) {
      navigate(`/add-workout/${workoutId}`);
    }
  };

  return (
    <div>
      {workoutInProgress ? (
        <div className="flex items-center">
          <button onClick={handleContinueWorkout}>
            Continue Previous Workout
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center mt-3">
          <button onClick={handleStartNewWorkout}>Start New Workout</button>
        </div>
      )}
      <WorkoutHistory />
    </div>
  );
};

export default WorkoutsPage;

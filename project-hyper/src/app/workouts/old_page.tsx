"use client";

import { useRouter } from "next/navigation";
import supabase from "@/app/lib/supabaseClient";
import { useAuth } from "@/app/context/authcontext";
import { useEffect, useState } from "react";

import WorkoutHistory from "@/app/components/workouthistory";
import PageHeader from "@/app/components/pageheader";
import ClientLayout from "@/app/components/clientlayout";
import { NullableNumber } from "@/types/workout";

const WorkoutsPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [workoutInProgress, setWorkoutInProgress] = useState<boolean>(false);
  const [workoutId, setWorkoutId] = useState<NullableNumber>(null);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  useEffect(() => {
    const savedWorkoutId = localStorage.getItem("workoutId");
    if (savedWorkoutId) {
      setWorkoutId(parseInt(savedWorkoutId));
      setWorkoutInProgress(true);
    }
  }, []);

  const handleStartNewWorkout = async (): Promise<void> => {
    setIsNavigating(true);
    const newWorkoutId = await createNewWorkout();
    if (newWorkoutId) {
      setWorkoutId(newWorkoutId);
      localStorage.setItem("workoutId", newWorkoutId.toString());
      // setWorkoutInProgress(true);
      router.push(`/addworkout/${newWorkoutId}`);
    } else {
      setIsNavigating(false);
    }
  };

  const createNewWorkout = async (): Promise<NullableNumber> => {
    if (user !== null) {
      const { data, error } = await supabase
        .from("workouts")
        .insert([{ user_id: user.id, date: new Date() }])
        .select("id, user_id, date")
        .single();

      if (error) {
        console.error("Error creating new workout:", error.message);
        return null;
      }
      return data?.id;
    }
    return null;
  };

  const handleContinueWorkout = (): void => {
    if (workoutId) {
      router.push(`/addworkout/${workoutId}`);
    }
  };

  return (
    <ClientLayout header={<PageHeader heading="Workouts" />}>
      <div>
        {isNavigating ? (
          <div className="flex justify-center items-center h-screen">
            <div className="loading loading-spinner"></div>
          </div>
        ) : (
          <div>
            {workoutInProgress ? (
              <div className="flex justify-center mt-3">
                <div className="w-full max-w-md">
                  <button
                    className="btn btn-primary w-full"
                    onClick={handleContinueWorkout}
                  >
                    Continue Previous Workout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mt-3">
                <button
                  className="btn btn-primary"
                  onClick={handleStartNewWorkout}
                >
                  Start New Workout
                </button>
              </div>
            )}
            <WorkoutHistory />
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default WorkoutsPage;

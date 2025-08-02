"use client";

import { useAuth } from "@/app/context/authcontext";
import { useState, useEffect } from "react";
import { X, Dumbbell, ChevronRight } from "lucide-react";
import supabase from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";

type SelectWorkoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type WorkoutTemplate = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  exercise_count: number;
};

type WorkoutWithExercises = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  workout_exercises: { count: number }[];
};

const SelectWorkoutModal = ({ isOpen, onClose }: SelectWorkoutModalProps) => {
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      fetchWorkoutTemplates();
    }
  }, [isOpen, user]);

  const fetchWorkoutTemplates = async (): Promise<void> => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch workout templates with exercise count
      const { data, error } = await supabase
        .from("workouts")
        .select(
          `
          id,
          name,
          description,
          created_at,
          workout_exercises(count)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching workout templates:", error.message);
        return;
      }

      // Transform the data to include exercise count
      const templates =
        data?.map((workout: WorkoutWithExercises) => ({
          id: workout.id,
          name: workout.name,
          description: workout.description,
          created_at: workout.created_at,
          exercise_count: workout.workout_exercises?.[0]?.count || 0,
        })) || [];

      setWorkoutTemplates(templates);
    } catch (error) {
      console.error("Error fetching workout templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutSelect = async (workoutId: string) => {
    if (!user) return;

    try {
      // Create a new session
      const { data, error } = await supabase
        .from("workout_sessions")
        .insert([
          {
            user_id: user.id,
            workout_id: workoutId,
            started_at: new Date().toISOString(),
            completed: false,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating session:", error.message);
        return;
      }

      // Navigate to the session page
      router.push(`/sessions/${data.id}`);
      onClose();
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-full h-full p-0 rounded-none">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h2 className="text-lg font-semibold text-base-content">
            Select Workout Template ({workoutTemplates.length})
          </h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : workoutTemplates.length === 0 ? (
            <div className="text-center py-8">
              <Dumbbell className="size-12 text-base-content/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-base-content mb-2">
                No Workout Templates
              </h3>
              <p className="text-base-content/60">
                Create a workout template first to start a session
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {workoutTemplates.map((workout) => (
                <button
                  key={workout.id}
                  className="btn btn-ghost w-full py-4 text-left bg-base-100 hover:bg-base-200 border border-base-300"
                  onClick={() => handleWorkoutSelect(workout.id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <Dumbbell className="size-5 text-primary mr-4" />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-base-content">
                        {workout.name}
                      </div>
                    </div>
                    <p className="text-base-content/40">
                      {workout.exercise_count}
                    </p>
                    <ChevronRight className="size-5 text-base-content/40 flex-shrink-0 ml-2" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectWorkoutModal;

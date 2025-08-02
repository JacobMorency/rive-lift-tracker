"use client";

import { useAuth } from "@/app/context/authcontext";
import { useState, useEffect } from "react";
import { X, Dumbbell, ChevronRight, Plus } from "lucide-react";
import supabase from "@/app/lib/supabaseClient";
import WorkoutDetailsModal from "./workoutdetailsmodal";

type WorkoutTemplatesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddNewWorkout?: () => void;
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

const WorkoutTemplatesModal = ({
  isOpen,
  onClose,
  onAddNewWorkout,
}: WorkoutTemplatesModalProps) => {
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(
    null
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { user } = useAuth();

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

  const handleWorkoutClick = (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedWorkoutId(null);
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-full h-full p-0 rounded-none animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h2 className="text-lg font-semibold text-base-content">
            Workout Templates ({workoutTemplates.length})
          </h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-4">
          {/* Add New Workout Button */}
          {onAddNewWorkout && (
            <div className="mb-4 flex-shrink-0">
              <button
                onClick={onAddNewWorkout}
                className="btn btn-primary w-full"
              >
                <Plus className="size-5 mr-2" />
                Add New Workout
              </button>
            </div>
          )}

          {/* Scrollable List Section */}
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-10rem)] scroll-smooth">
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
                  Create your first workout template to get started
                </p>
              </div>
            ) : (
              <div className="space-y-1 snap-y snap-mandatory">
                {workoutTemplates.map((workout) => (
                  <button
                    key={workout.id}
                    className="btn btn-ghost w-full py-4 text-left bg-base-100 hover:bg-base-200 border border-base-300 snap-start"
                    onClick={() => handleWorkoutClick(workout.id)}
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

      {/* Workout Details Modal */}
      <WorkoutDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        workoutId={selectedWorkoutId}
      />
    </div>
  );
};

export default WorkoutTemplatesModal;

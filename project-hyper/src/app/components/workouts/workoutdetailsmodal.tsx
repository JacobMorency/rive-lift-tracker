"use client";

import { useState, useEffect } from "react";
import { X, Plus, Dumbbell } from "lucide-react";
import { formatExerciseName } from "@/app/lib/utils";
import supabase from "@/app/lib/supabaseClient";
import ExerciseSelector from "../exerciseselector";
import { Exercise } from "@/types/workout";
import { useModal } from "../../context/modalcontext";

type WorkoutDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  workoutId: string | null;
};

type WorkoutDetails = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  exercises: Exercise[];
};

const WorkoutDetailsModal = ({
  isOpen,
  onClose,
  workoutId,
}: WorkoutDetailsModalProps) => {
  const [workoutDetails, setWorkoutDetails] = useState<WorkoutDetails | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const { setIsExerciseSelectorOpen } = useModal();

  useEffect(() => {
    if (isOpen && workoutId) {
      fetchWorkoutDetails();
    }
  }, [isOpen, workoutId]);

  useEffect(() => {
    setIsExerciseSelectorOpen(isOpen);
  }, [isOpen, setIsExerciseSelectorOpen]);

  const fetchWorkoutDetails = async () => {
    if (!workoutId) return;

    setLoading(true);
    try {
      // Fetch workout details
      const { data: workoutData, error: workoutError } = await supabase
        .from("workouts")
        .select("id, name, description, created_at")
        .eq("id", workoutId)
        .single();

      if (workoutError) {
        console.error("Error fetching workout details:", workoutError.message);
        return;
      }

      console.log("Workout data:", workoutData);

      // Fetch workout exercises
      const { data: workoutExercisesData, error: workoutExercisesError } =
        await supabase
          .from("workout_exercises")
          .select("exercise_id, order_index")
          .eq("workout_id", workoutId)
          .order("order_index", { ascending: true });

      if (workoutExercisesError) {
        console.error(
          "Error fetching workout exercises:",
          workoutExercisesError.message
        );
        return;
      }

      console.log("Workout exercises data:", workoutExercisesData);

      if (!workoutExercisesData || workoutExercisesData.length === 0) {
        setWorkoutDetails({
          id: workoutData.id,
          name: workoutData.name,
          description: workoutData.description,
          created_at: workoutData.created_at,
          exercises: [],
        });
        return;
      }

      // Get unique exercise IDs
      const exerciseIds = workoutExercisesData.map((we) => we.exercise_id);

      // Fetch exercise details
      const { data: exercisesData, error: exercisesError } = await supabase
        .from("exercise_library")
        .select("id, name, category")
        .in("id", exerciseIds);

      if (exercisesError) {
        console.error("Error fetching exercises:", exercisesError.message);
        return;
      }

      console.log("Exercises data:", exercisesData);

      // Create a map of exercise IDs to exercise details
      const exerciseMap = new Map();
      exercisesData?.forEach((exercise) => {
        exerciseMap.set(exercise.id, exercise);
      });

      // Transform the exercises data
      const exercises = workoutExercisesData
        .map((we) => {
          const exercise = exerciseMap.get(we.exercise_id);
          return exercise
            ? {
                id: exercise.id,
                name: exercise.name,
                category: exercise.category,
              }
            : null;
        })
        .filter((exercise) => exercise !== null);

      console.log("Exercises:", exercises);

      setWorkoutDetails({
        id: workoutData.id,
        name: workoutData.name,
        description: workoutData.description,
        created_at: workoutData.created_at,
        exercises,
      });
    } catch (error) {
      console.error("Error fetching workout details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExercises = () => {
    setShowExerciseSelector(true);
  };

  const handleExerciseSelect = async (selectedExercises: Exercise[]) => {
    if (!workoutId) return;

    try {
      // Add selected exercises to the workout
      const exercisesToAdd = selectedExercises.map((exercise, index) => ({
        workout_id: workoutId,
        exercise_id: exercise.id,
        order_index: (workoutDetails?.exercises.length || 0) + index,
      }));

      const { error } = await supabase
        .from("workout_exercises")
        .insert(exercisesToAdd);

      if (error) {
        console.error("Error adding exercises:", error.message);
        return;
      }

      // Refresh workout details
      await fetchWorkoutDetails();
      setShowExerciseSelector(false);
    } catch (error) {
      console.error("Error adding exercises:", error);
    }
  };

  const handleCloseExerciseSelector = () => {
    setShowExerciseSelector(false);
  };

  if (!isOpen) return null;

  // Show exercise selector if needed
  if (showExerciseSelector) {
    return (
      <div className="modal modal-open">
        <div className="modal-box w-full h-full max-w-none p-0 animate-slide-up">
          <ExerciseSelector
            onExerciseSelect={handleExerciseSelect}
            onClose={handleCloseExerciseSelector}
            existingExercises={workoutDetails?.exercises || []}
            title="Add Exercises"
            confirmText="Add"
            showCloseButton={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box w-full h-full p-0 rounded-none animate-slide-up">
        <div className="w-full h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-base-300">
            <h2 className="text-lg font-semibold text-base-content">
              {loading
                ? "Loading..."
                : workoutDetails?.name || "Workout Details"}
            </h2>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <span className="loading loading-spinner loading-md"></span>
              </div>
            ) : workoutDetails ? (
              <div className="space-y-4">
                {/* Exercises */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">
                    Exercises ({workoutDetails.exercises.length})
                  </h4>
                  {workoutDetails.exercises.length === 0 ? (
                    <p className="text-base-content/60">
                      No exercises added to this workout.
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {workoutDetails.exercises.map((exercise) => (
                        <button
                          key={exercise.id}
                          className="btn btn-ghost w-full py-4 text-left bg-base-300 hover:bg-base-200"
                        >
                          <div className="flex items-center justify-between w-full">
                            <Dumbbell className="size-5 text-primary mr-4" />
                            <div className="flex-1 text-left">
                              <div className="font-medium text-base-content">
                                {formatExerciseName(exercise.name)}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-base-content/60">
                  Failed to load workout details.
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {!loading && workoutDetails && (
            <div className="p-4 border-t border-base-300">
              <button
                onClick={handleAddExercises}
                className="btn btn-primary w-full"
              >
                <Plus size={16} className="mr-2" />
                Add Exercises
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailsModal;

"use client";

import { useState, useEffect } from "react";
import { X, Plus, Dumbbell } from "lucide-react";
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
      // Fetch workout details with exercises
      const { data, error } = await supabase
        .from("workouts")
        .select(
          `
          id,
          name,
          description,
          created_at,
          workout_exercises(
            exercise_id,
            order_index,
            exercise_library(
              id,
              name,
              category
            )
          )
        `
        )
        .eq("id", workoutId)
        .single();

      if (error) {
        console.error("Error fetching workout details:", error.message);
        return;
      }

      // Transform the data
      const exercises =
        data.workout_exercises
          ?.sort((a: any, b: any) => a.order_index - b.order_index)
          .map((we: any) => ({
            id: we.exercise_library.id,
            name: we.exercise_library.name,
            category: we.exercise_library.category,
          })) || [];

      setWorkoutDetails({
        id: data.id,
        name: data.name,
        description: data.description,
        created_at: data.created_at,
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
      <div className="fixed inset-0 z-50 bg-base-100">
        <ExerciseSelector
          onExerciseSelect={handleExerciseSelect}
          onClose={handleCloseExerciseSelector}
          existingExercises={workoutDetails?.exercises || []}
          title="Add Exercises"
          confirmText="Add"
          showCloseButton={true}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-base-100">
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h2 className="text-lg font-semibold text-base-content">
            {loading ? "Loading..." : workoutDetails?.name || "Workout Details"}
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
                        className="btn w-full py-4 text-left bg-base-100 hover:bg-base-200 border border-base-300"
                      >
                        <div className="flex items-center justify-between w-full">
                          <Dumbbell className="size-5 text-primary mr-4" />
                          <div className="flex-1 text-left">
                            <div className="font-medium text-base-content">
                              {exercise.name}
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
  );
};

export default WorkoutDetailsModal;

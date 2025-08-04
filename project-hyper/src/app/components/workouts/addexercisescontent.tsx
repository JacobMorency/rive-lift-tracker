"use client";

import supabase from "@/app/lib/supabaseClient";
import { Exercise } from "@/types/workout";
import { toast } from "sonner";
import ExerciseSelector from "../exerciseselector";

type AddExercisesContentProps = {
  workoutId: string;
  onComplete: () => void;
};

const AddExercisesContent = ({
  workoutId,
  onComplete,
}: AddExercisesContentProps) => {
  // Save workout template with exercises
  const handleSaveTemplate = async (selectedExercises: Exercise[]) => {
    try {
      // Only insert exercises if any are selected
      if (selectedExercises.length > 0) {
        const workoutExercises = selectedExercises.map((exercise, index) => ({
          workout_id: workoutId,
          exercise_id: exercise.id,
          order_index: index + 1,
        }));

        const { error } = await supabase
          .from("workout_exercises")
          .insert(workoutExercises);

        if (error) {
          console.error("Error saving workout template:", error.message);
          toast.error("Failed to save workout template");
          return;
        }
      }

      toast.success("Workout template saved successfully!");
      onComplete();
    } catch (error) {
      console.error("Error saving workout template:", error);
      toast.error("Failed to save workout template");
    }
  };

  return (
    <ExerciseSelector
      onExerciseSelect={handleSaveTemplate}
      title="Add Exercises to Workout"
      confirmText="Save"
    />
  );
};

export default AddExercisesContent;

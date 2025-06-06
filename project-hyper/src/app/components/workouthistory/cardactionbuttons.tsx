"use client";

import supabase from "@/app/lib/supabaseClient";
import { toast } from "sonner";
import { NullableNumber } from "@/types/workout";
import { useRouter } from "next/navigation";

type CardActionButtonsProps = {
  workoutId: NullableNumber;
  onDelete: () => void;
};

const CardActionButtons = ({ workoutId, onDelete }: CardActionButtonsProps) => {
  const router = useRouter();

  // Currently requires 4 steps to cascade delete
  const confirmDeleteWorkout = async (
    workoutId: NullableNumber
  ): Promise<void> => {
    // 1. Fetch linked workout_exercises
    const { data: workoutExercises, error: fetchError } = await supabase
      .from("workout_exercises")
      .select("id")
      .eq("workout_id", workoutId);

    if (fetchError) {
      toast.error("Error loading workout data.");
      return;
    }

    const workoutExerciseIds = workoutExercises.map((exercise) => exercise.id);

    // 2. Delete linked sets first
    if (workoutExerciseIds.length > 0) {
      const { error: setsError } = await supabase
        .from("sets")
        .delete()
        .in("workout_exercise_id", workoutExerciseIds);

      if (setsError) {
        toast.error("Error deleting sets.");
        return;
      }
    }

    // 3. Delete linked workout_exercises
    const { error: exercisesError } = await supabase
      .from("workout_exercises")
      .delete()
      .eq("workout_id", workoutId);

    if (exercisesError) {
      toast.error("Error deleting exercises.");
      return;
    }
    // 4. Delete Workout
    const { error: workoutsError } = await supabase
      .from("workouts")
      .delete()
      .eq("id", workoutId);

    if (workoutsError) {
      toast.error("Error deleting workout.");
      return;
    }

    // Wait a tick to let modal close before refreshing
    setTimeout(() => {
      (document.getElementById("delete_modal") as HTMLDialogElement)?.close();
      toast.success("Workout deleted successfully.");
      router.refresh();
      onDelete();
    }, 150);
  };

  return (
    <div className="flex gap-2">
      <button className="btn btn-primary">Edit</button>
      <button
        className="btn btn-error"
        type="button"
        onClick={() =>
          (
            document.getElementById("delete_modal") as HTMLDialogElement
          )?.showModal()
        }
      >
        Delete
      </button>

      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Workout?</h3>
          <p className="py-2">
            Are you sure you want to delete this workout? This action cannot be
            undone.
          </p>
          <div className="modal-action">
            <button
              className="btn btn-primary"
              type="button"
              onClick={() =>
                (
                  document.getElementById("delete_modal") as HTMLDialogElement
                )?.close()
              }
            >
              Back
            </button>
            <button
              className="btn btn-error"
              type="button"
              onClick={() => confirmDeleteWorkout(workoutId)}
            >
              Delete Workout
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CardActionButtons;

import { ExercisesInWorkout } from "@/types/workout";
import { useRouter } from "next/navigation";

type WorkoutActionButtonsProps = {
  handleSaveWorkout: () => void;
  exercisesInWorkout: ExercisesInWorkout[];
  confirmCancelWorkout: () => void;
  isEditing?: boolean;
};

const WorkoutActionButtons = ({
  handleSaveWorkout,
  exercisesInWorkout,
  confirmCancelWorkout,
  isEditing,
}: WorkoutActionButtonsProps) => {
  const router = useRouter();
  return (
    <div>
      <button
        className="w-full my-2 btn btn-primary"
        type="button"
        onClick={handleSaveWorkout}
        disabled={exercisesInWorkout.length <= 0}
      >
        Save Workout
      </button>
      {!isEditing ? (
        <button
          className="w-full btn btn-error"
          type="button"
          onClick={() =>
            (
              document.getElementById("cancel_modal") as HTMLDialogElement
            )?.showModal()
          }
        >
          Cancel Workout
        </button>
      ) : (
        <button
          className="w-full btn btn-error"
          type="button"
          onClick={() =>
            (
              document.getElementById("cancel_modal") as HTMLDialogElement
            )?.showModal()
          }
        >
          Cancel Editing
        </button>
      )}

      <dialog id="cancel_modal" className="modal">
        {!isEditing ? (
          <div className="modal-box">
            <h3 className="font-bold text-lg">Cancel Workout?</h3>
            <p className="py-2">
              Are you sure you want to cancel this workout? Any unsaved progress
              will be lost.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() =>
                  (
                    document.getElementById("cancel_modal") as HTMLDialogElement
                  )?.close()
                }
              >
                Back
              </button>
              <button
                className="btn btn-error"
                type="button"
                onClick={confirmCancelWorkout}
              >
                Cancel Workout
              </button>
            </div>
          </div>
        ) : (
          <div className="modal-box">
            <h3 className="font-bold text-lg">Cancel Editing?</h3>
            <p className="py-2">
              Are you sure you want to cancel editing this workout? Any unsaved
              progress will be lost.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() =>
                  (
                    document.getElementById("cancel_modal") as HTMLDialogElement
                  )?.close()
                }
              >
                Back
              </button>
              <button
                className="btn btn-error"
                type="button"
                onClick={() => {
                  router.push("/workouts");
                  (
                    document.getElementById("cancel_modal") as HTMLDialogElement
                  )?.close();
                }}
              >
                Cancel Editing
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
};

export default WorkoutActionButtons;

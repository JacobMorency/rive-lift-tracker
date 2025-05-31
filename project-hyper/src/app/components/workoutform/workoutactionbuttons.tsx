import { ExercisesInWorkout } from "@/types/workout";

type WorkoutActionButtonsProps = {
  handleSaveWorkout: () => void;
  exercisesInWorkout: ExercisesInWorkout[];
  confirmCancelWorkout: () => void;
};

const WorkoutActionButtons = ({
  handleSaveWorkout,
  exercisesInWorkout,
  confirmCancelWorkout,
}: WorkoutActionButtonsProps) => {
  return (
    <div className="px-4">
      <button
        className="w-full my-2 btn btn-primary"
        type="button"
        onClick={handleSaveWorkout}
        disabled={exercisesInWorkout.length <= 0}
      >
        Save Workout
      </button>
      <button
        className="w-full btn btn-error"
        type="button"
        onClick={() =>
          (
            document.getElementById("cancel_modal") as HTMLDialogElement
          )?.showModal()
        }
      >
        Cancel
      </button>

      <dialog id="cancel_modal" className="modal">
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
      </dialog>
    </div>
  );
};

export default WorkoutActionButtons;

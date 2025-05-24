import { useState } from "react";

const WorkoutActionButtons = ({
  handleSaveWorkout,
  exercisesInWorkout,
  confirmCancelWorkout,
}) => {
  const [isCancelWorkoutDialogOpen, setIsCancelWorkoutDialogOpen] =
    useState(false);
  return (
    <div className="px-4">
      <button
        className="w-full my-2 btn btn-primary"
        type="button"
        onClick={handleSaveWorkout}
        disabled={exercisesInWorkout <= 0}
      >
        Save Workout
      </button>
      <button
        className="w-full btn btn-error"
        type="button"
        onClick={() => setIsCancelWorkoutDialogOpen(true)}
      >
        Cancel
      </button>

      {isCancelWorkoutDialogOpen && (
        <dialog id="cancel_modal" className="modal modal-open">
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
                onClick={() => setIsCancelWorkoutDialogOpen(false)}
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
      )}
    </div>
  );
};

export default WorkoutActionButtons;

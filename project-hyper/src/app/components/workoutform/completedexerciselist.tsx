// import { Button } from "@/components/ui/button";
import { SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";

const CompletedExerciseList = ({
  exercisesInWorkout,
  handleDeleteExercise,
  handleUpdateExercise,
}) => {
  const [isDeleteSetDialogOpen, setIsDeleteSetDialogOpen] = useState(false);
  const [deleteExerciseIndex, setDeleteExerciseIndex] = useState(null);
  const [updateExerciseIndex, setUpdateExerciseIndex] = useState(null);

  const handleConfirmDeleteExercise = () => {
    handleDeleteExercise(deleteExerciseIndex);
    setIsDeleteSetDialogOpen(false);
  };
  return (
    <div className="px-4">
      <h3 className="font-bold text-lg">Exercises Completed This Workout:</h3>
      <ul>
        {exercisesInWorkout.length > 0 ? (
          exercisesInWorkout.map((exercise, index) => (
            <li
              key={exercise.id}
              className="rounded py-3 px-2 my-3 flex items-center justify-between bg-base-100"
            >
              <p>{exercise.name}</p>
              <span className="flex gap-2">
                <button
                  className="btn btn-primary px-2 rounded"
                  type="button"
                  onClick={() => handleUpdateExercise(index)}
                >
                  <SquarePen />
                </button>
                <button
                  className="btn btn-error px-2 rounded"
                  type="button"
                  onClick={() => {
                    setDeleteExerciseIndex(index);
                    setIsDeleteSetDialogOpen(true);
                    document.getElementById("delete_modal")?.showModal();
                  }}
                >
                  <Trash2 />
                </button>
              </span>
            </li>
          ))
        ) : (
          <li>No exercises completed yet.</li>
        )}
      </ul>

      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Remove Exercise</h3>
          <p className="py-2">Are you sure you want to remove this exercise?</p>
          {deleteExerciseIndex !== null && (
            <div className="mb-2">
              <span className="font-bold">Exercise:</span>{" "}
              {exercisesInWorkout[deleteExerciseIndex].name}
            </div>
          )}
          <div className="modal-action">
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                setIsDeleteSetDialogOpen(false);
                document.getElementById("delete_modal")?.close();
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-error"
              type="button"
              onClick={() => {
                handleConfirmDeleteExercise();
                document.getElementById("delete_modal")?.close();
              }}
            >
              Remove
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CompletedExerciseList;

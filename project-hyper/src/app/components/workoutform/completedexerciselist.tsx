import { SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { ExercisesInWorkout } from "@/types/workout";

type CompletedExerciseListProps = {
  exercisesInWorkout: ExercisesInWorkout[];
  handleDeleteExercise: (index: number) => void;
  handleUpdateExercise: (index: number) => void;
};

const CompletedExerciseList = ({
  exercisesInWorkout,
  handleDeleteExercise,
  handleUpdateExercise,
}: CompletedExerciseListProps) => {
  const [deleteExerciseIndex, setDeleteExerciseIndex] = useState<number | null>(
    null
  );

  const handleConfirmDeleteExercise = (): void => {
    if (deleteExerciseIndex !== null) {
      handleDeleteExercise(deleteExerciseIndex);
    }
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
                    (
                      document.getElementById(
                        "delete_modal"
                      ) as HTMLDialogElement
                    )?.showModal();
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
                (
                  document.getElementById("delete_modal") as HTMLDialogElement
                )?.close();
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-error"
              type="button"
              onClick={() => {
                handleConfirmDeleteExercise();
                (
                  document.getElementById("delete_modal") as HTMLDialogElement
                )?.close();
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

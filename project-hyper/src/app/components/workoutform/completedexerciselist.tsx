import { SquarePen, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { ExercisesInWorkout } from "@/types/workout";

type CompletedExerciseListProps = {
  exercisesInWorkout: ExercisesInWorkout[];
  handleDeleteExercise: (index: number) => void;
  handleUpdateExercise: (index: number) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
};

const CompletedExerciseList = ({
  exercisesInWorkout,
  handleDeleteExercise,
  handleUpdateExercise,
  isCollapsed,
  setIsCollapsed,
}: CompletedExerciseListProps) => {
  const [deleteExerciseIndex, setDeleteExerciseIndex] = useState<number | null>(
    null
  );
  const [showAllExercises, setShowAllExercises] = useState(false);

  const handleConfirmDeleteExercise = (): void => {
    if (deleteExerciseIndex !== null) {
      handleDeleteExercise(deleteExerciseIndex);
    }
  };

  // Reverse the exercises array to show latest first
  const reversedExercises = [...exercisesInWorkout].reverse();

  // Show only the latest 3 exercises by default, or all if showAllExercises is true
  const displayedExercises = showAllExercises
    ? reversedExercises
    : reversedExercises.slice(0, 3);
  const hasMoreExercises = exercisesInWorkout.length > 3;

  // If collapsed, show just the count and toggle button
  if (isCollapsed) {
    return (
      <div>
        <button
          type="button"
          className="btn btn-ghost w-full my-2 bg-base-200"
          onClick={() => setIsCollapsed(false)}
        >
          <ChevronDown className="w-4 h-4" />
          Show Completed Exercises ({exercisesInWorkout.length})
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg">Exercises Completed This Workout:</h3>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setIsCollapsed(true)}
        >
          <ChevronUp className="w-4 h-4" />
          Hide
        </button>
      </div>

      {hasMoreExercises && (
        <button
          type="button"
          className="btn btn-ghost w-full my-2 bg-base-200"
          onClick={() => setShowAllExercises(!showAllExercises)}
        >
          {showAllExercises ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show All Exercises ({exercisesInWorkout.length} total)
            </>
          )}
        </button>
      )}

      <ul>
        {displayedExercises.length > 0 ? (
          displayedExercises.map((exercise, displayIndex) => {
            // Calculate the original index for proper operations
            const originalIndex = exercisesInWorkout.length - 1 - displayIndex;
            return (
              <li
                key={exercise.id}
                className="rounded py-3 px-2 my-2 flex items-center justify-between bg-base-100"
              >
                <p>{exercise.name}</p>
                <span className="flex gap-2">
                  <button
                    className="btn btn-primary px-2 rounded"
                    type="button"
                    onClick={() => handleUpdateExercise(originalIndex)}
                  >
                    <SquarePen />
                  </button>
                  <button
                    className="btn btn-error px-2 rounded"
                    type="button"
                    onClick={() => {
                      setDeleteExerciseIndex(originalIndex);
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
            );
          })
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

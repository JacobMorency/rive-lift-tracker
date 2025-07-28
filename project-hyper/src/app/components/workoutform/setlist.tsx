import { SquarePen, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { SetInputs } from "@/types/workout";

type SetListProps = {
  sets: SetInputs[];
  handleUpdateSet: (index: number) => void;
  handleDeleteSet: (index: number) => void;
  exerciseName: string;
};

const SetList = ({
  sets,
  handleUpdateSet,
  handleDeleteSet,
  exerciseName,
}: SetListProps) => {
  const [deleteSetIndex, setDeleteSetIndex] = useState<number | null>(null);
  const [showAllSets, setShowAllSets] = useState(false);

  const handleConfirmDeleteSet = (): void => {
    if (deleteSetIndex !== null) {
      handleDeleteSet(deleteSetIndex);
      (document.getElementById("delete_modal") as HTMLDialogElement)?.close();
    }
  };

  // Reverse the sets array to show latest first
  const reversedSets = [...sets].reverse();

  // Show only the latest 3 sets by default, or all if showAllSets is true
  const displayedSets = showAllSets ? reversedSets : reversedSets.slice(0, 3);
  const hasMoreSets = sets.length > 3;

  return (
    <div>
      <h3 className="font-bold text-lg">Sets for {exerciseName}:</h3>

      {hasMoreSets && (
        <button
          type="button"
          className="btn btn-ghost w-full my-2 bg-base-200"
          onClick={() => setShowAllSets(!showAllSets)}
        >
          {showAllSets ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show All Sets ({sets.length} total)
            </>
          )}
        </button>
      )}

      <ul>
        {displayedSets.map((set, displayIndex) => {
          // Calculate the original index for proper set numbering and operations
          const originalIndex = sets.length - 1 - displayIndex;
          return (
            <li
              key={originalIndex}
              className="rounded bg-base-100 py-3 px-2 my-2 flex items-center justify-between"
            >
              <p>
                <span className="font-bold">Set {originalIndex + 1}:</span>{" "}
                {set.reps} reps at {set.weight} lbs
                {set.partialReps !== null &&
                  set.partialReps > 0 &&
                  ` with ${set.partialReps} partial reps`}
              </p>
              <span className="flex gap-2">
                <button
                  className="bg-primary rounded p-2"
                  type="button"
                  onClick={() => handleUpdateSet(originalIndex)}
                >
                  <SquarePen />
                </button>
                <button
                  className="bg-error rounded p-2"
                  type="button"
                  onClick={() => {
                    setDeleteSetIndex(originalIndex);
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
        })}
      </ul>

      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Delete Set {deleteSetIndex !== null ? deleteSetIndex + 1 : ""}
          </h3>
          <p className="py-2">Are you sure you want to delete this set?</p>
          {deleteSetIndex !== null && sets[deleteSetIndex] && (
            <div className="mb-2">
              <span className="font-bold">Set {deleteSetIndex + 1}:</span>{" "}
              {sets[deleteSetIndex].reps} reps at {sets[deleteSetIndex].weight}{" "}
              lbs
              {sets[deleteSetIndex].partialReps !== null &&
                sets[deleteSetIndex].partialReps > 0 &&
                ` with ${sets[deleteSetIndex].partialReps} partial reps`}
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
              onClick={handleConfirmDeleteSet}
            >
              Delete
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default SetList;

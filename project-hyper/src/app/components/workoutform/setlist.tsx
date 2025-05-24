// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
import { SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";

const SetList = ({ sets, handleUpdateSet, handleDeleteSet, exerciseName }) => {
  const [deleteSetIndex, setDeleteSetIndex] = useState(null);
  const [isDeleteSetDialogOpen, setIsDeleteSetDialogOpen] = useState(false);

  const handleConfirmDeleteSet = () => {
    handleDeleteSet(deleteSetIndex);
    setIsDeleteSetDialogOpen(false);
  };
  return (
    <div className="px-4">
      <h3 className="font-bold text-lg">Sets for {exerciseName}:</h3>
      <ul>
        {sets.map((set, index) => (
          <li
            key={index}
            className="rounded bg-base-100 py-3 px-2 my-3 flex items-center justify-between"
          >
            <p>
              <span className="font-bold">Set {index + 1}:</span> {set.reps}{" "}
              reps at {set.weight} lbs
              {set.partialReps > 0 && ` with ${set.partialReps} partial reps`}
            </p>
            <span className="flex gap-2">
              <button
                className="bg-primary rounded p-2"
                type="button"
                onClick={() => handleUpdateSet(index)}
              >
                <SquarePen />
              </button>
              <button
                className="bg-error rounded p-2"
                type="button"
                onClick={() => {
                  setDeleteSetIndex(index);
                  setIsDeleteSetDialogOpen(true);
                  document.getElementById("delete_modal").showModal();
                }}
              >
                <Trash2 />
              </button>
            </span>
          </li>
        ))}
      </ul>

      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Delete Set {deleteSetIndex !== null ? deleteSetIndex + 1 : ""}
          </h3>
          <p className="py-2">Are you sure you want to delete this set?</p>
          {deleteSetIndex !== null && (
            <div className="mb-2">
              <span className="font-bold">Set {deleteSetIndex + 1}:</span>{" "}
              {sets[deleteSetIndex].reps} reps at {sets[deleteSetIndex].weight}{" "}
              lbs
              {sets[deleteSetIndex].partialReps > 0 &&
                ` with ${sets[deleteSetIndex].partialReps} partial reps`}
            </div>
          )}
          <div className="modal-action">
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                setIsDeleteSetDialogOpen(false);
                document.getElementById("delete_modal").close();
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

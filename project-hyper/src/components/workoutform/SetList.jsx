import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
    <div>
      <h3 className="font-bold text-lg my-3">Sets for {exerciseName}</h3>
      <ul>
        {sets.map((set, index) => (
          <li
            key={index}
            className="rounded border py-3 px-2 my-1 flex items-center justify-between"
          >
            <p>
              <span className="font-bold">Set {index + 1}:</span> {set.reps}{" "}
              reps at {set.weight} lbs
              {set.partialReps > 0 && ` with ${set.partialReps} partial reps`}
            </p>
            <span className="flex gap-2">
              <Button
                className="bg-clear border hover:bg-neutral-300"
                type="button"
                onClick={() => handleUpdateSet(index)}
              >
                <SquarePen className="text-black" />
              </Button>
              <Dialog
                open={isDeleteSetDialogOpen}
                onOpenChange={setIsDeleteSetDialogOpen}
              >
                <DialogTrigger asChild>
                  <div>
                    <Button
                      className="bg-red-500 hover:bg-red-900"
                      type="button"
                      onClick={() => {
                        setDeleteSetIndex(index);
                        setIsDeleteSetDialogOpen(true);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </DialogTrigger>
                {deleteSetIndex !== null && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Set {deleteSetIndex + 1}</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this set?
                      </DialogDescription>
                    </DialogHeader>
                    <div>
                      <p>
                        <span className="font-bold">
                          Set {deleteSetIndex + 1}:
                        </span>{" "}
                        {sets[deleteSetIndex].reps} reps at{" "}
                        {sets[deleteSetIndex].weight} lbs
                        {sets[deleteSetIndex].partialReps > 0 &&
                          ` with ${sets[deleteSetIndex].partialReps} partial reps`}
                      </p>
                    </div>

                    <DialogFooter>
                      <Button
                        className="bg-clear border hover:bg-neutral-300 text-black"
                        onClick={() => setIsDeleteSetDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-red-500 hover:bg-red-900"
                        onClick={handleConfirmDeleteSet}
                        type="button"
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SetList;

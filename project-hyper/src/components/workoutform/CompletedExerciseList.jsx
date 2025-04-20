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

const CompletedExerciseList = ({ exercisesInWorkout }) => {
  const [isDeleteSetDialogOpen, setIsDeleteSetDialogOpen] = useState(false);
  return (
    <div>
      <h3 className="font-bold text-lg my-3">
        Exercises Completed This Workout:
      </h3>
      <ul>
        {exercisesInWorkout.length > 0 ? (
          exercisesInWorkout.map((exercise) => (
            <li
              key={exercise.id}
              className="rounded border py-3 px-2 my-1 flex items-center justify-between"
            >
              <p>{exercise.name}</p>
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
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Remove Exercise</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to remove this exercise?
                      </DialogDescription>
                    </DialogHeader>
                    <div>
                      <p>{exercise.name}</p>
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
                        type="button"
                      >
                        Remove
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </span>
            </li>
          ))
        ) : (
          <li>No exercises completed yet.</li>
        )}
      </ul>
    </div>
  );
};

export default CompletedExerciseList;

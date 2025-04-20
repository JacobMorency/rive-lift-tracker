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
import { useState } from "react";

const WorkoutActionButtons = ({
  handleSaveWorkout,
  exercisesInWorkout,
  confirmCancelWorkout,
}) => {
  const [isCancelWorkoutDialogOpen, setIsCancelWorkoutDialogOpen] =
    useState(false);
  return (
    <div>
      <Button
        className="w-full my-2"
        type="button"
        onClick={handleSaveWorkout}
        disabled={exercisesInWorkout <= 0}
      >
        Save Workout
      </Button>
      <Button
        className="w-full bg-error"
        type="button"
        onClick={() => setIsCancelWorkoutDialogOpen(true)}
      >
        Cancel
      </Button>
      <Dialog
        open={isCancelWorkoutDialogOpen}
        onOpenChange={setIsCancelWorkoutDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Workout?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this workout? Any unsaved progress
              will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="bg-clear border hover:bg-neutral-300 text-black"
              onClick={() => setIsCancelWorkoutDialogOpen(false)}
            >
              Back
            </Button>
            <Button
              className="bg-error hover:bg-red-900"
              onClick={confirmCancelWorkout}
              type="button"
            >
              Cancel Workout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkoutActionButtons;

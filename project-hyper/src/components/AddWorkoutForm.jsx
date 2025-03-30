import ExerciseSelector from "../components/ExerciseSelector";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { SquarePen, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddWorkoutForm = ({ workoutId }) => {
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseId, setExerciseId] = useState(null);
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState([]);
  const [weight, setWeight] = useState("");
  const [partialReps, setPartialReps] = useState("");
  const [exercisesInWorkout, setExercisesInWorkout] = useState([]);
  const [completedSets, setCompletedSets] = useState([]);
  const [updateSetIndex, setUpdateSetIndex] = useState(null);
  const [isSetUpdating, setIsSetUpdating] = useState(false);
  const [deleteSetIndex, setDeleteSetIndex] = useState(null);
  const [isDeleteSetDialogOpen, setIsDeleteSetDialogOpen] = useState(false);
  const [isAddExerciseDialogOpen, setIsAddExerciseDialogOpen] = useState(false);
  const [isCancelWorkoutDialogOpen, setIsCancelWorkoutDialogOpen] =
    useState(false);
  const [repsEmpty, setRepsEmpty] = useState(false);
  const [weightEmpty, setWeightEmpty] = useState(false);
  const [repsInvalid, setRepsInvalid] = useState(false);
  const [weightInvalid, setWeightInvalid] = useState(false);
  const [partialRepsInvalid, setPartialRepsInvalid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isIntialized, setIsInitialized] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCompleteWorkout = () => {
    localStorage.removeItem("workoutId");
    localStorage.removeItem("workoutProgress");
    navigate("/workouts");
  };

  const handleSaveWorkout = async () => {
    for (const completedSet of completedSets) {
      const { data: workoutExercisesData, error: exerciseError } =
        await supabase
          .from("workout_exercises")
          .insert([
            {
              exercise_id: completedSet.exerciseId,
              workout_id: workoutId,
              created_at: new Date(),
            },
          ])
          .select("id")
          .single();
      if (exerciseError) {
        console.error("Error adding exercise to workout:", error.message);
        return;
      }

      const setsData = completedSet.sets.map((set, index) => ({
        workout_exercise_id: workoutExercisesData.id,
        set_number: index + 1,
        weight: set.weight,
        reps: set.reps,
        partial_reps: set.partialReps,
        exercise_name: completedSet.exerciseName,
        workout_id: workoutId,
      }));

      const { error: setsError } = await supabase.from("sets").insert(setsData);
      if (setsError) {
        console.error("Error adding sets to workout:", setsError.message);
        return;
      } else {
        console.log("Sets added to workout successfully");
      }
    }

    const { data: workoutData, error } = await supabase
      .from("workouts")
      .update({ is_complete: true })
      .eq("id", workoutId)
      .select();
    if (error) {
      console.error("Error saving workout:", error.message);
      return;
    }
    handleCompleteWorkout();
  };

  const handleAddSet = () => {
    let hasError = false;
    setRepsEmpty(false);
    setWeightEmpty(false);
    setRepsInvalid(false);
    setWeightInvalid(false);
    setPartialRepsInvalid(false);

    if (!reps) {
      setRepsEmpty(true);
      hasError = true;
    } else if (reps <= 0) {
      setRepsInvalid(true);
      hasError = true;
    }

    if (!weight) {
      setWeightEmpty(true);
      hasError = true;
    } else if (weight <= 0) {
      setWeightInvalid(true);
      hasError = true;
    }

    if (partialReps < 0) {
      setPartialRepsInvalid(true);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const numReps = parseInt(reps);
    const numWeight = Number(weight);
    if (numReps > 0 && numWeight > 0) {
      setSets((prevSets) => [
        ...prevSets,
        {
          exerciseId: exerciseId,
          reps: numReps,
          weight: numWeight,
          partialReps: Number(partialReps) || 0, // Default to 0 if partial reps is empty
        },
      ]);
    }
    setReps("");
    setWeight("");
    setPartialReps("");
  };

  const handleUpdateSet = (index) => {
    const setToUpdate = sets[index];
    setReps(setToUpdate.reps);
    setWeight(setToUpdate.weight);
    setPartialReps(setToUpdate.partialReps);
    setUpdateSetIndex(index);
    setIsSetUpdating(true); // TODO: Might need to change implementation
    setUpdateSetIndex(index);
  };

  const handleSaveUpdatedSet = () => {
    const updatedSet = {
      reps: parseInt(reps),
      weight: Number(weight),
      partialReps: Number(partialReps) || 0,
    };
    const updatedSets = sets.map((set, index) =>
      index === updateSetIndex ? updatedSet : set
    );
    setSets(updatedSets);
    setIsSetUpdating(false);
    setReps("");
    setWeight("");
    setPartialReps("");
    setUpdateSetIndex(null);
  };

  const handleDeleteSet = (index) => {
    setIsDeleteSetDialogOpen(true);
    setDeleteSetIndex(index);
  };

  const handleConfirmDeleteSet = () => {
    const updatedSets = sets.filter((set, i) => i !== deleteSetIndex);
    setSets(updatedSets);
    setIsDeleteSetDialogOpen(false);
  };

  const checkUnsavedChanges = () => {
    if (reps || weight || partialReps > 0) {
      return true;
    } else {
      return false;
    }
  };

  const handleAddExerciseToWorkout = () => {
    if (!checkUnsavedChanges()) {
      handleConfirmAddExerciseToWorkout();
    } else {
      setIsAddExerciseDialogOpen(true);
      return;
    }
  };

  const handleConfirmAddExerciseToWorkout = async () => {
    setCompletedSets((prev) => [
      ...prev,
      {
        exerciseId: exerciseId,
        exerciseName: exerciseName,
        sets: sets,
      },
    ]);
    setExercisesInWorkout((prev) => [
      ...prev,
      { id: exerciseId, name: exerciseName },
    ]);
    setSets([]);
    resetFormFields();
  };

  const fetchCompletedExercises = async () => {
    if (!workoutId) {
      console.error("No workout ID provided.");
      return;
    }

    const { data, error } = await supabase
      .from("workout_exercises")
      .select("exercise_id")
      .eq("workout_id", workoutId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching completed exercises:", error.message);
      return;
    }

    const exerciseNames = await Promise.all(
      data.map(async (exercise) => {
        const exerciseName = await getExerciseNameById(exercise.exercise_id);
        return {
          id: exercise.exercise_id,
          name: exerciseName,
        };
      })
    );

    setExercisesInWorkout(exerciseNames);
  };

  const getExerciseNameById = async (exerciseId) => {
    const { data, error } = await supabase
      .from("exercise_library")
      .select("name")
      .eq("id", exerciseId)
      .single();
    if (error) {
      console.error("Error fetching exercise name:", error.message);
      return;
    }
    return data.name;
  };

  const resetFormFields = () => {
    setExerciseName("");
    setReps("");
    setWeight("");
    setPartialReps("");
  };

  const cancelUpdateSet = () => {
    setIsSetUpdating(false);
    setReps("");
    setWeight("");
    setPartialReps("");
  };

  // TODO: Remove workout from db if cancelled
  const confirmCancelWorkout = () => {
    handleCompleteWorkout();
  };
  const handleCancelWorkout = () => {
    setIsCancelWorkoutDialogOpen(true);
  };

  useEffect(() => {
    const savedProgress = localStorage.getItem("workoutProgress");
    if (savedProgress) {
      try {
        const [
          savedCompletedSets,
          savedExerciseId,
          savedExerciseName,
          savedExercisesInWorkout,
          savedReps,
          savedWeight,
          savedPartialReps,
        ] = JSON.parse(savedProgress);
        if (savedCompletedSets) {
          setSets(savedCompletedSets);
        }
        if (savedExerciseId) {
          setExerciseId(savedExerciseId);
        }
        if (savedExerciseName) {
          setExerciseName(savedExerciseName);
        }
        if (savedExercisesInWorkout) {
          setExercisesInWorkout(savedExercisesInWorkout);
        }
        if (savedReps) {
          setReps(savedReps);
        }
        if (savedWeight) {
          setWeight(savedWeight);
        }
        if (savedPartialReps) {
          setPartialReps(savedPartialReps);
        }
      } catch (error) {
        console.error("Error parsing saved progress:", error);
        return;
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    } else {
      setLoading(false);
      setIsInitialized(true);
    }
  }, [isIntialized]);

  useEffect(() => {
    if (isIntialized) {
      localStorage.setItem(
        "workoutProgress",
        JSON.stringify([
          completedSets,
          exerciseId,
          exerciseName,
          exercisesInWorkout,
          reps,
          weight,
          partialReps,
        ])
      );
    }
  }, [
    completedSets,
    exerciseId,
    exerciseName,
    exercisesInWorkout,
    reps,
    weight,
    partialReps,
  ]);

  useEffect(() => {
    if (workoutId) {
      fetchCompletedExercises();
    }
  }, [workoutId]);

  if (loading) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  return (
    <div>
      <form action="">
        <div className="my-3">
          <ExerciseSelector
            exerciseName={exerciseName}
            setExerciseName={setExerciseName}
            setExerciseId={setExerciseId}
            isSetUpdating={isSetUpdating}
            isSetsEmpty={sets.length === 0}
            exercisesInWorkout={exercisesInWorkout}
          />
        </div>
        {exerciseName && (
          <div>
            <div className="flex space-x-3 my-3">
              <div className="my-3">
                <Label htmlFor="reps">Reps</Label>
                <Input
                  type="number"
                  id="reps"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="0"
                  className={repsEmpty || repsInvalid ? "border-error" : ""}
                />
                {repsEmpty && (
                  <p className="text-error italic text-sm">Reps required</p>
                )}
                {repsInvalid && (
                  <p className="text-error italic text-sm">
                    Invalid amount of reps
                  </p>
                )}
              </div>
              <div className="my-3">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0 (lbs)"
                  className={weightEmpty || weightInvalid ? "border-error" : ""}
                />
                {weightEmpty && (
                  <p className="text-error italic text-sm">Weight required</p>
                )}
                {weightInvalid && (
                  <p className="text-error italic text-sm">
                    Invalid amount of weight
                  </p>
                )}
              </div>
              {/* TODO: Add a help icon and potentially a toggle for partial reps */}
              <div className="my-3">
                <Label htmlFor="partialReps">Partial Reps</Label>
                <Input
                  type="number"
                  id="partialReps"
                  value={partialReps}
                  onChange={(e) => setPartialReps(e.target.value)}
                  placeholder="0 (optional)"
                  className={partialRepsInvalid ? "border-error" : ""}
                />
                {partialRepsInvalid && (
                  <p className="text-error italic text-sm">
                    Invalid amount of partial reps
                  </p>
                )}
              </div>
            </div>
            <div>
              {!isSetUpdating && (
                <Button className="w-full" onClick={handleAddSet} type="button">
                  Add Set
                </Button>
              )}
              {isSetUpdating && (
                <div className="flex flex-col space-y-1">
                  <Button
                    className="w-full"
                    onClick={handleSaveUpdatedSet}
                    type="button"
                  >
                    Update Set {updateSetIndex + 1}
                  </Button>
                  <Button
                    className="w-full bg-clear border hover:bg-neutral-300 text-black"
                    type="button"
                    onClick={cancelUpdateSet}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
            {sets.length > 0 && (
              <div>
                {/* TODO: make this a list or table */}
                <div>
                  <h3 className="font-bold text-lg my-3">
                    Sets for {exerciseName}:
                  </h3>
                  <ul>
                    {sets.map((set, index) => (
                      <li
                        key={index}
                        className="rounded border py-3 px-2 my-1 flex items-center justify-between"
                      >
                        <p>
                          <span className="font-bold">Set {index + 1}:</span>{" "}
                          {set.reps} reps at {set.weight} lbs
                          {set.partialReps > 0 &&
                            ` with ${set.partialReps} partial reps`}
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
                                  onClick={() => handleDeleteSet(index)}
                                >
                                  <Trash2 />
                                </Button>
                              </div>
                            </DialogTrigger>
                            {deleteSetIndex !== null && (
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Delete Set {deleteSetIndex + 1}
                                  </DialogTitle>
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
                                    onClick={() =>
                                      setIsDeleteSetDialogOpen(false)
                                    }
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
                <div>
                  <Button
                    className="w-full my-3"
                    type="button"
                    onClick={handleAddExerciseToWorkout}
                    disabled={sets.length === 0 || isSetUpdating}
                  >
                    Add Exercise to Workout
                  </Button>
                  <Dialog
                    open={isAddExerciseDialogOpen}
                    onOpenChange={setIsAddExerciseDialogOpen}
                  >
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Unsaved Changes</DialogTitle>
                        <DialogDescription>
                          You have unsaved changes. If you continue, any unsaved
                          progress will be lost. Do you still want to add this
                          exercise?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          className="bg-clear border hover:bg-neutral-300 text-black"
                          onClick={() => setIsAddExerciseDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-error hover:bg-red-900"
                          onClick={handleConfirmAddExerciseToWorkout}
                          type="button"
                        >
                          Add Exercise
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}
          </div>
        )}
        <div>
          <h3 className="font-bold text-lg my-3">
            Exercises Completed This Workout:
          </h3>
          <ul>
            {exercisesInWorkout.length > 0 ? (
              exercisesInWorkout.map((exercise) => (
                <li key={exercise.id}>{exercise.name}</li>
              ))
            ) : (
              <li>No exercises completed yet.</li>
            )}
          </ul>
        </div>
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
            onClick={handleCancelWorkout}
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
                  Are you sure you want to cancel this workout? Any unsaved
                  progress will be lost.
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
      </form>
    </div>
  );
};

export default AddWorkoutForm;

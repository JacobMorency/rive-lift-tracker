import ExerciseSelector from "@/app/components/workoutform/exerciseselector";
import SetList from "@/app/components/workoutform/setlist";
import CompletedExerciseList from "@/app/components/workoutform/completedexerciselist";
import WorkoutActionButtons from "@/app/components/workoutform/workoutactionbuttons";
import SetInputForm from "@/app/components/workoutform/setinputform";
import AddExerciseButton from "@/app/components/workoutform/addexercisebuttons";
import { useState, useEffect } from "react";
import supabase from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { ExercisesInWorkout, NullableNumber, SetInputs } from "@/types/workout";
import { toast } from "sonner";

type AddWorkoutFormProps = {
  workoutId: number;
  isEditing?: boolean;
};

type CompletedSet = {
  exerciseId: NullableNumber;
  exerciseName: string;
  sets: SetInputs[];
};

const AddWorkoutForm = ({ workoutId, isEditing }: AddWorkoutFormProps) => {
  const [exerciseName, setExerciseName] = useState<string>("");
  const [exerciseId, setExerciseId] = useState<NullableNumber>(null);
  const [reps, setReps] = useState<NullableNumber>(null);
  const [sets, setSets] = useState<SetInputs[]>([]);
  const [weight, setWeight] = useState<NullableNumber>(null);
  const [partialReps, setPartialReps] = useState<NullableNumber>(null);
  const [exercisesInWorkout, setExercisesInWorkout] = useState<
    ExercisesInWorkout[]
  >([]);
  const [completedSets, setCompletedSets] = useState<CompletedSet[]>([]);
  const [updateSetIndex, setUpdateSetIndex] = useState<NullableNumber>(null);
  const [isSetUpdating, setIsSetUpdating] = useState<boolean>(false);
  const [updateExerciseIndex, setUpdateExerciseIndex] =
    useState<NullableNumber>(null);
  const [isExerciseUpdating, setIsExerciseUpdating] = useState<boolean>(false);
  const [repsEmpty, setRepsEmpty] = useState<boolean>(false);
  const [weightEmpty, setWeightEmpty] = useState<boolean>(false);
  const [repsInvalid, setRepsInvalid] = useState<boolean>(false);
  const [weightInvalid, setWeightInvalid] = useState<boolean>(false);
  const [partialRepsInvalid, setPartialRepsInvalid] = useState<boolean>(false);

  // Real-time validation states
  const [repsError, setRepsError] = useState<string>("");
  const [weightError, setWeightError] = useState<string>("");
  const [partialRepsError, setPartialRepsError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [repeatLastSet, setRepeatLastSet] = useState<boolean>(false);
  const [
    isCompletedExerciseListCollapsed,
    setIsCompletedExerciseListCollapsed,
  ] = useState<boolean>(false);

  const router = useRouter();

  // Auto-save functionality
  const AUTO_SAVE_KEY = `workout_autosave_${workoutId}`;
  const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

  const saveWorkoutProgress = () => {
    const workoutProgress = {
      exerciseName,
      exerciseId,
      reps,
      weight,
      partialReps,
      sets,
      exercisesInWorkout,
      completedSets,
      updateSetIndex,
      isSetUpdating,
      updateExerciseIndex,
      isExerciseUpdating,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(workoutProgress));
      console.log("Workout progress auto-saved");
    } catch (error) {
      console.error("Failed to auto-save workout progress:", error);
    }
  };

  const loadWorkoutProgress = () => {
    try {
      const savedProgress = localStorage.getItem(AUTO_SAVE_KEY);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);

        // Only restore if the save is less than 24 hours old
        const isRecent = Date.now() - progress.timestamp < 24 * 60 * 60 * 1000;

        if (isRecent) {
          setExerciseName(progress.exerciseName || "");
          setExerciseId(progress.exerciseId || null);
          setReps(progress.reps || null);
          setWeight(progress.weight || null);
          setPartialReps(progress.partialReps || null);
          setSets(progress.sets || []);
          setExercisesInWorkout(progress.exercisesInWorkout || []);
          setCompletedSets(progress.completedSets || []);
          setUpdateSetIndex(progress.updateSetIndex || null);
          setIsSetUpdating(progress.isSetUpdating || false);
          setUpdateExerciseIndex(progress.updateExerciseIndex || null);
          setIsExerciseUpdating(progress.isExerciseUpdating || false);

          console.log("Workout progress restored from auto-save");
          return true;
        }
      }
    } catch (error) {
      console.error("Failed to load auto-saved workout progress:", error);
    }
    return false;
  };

  const clearWorkoutProgress = () => {
    try {
      localStorage.removeItem(AUTO_SAVE_KEY);
      console.log("Workout progress cleared");
    } catch (error) {
      console.error("Failed to clear auto-saved workout progress:", error);
    }
  };

  // Auto-save effect
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      // Only auto-save if there's actual progress (not just initialized)
      if (
        isInitialized &&
        (sets.length > 0 || exercisesInWorkout.length > 0 || exerciseName)
      ) {
        saveWorkoutProgress();
      }
    }, AUTO_SAVE_INTERVAL);

    return () => {
      clearInterval(autoSaveInterval);
    };
  }, [sets, exercisesInWorkout, exerciseName, isInitialized]);

  // Save on component unmount
  useEffect(() => {
    return () => {
      if (
        isInitialized &&
        (sets.length > 0 || exercisesInWorkout.length > 0 || exerciseName)
      ) {
        saveWorkoutProgress();
      }
    };
  }, [sets, exercisesInWorkout, exerciseName, isInitialized]);

  // Real-time validation effects
  useEffect(() => {
    if (reps === null) {
      setRepsError("");
    } else if (reps <= 0) {
      setRepsError("Reps must be greater than 0");
    } else if (reps > 999) {
      setRepsError("Reps cannot exceed 999");
    } else {
      setRepsError("");
    }
  }, [reps]);

  useEffect(() => {
    if (weight === null) {
      setWeightError("");
    } else if (weight <= 0) {
      setWeightError("Weight must be greater than 0");
    } else if (weight > 9999) {
      setWeightError("Weight cannot exceed 9999");
    } else {
      setWeightError("");
    }
  }, [weight]);

  useEffect(() => {
    if (partialReps === null) {
      setPartialRepsError("");
    } else if (partialReps < 0) {
      setPartialRepsError("Partial reps cannot be negative");
    } else if (partialReps > 999) {
      setPartialRepsError("Partial reps cannot exceed 999");
    } else {
      setPartialRepsError("");
    }
  }, [partialReps]);

  const handleCompleteWorkout = (): void => {
    localStorage.removeItem("workoutId");
    localStorage.removeItem("workoutProgress");
    clearWorkoutProgress(); // Clear auto-save when workout is completed
    router.push("/workouts");
  };

  const handleSaveWorkout = async (): Promise<void> => {
    if (exercisesInWorkout.length === 0) {
      toast.error("Please add at least one exercise to your workout.");
      return;
    }

    try {
      // Save each exercise and its sets
      for (const exercise of exercisesInWorkout) {
        const { data: workoutExercise, error: exerciseError } = await supabase
          .from("workout_exercises")
          .insert({
            workout_id: workoutId,
            exercise_id: exercise.id,
          })
          .select()
          .single();

        if (exerciseError) {
          console.error("Error saving exercise:", exerciseError);
          toast.error("Failed to save exercise.");
          return;
        }

        // Save sets for this exercise
        const exerciseSets = sets.filter(
          (set) => set.exerciseId === exercise.id
        );
        if (exerciseSets.length > 0) {
          const setsToInsert = exerciseSets.map((set, index) => ({
            workout_exercise_id: workoutExercise.id,
            set_number: index + 1,
            reps: set.reps,
            weight: set.weight,
            partial_reps: set.partialReps,
          }));

          const { error: setsError } = await supabase
            .from("sets")
            .insert(setsToInsert);

          if (setsError) {
            console.error("Error saving sets:", setsError);
            toast.error("Failed to save sets.");
            return;
          }
        }
      }

      clearWorkoutProgress(); // Clear auto-save when workout is saved
      toast.success("Workout saved successfully!");
      handleCompleteWorkout();
    } catch (error) {
      console.error("Error saving workout:", error);
      toast.error("Failed to save workout.");
    }
  };

  const handleAddSet = (): void => {
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
    } else if (reps > 999) {
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

    if (partialReps) {
      if (partialReps < 0) {
        setPartialRepsInvalid(true);
        hasError = true;
      } else if (partialReps > 999) {
        setPartialRepsInvalid(true);
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }

    if (reps && weight) {
      if (reps > 0 && weight > 0) {
        setSets((prevSets) => [
          ...prevSets,
          {
            exerciseId: exerciseId,
            reps: reps,
            weight: weight,
            partialReps: partialReps || 0, // Default to 0 if partial reps is empty
          },
        ]);
      }
      setReps(null);
      setWeight(null);
      setPartialReps(null);
    }
  };

  const handleUpdateSet = (index: NullableNumber): void => {
    if (index !== null) {
      const setToUpdate = sets[index];
      setReps(setToUpdate.reps);
      setWeight(setToUpdate.weight);
      setPartialReps(setToUpdate.partialReps);
      setUpdateSetIndex(index);
      setIsSetUpdating(true);
      setUpdateSetIndex(index);
    }
  };

  const handleSaveUpdatedSet = (): void => {
    if (reps === null || weight === null) {
      return;
    }
    const updatedSet = {
      exerciseId: exerciseId,
      reps: reps,
      weight: weight,
      partialReps: partialReps || 0,
    };
    const updatedSets = sets.map((set, index) =>
      index === updateSetIndex ? updatedSet : set
    );
    setSets(updatedSets);
    setIsSetUpdating(false);
    setReps(null);
    setWeight(null);
    setPartialReps(null);
    setUpdateSetIndex(null);
  };

  const handleDeleteSet = (index: NullableNumber): void => {
    const updatedSets = sets.filter((set, i) => i !== index);
    setSets(updatedSets);

    if (updatedSets.length === 0 && isExerciseUpdating) {
      setIsExerciseUpdating(false);
      setUpdateExerciseIndex(null);
      resetFormFields();
      if (updateExerciseIndex !== null) {
        handleDeleteExercise(updateExerciseIndex);
      }
    }
  };

  const handleDeleteExercise = (index: NullableNumber): void => {
    const updatedExercisesInWorkout = exercisesInWorkout.filter(
      (exercise, i) => i !== index
    );
    const updatedCompletedSets = completedSets.filter((set, i) => i !== index);

    setExercisesInWorkout(updatedExercisesInWorkout);
    setCompletedSets(updatedCompletedSets);
  };

  const handleUpdateExercise = (index: NullableNumber): void => {
    if (index !== null) {
      const completedSet = completedSets[index];
      setExerciseName(completedSet.exerciseName);
      setExerciseId(completedSet.exerciseId);
      setSets(
        completedSet.sets.map((set) => ({
          exerciseId: completedSet.exerciseId,
          reps: set.reps,
          weight: set.weight,
          partialReps: set.partialReps || 0, // Default to 0 if partial reps is empty
        }))
      );
      setIsExerciseUpdating(true);
      setUpdateExerciseIndex(index);
    }
  };

  const checkUnsavedChanges = (): boolean => {
    if (reps || weight || (partialReps !== null && partialReps > 0)) {
      return true;
    } else {
      return false;
    }
  };

  const handleAddExerciseToWorkout = (): void => {
    if (!checkUnsavedChanges()) {
      handleConfirmAddExerciseToWorkout();
    } else {
      return;
    }
  };

  const handleConfirmAddExerciseToWorkout = async (): Promise<void> => {
    if (isExerciseUpdating && updateExerciseIndex !== null) {
      // Replaces the old completedSet with a new one with updates
      const updatedCompletedSets = [...completedSets];

      updatedCompletedSets[updateExerciseIndex] = {
        exerciseId,
        exerciseName,
        sets: sets.map((set) => ({
          exerciseId,
          reps: set.reps,
          weight: set.weight,
          partialReps: set.partialReps || 0,
        })),
      };
      setCompletedSets(updatedCompletedSets);

      const updatedExercisesInWorkout = [...exercisesInWorkout];
      updatedExercisesInWorkout[updateExerciseIndex] = {
        id: exerciseId,
        name: exerciseName,
      };
      setExercisesInWorkout(updatedExercisesInWorkout);
    } else {
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
    }
    setIsExerciseUpdating(false);
    setUpdateExerciseIndex(null);
    setSets([]);
    resetFormFields();
  };

  const resetFormFields = (): void => {
    setExerciseName("");
    setReps(null);
    setWeight(null);
    setPartialReps(null);
  };

  const cancelUpdateSet = (): void => {
    setIsSetUpdating(false);
    setReps(null);
    setWeight(null);
    setPartialReps(null);
  };

  const confirmCancelWorkout = async (): Promise<void> => {
    const { error } = await supabase
      .from("workouts")
      .delete()
      .eq("id", workoutId);

    if (error) {
      console.error("Error deleting workout:", error.message);
    } else {
      console.log("Workout deleted successfully.");
    }
    handleCompleteWorkout();
  };

  // Get previous workout progress from local storage so its persisted upon refresh
  useEffect(() => {
    if (isEditing) return;
    const savedProgress = localStorage.getItem("workoutProgress");
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        if (progress.completedSets) {
          setCompletedSets(progress.completedSets);
          const derivedExercises = progress.completedSets.map(
            (ex: CompletedSet) => ({
              id: ex.exerciseId,
              name: ex.exerciseName,
            })
          );
          setExercisesInWorkout(derivedExercises);
        }
        if (progress.exerciseId) {
          setExerciseId(progress.exerciseId);
        }
        if (progress.exerciseName) {
          setExerciseName(progress.exerciseName);
        }
        if (progress.reps) {
          setReps(progress.reps);
        }
        if (progress.weight) {
          setWeight(progress.weight);
        }
        if (progress.partialReps) {
          setPartialReps(progress.partialReps);
        }
        if (progress.sets) {
          setSets(progress.sets);
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
  }, [isInitialized, isEditing]);

  // Save the current workout progress to local storage so that it can be retrieved upon refresh or page change
  useEffect(() => {
    if (isInitialized) {
      const progress = {
        completedSets,
        exerciseId,
        exerciseName,
        exercisesInWorkout,
        reps,
        weight,
        partialReps,
        sets,
      };
      localStorage.setItem("workoutProgress", JSON.stringify(progress));
    }
  }, [
    completedSets,
    exerciseId,
    exerciseName,
    exercisesInWorkout,
    reps,
    weight,
    partialReps,
    sets,
    isInitialized,
  ]);

  // If the workout is being edited, fetch the existing workout data
  useEffect(() => {
    if (!isEditing || !workoutId) return;

    const loadCompletedWorkout = async (): Promise<void> => {
      if (isEditing) {
        try {
          // Try to load auto-saved progress first
          const autoSaveRestored = loadWorkoutProgress();
          if (autoSaveRestored) {
            toast.success("Workout progress restored from auto-save");
            setLoading(false);
            setIsInitialized(true);
            return;
          }

          const { data: workoutExercises, error: workoutExercisesError } =
            await supabase
              .from("workout_exercises")
              .select("*")
              .eq("workout_id", workoutId);

          if (workoutExercisesError) {
            console.error(
              "Error fetching workout exercises:",
              workoutExercisesError.message
            );
            return;
          }

          const { data: exerciseNames, error: exerciseNamesError } =
            await supabase.from("exercise_library").select("*");

          if (exerciseNamesError) {
            console.error(
              "Error fetching exercise names:",
              exerciseNamesError.message
            );
            return;
          }

          const { data: sets, error: setsError } = await supabase
            .from("sets")
            .select("*")
            .in(
              "workout_exercise_id",
              workoutExercises.map((exercise) => exercise.id)
            );

          if (setsError) {
            console.error("Error fetching sets:", setsError.message);
            return;
          }

          const completedSetsData: CompletedSet[] = workoutExercises.map(
            (exercise) => ({
              exerciseId: exercise.exercise_id,
              exerciseName:
                exerciseNames.find((e) => e.id === exercise.exercise_id)
                  ?.name || "",
              sets: sets
                .filter((set) => set.workout_exercise_id === exercise.id)
                .map((set) => ({
                  exerciseId: exercise.exercise_id,
                  reps: set.reps,
                  weight: set.weight,
                  partialReps: set.partial_reps || 0,
                })),
            })
          );

          setCompletedSets(completedSetsData);
          setExercisesInWorkout(
            completedSetsData.map((cs) => ({
              id: cs.exerciseId,
              name: cs.exerciseName,
            }))
          );
          setLoading(false);
        } catch (error) {
          console.error("Error loading completed workout:", error);
          setLoading(false);
        }
      } else {
        // For new workouts, try to load auto-saved progress
        const autoSaveRestored = loadWorkoutProgress();
        if (autoSaveRestored) {
          toast.success("Workout progress restored from auto-save");
        }
        setLoading(false);
        setIsInitialized(true);
      }
    };
    loadCompletedWorkout();
  }, [isEditing, workoutId]);

  // TODO: Centralize the loading state and error handling
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="">
      <form action="" className="overflow-y-auto pb-24">
        <div className="bg-base-300 rounded-lg py-3 mt-3 px-2">
          <div className={`${exerciseName ? "mb-3" : ""}`}>
            <ExerciseSelector
              exerciseName={exerciseName}
              setExerciseName={setExerciseName}
              setExerciseId={setExerciseId}
              isSetUpdating={isSetUpdating}
              isSetsEmpty={sets.length === 0}
              exercisesInWorkout={exercisesInWorkout}
            />
          </div>
          {/* Only display the form once an exercise has been chosen */}
          <div>
            {exerciseName && (
              <SetInputForm
                reps={reps}
                weight={weight}
                partialReps={partialReps}
                setReps={setReps}
                setWeight={setWeight}
                setPartialReps={setPartialReps}
                repsEmpty={repsEmpty}
                weightEmpty={weightEmpty}
                partialRepsInvalid={partialRepsInvalid}
                weightInvalid={weightInvalid}
                repsInvalid={repsInvalid}
                repsError={repsError}
                weightError={weightError}
                partialRepsError={partialRepsError}
                isSetUpdating={isSetUpdating}
                handleAddSet={handleAddSet}
                handleSaveUpdatedSet={handleSaveUpdatedSet}
                cancelUpdateSet={cancelUpdateSet}
                updateSetIndex={updateSetIndex}
                lastSet={sets.length > 0 ? sets[sets.length - 1] : undefined}
                repeatLastSet={repeatLastSet}
                setRepeatLastSet={setRepeatLastSet}
              />
            )}
          </div>
        </div>
        {sets.length > 0 && (
          <div className="bg-base-300 rounded-lg py-3 mt-3 px-2">
            <SetList
              sets={sets}
              handleUpdateSet={handleUpdateSet}
              handleDeleteSet={handleDeleteSet}
              exerciseName={exerciseName}
            />
            <AddExerciseButton
              handleAddExerciseToWorkout={handleAddExerciseToWorkout}
              isSetUpdating={isSetUpdating}
              sets={sets}
              isExerciseUpdating={isExerciseUpdating}
            />
          </div>
        )}

        <div
          className={`bg-base-300 rounded-lg ${
            isCompletedExerciseListCollapsed ? "pb-3 pt-1" : "py-3"
          } mt-3 px-2`}
        >
          <CompletedExerciseList
            exercisesInWorkout={exercisesInWorkout}
            handleDeleteExercise={handleDeleteExercise}
            handleUpdateExercise={handleUpdateExercise}
            isCollapsed={isCompletedExerciseListCollapsed}
            setIsCollapsed={setIsCompletedExerciseListCollapsed}
          />
          <WorkoutActionButtons
            handleSaveWorkout={handleSaveWorkout}
            exercisesInWorkout={exercisesInWorkout}
            confirmCancelWorkout={confirmCancelWorkout}
            isEditing={isEditing}
          />
        </div>
      </form>
    </div>
  );
};

export default AddWorkoutForm;

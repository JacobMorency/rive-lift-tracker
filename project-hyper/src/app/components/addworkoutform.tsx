import ExerciseSelector from "@/app/components/workoutform/exerciseselector";
import SetList from "@/app/components/workoutform/setlist";
import CompletedExerciseList from "@/app/components/workoutform/completedexerciselist";
import WorkoutActionButtons from "@/app/components/workoutform/workoutactionbuttons";
import SetInputForm from "@/app/components/workoutform/setinputform";
import AddExerciseButton from "@/app/components/workoutform/addexercisebuttons";
import { useState, useEffect } from "react";
import supabase from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { ExercisesInWorkout, NullableNumber } from "@/types/workout";

type AddWorkoutFormProps = {
  workoutId: number;
};

type CompletedSet = {
  exerciseId: NullableNumber;
  exerciseName: string;
  sets: SetInputs[];
};

type SetInputs = {
  exerciseId: NullableNumber;
  reps: NullableNumber;
  weight: NullableNumber;
  partialReps: NullableNumber;
};

const AddWorkoutForm = ({ workoutId }: AddWorkoutFormProps) => {
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
  const [loading, setLoading] = useState<boolean>(true);
  const [isIntialized, setIsInitialized] = useState<boolean>(false);

  const router = useRouter();

  const handleCompleteWorkout = (): void => {
    localStorage.removeItem("workoutId");
    localStorage.removeItem("workoutProgress");
    router.push("/workouts");
  };

  const handleSaveWorkout = async (): Promise<void> => {
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
        console.error(
          "Error adding exercise to workout:",
          exerciseError.message
        );
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

    const { error } = await supabase
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
  }, [isIntialized]);

  // Save the current workout progress to local storage so that it can be retrieved upon refresh or page change
  useEffect(() => {
    if (isIntialized) {
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
  ]);

  // TODO: Centralize the loading state and error handling
  if (loading) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  return (
    <div>
      <form
        action=""
        className="overflow-y-auto max-h-[calc(100vh-4rem)] pb-24"
      >
        <div className="bg-base-300 rounded-lg py-3 mt-3">
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
                isSetUpdating={isSetUpdating}
                handleAddSet={handleAddSet}
                handleSaveUpdatedSet={handleSaveUpdatedSet}
                cancelUpdateSet={cancelUpdateSet}
                updateSetIndex={updateSetIndex}
              />
            )}
          </div>
        </div>
        {sets.length > 0 && (
          <div className="bg-base-300 rounded-lg py-3 mt-3">
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

        <div className="bg-base-300 rounded-lg py-3 mt-3">
          <CompletedExerciseList
            exercisesInWorkout={exercisesInWorkout}
            handleDeleteExercise={handleDeleteExercise}
            handleUpdateExercise={handleUpdateExercise}
          />
          <WorkoutActionButtons
            handleSaveWorkout={handleSaveWorkout}
            exercisesInWorkout={exercisesInWorkout}
            confirmCancelWorkout={confirmCancelWorkout}
          />
        </div>
      </form>
    </div>
  );
};

export default AddWorkoutForm;

import ExerciseSelector from "../components/workoutform/ExerciseSelector";
import SetList from "../components/workoutform/SetList";
import CompletedExerciseList from "./workoutform/CompletedExerciseList";
import WorkoutActionButtons from "./workoutform/WorkoutActionButtons";
import SetInputForm from "./workoutform/SetInputForm";
import AddExerciseButton from "./workoutform/AddExerciseButton";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
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
    const updatedSets = sets.filter((set, i) => i !== index);
    setSets(updatedSets);
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

  // Get previous workout progress from local storage so its persisted upon refresh
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
          savedSets,
        ] = JSON.parse(savedProgress);
        if (savedCompletedSets) {
          setCompletedSets(savedCompletedSets);
          const derivedExercises = savedCompletedSets.map((ex) => ({
            id: ex.exerciseId,
            name: ex.exerciseName,
          }));
          setExercisesInWorkout(derivedExercises);
        }
        if (savedExerciseId) {
          setExerciseId(savedExerciseId);
        }
        if (savedExerciseName) {
          setExerciseName(savedExerciseName);
        }
        // if (savedExercisesInWorkout) {
        //   setExercisesInWorkout(savedExercisesInWorkout);
        // }
        if (savedReps) {
          setReps(savedReps);
        }
        if (savedWeight) {
          setWeight(savedWeight);
        }
        if (savedPartialReps) {
          setPartialReps(savedPartialReps);
        }
        if (savedSets) {
          setSets(savedSets);
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
          sets,
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
    sets,
  ]);

  // TODO: query supabase instead of relying on local storage
  // useEffect(() => {
  //   if (workoutId) {
  //     fetchCompletedExercises();
  //   }
  // }, [workoutId]);

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
        {/* Only display the form once an exercise has been chosen */}
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
        {sets.length > 0 && (
          <div>
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
            />
          </div>
        )}
        <CompletedExerciseList exercisesInWorkout={exercisesInWorkout} />
        <WorkoutActionButtons
          handleSaveWorkout={handleSaveWorkout}
          exercisesInWorkout={exercisesInWorkout}
          confirmCancelWorkout={confirmCancelWorkout}
        />
      </form>
    </div>
  );
};

export default AddWorkoutForm;

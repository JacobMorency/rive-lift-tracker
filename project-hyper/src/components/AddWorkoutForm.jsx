import ExerciseSelector from "../components/ExerciseSelector";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

const AddWorkoutForm = ({ workoutId }) => {
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseId, setExerciseId] = useState(null);
  //   const [exerciseOptions, setExerciseOptions] = useState([]);
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState([]);
  const [weight, setWeight] = useState("");
  const [partialReps, setPartialReps] = useState("");
  const [exercisesInWorkout, setExercisesInWorkout] = useState([]);
  const { user } = useAuth();

  // const createNewWorkout = async () => {
  //   console.log(user.id);
  //   const { data, error } = await supabase
  //     .from("workouts")
  //     .insert([{ user_id: user.id, date: new Date() }])
  //     .select("id", "user_id", "date")
  //     .single();

  //   if (error) {
  //     console.error("Error creating new workout:", error.message);
  //     return null;
  //   }
  //   console.log(data);
  //   return data?.id;
  // };

  // TODO: Error handling
  const handleAddSet = () => {
    const numReps = parseInt(reps);
    const numWeight = Number(weight);
    if (numReps > 0 && numWeight > 0) {
      setSets((prevSets) => [
        ...prevSets,
        {
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

  const handleAddExerciseToWorkout = async () => {
    const { data: workoutExercisesData, error } = await supabase
      .from("workout_exercises")
      .insert([
        {
          exercise_id: exerciseId,
          workout_id: workoutId, // TODO: Update this to the actual workout ID
          created_at: new Date(),
        },
      ])
      .select("id");
    if (error) {
      console.error("Error adding exercise to workout:", error.message);
      return;
    }

    const workoutExerciseId = workoutExercisesData[0].id;

    const setsData = sets.map((set, index) => ({
      workout_exercise_id: workoutExerciseId,
      set_number: index + 1,
      weight: set.weight,
      reps: set.reps,
      partial_reps: set.partialReps,
      exercise_name: exerciseName,
      workout_id: workoutId,
    }));

    const { error: setsError } = await supabase.from("sets").insert(setsData);
    if (setsError) {
      console.error("Error adding sets to workout:", setsError.message);
      return;
    }

    setSets([]);
    resetFormFields();
    fetchCompletedExercises();
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

  const handleSaveWorkout = async () => {
    const workoutData = {
      user_id: user.id,
      date: new Date(),
      sets_data: JSON.stringify(sets),
    };

    const { data, error } = await supabase
      .from("workouts")
      .insert([workoutData]);
    if (error) {
      console.error("Error saving workout:", error.message);
      return;
    }
    console.log("Workout saved successfully:", data);
  };

  const resetFormFields = () => {
    setExerciseName("");
    setReps("");
    setWeight("");
    setPartialReps("");
  };

  useEffect(() => {
    if (workoutId) {
      fetchCompletedExercises();
    }
  }, [workoutId]);

  return (
    <div>
      <form action="">
        <div className="my-3">
          <ExerciseSelector
            exerciseName={exerciseName}
            setExerciseName={setExerciseName}
            setExerciseId={setExerciseId}
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
                />
              </div>
              <div className="my-3">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0 (lbs)"
                />
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
                />
              </div>
            </div>
            <div>
              <Button className="w-full" onClick={handleAddSet} type="button">
                Add Set
              </Button>
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
                      <li key={index}>
                        <span className="font-bold">Set {index + 1}:</span>{" "}
                        {set.reps} reps at {set.weight} lbs
                        {set.partialReps > 0 &&
                          ` with ${set.partialReps} partial reps`}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Button
                    className="w-full my-3"
                    type="button"
                    onClick={handleAddExerciseToWorkout}
                  >
                    Add Exercise to Workout
                  </Button>
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
      </form>
    </div>
  );
};

export default AddWorkoutForm;

import ExerciseSelector from "../components/ExerciseSelector";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const AddWorkoutForm = () => {
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");
  const [weight, setWeight] = useState("");
  const [partialReps, setPartialReps] = useState("");
  return (
    <div>
      <form action="">
        <ExerciseSelector
          exerciseName={exerciseName}
          setExerciseName={setExerciseName}
          setExerciseOptions={setExerciseOptions}
        />
      </form>
    </div>
  );
};

export default AddWorkoutForm;

import ExerciseSelector from "../components/ExerciseSelector";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const AddWorkoutForm = () => {
  const [exerciseName, setExerciseName] = useState("");
  //   const [exerciseOptions, setExerciseOptions] = useState([]);
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState([]);
  const [weight, setWeight] = useState("");
  const [partialReps, setPartialReps] = useState("");

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
    console.log(sets);
    console.log("Adding set");
  };

  return (
    <div>
      <form action="">
        <div className="my-3">
          <ExerciseSelector
            exerciseName={exerciseName}
            setExerciseName={setExerciseName}
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
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddWorkoutForm;

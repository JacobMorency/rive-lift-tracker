import { useState, useEffect } from "react";
import supabase from "@/app/lib/supabaseClient";
import { ChevronsUpDown } from "lucide-react";
import { ExercisesInWorkout, Exercise } from "@/types/workout";

type ExerciseSelectorProps = {
  exerciseName: string;
  setExerciseName: (name: string) => void;
  setExerciseId: (id: number) => void;
  isSetUpdating: boolean;
  isSetsEmpty: boolean;
  exercisesInWorkout: ExercisesInWorkout[];
};

type ExerciseOption = {
  id: number;
  name: string;
}[];

const ExerciseSelector = ({
  exerciseName,
  setExerciseName,
  setExerciseId,
  isSetUpdating,
  isSetsEmpty,
  exercisesInWorkout,
}: ExerciseSelectorProps) => {
  const [exerciseOptions, setExerciseOptionsState] = useState<ExerciseOption>(
    []
  );
  const [searchValue, setSearchValue] = useState<string>("");

  // Get the list of exercises from the database
  const fetchExercises = async (): Promise<void> => {
    const { data, error } = await supabase.from("exercise_library").select("*");
    if (error) {
      console.error("Error fetching exercises:", error.message);
      return;
    }
    setExerciseOptionsState(data);
  };

  // TODO: Potentially filter out exercisesInWorkout from the list instead of disabling

  useEffect(() => {
    fetchExercises();
  }, []);

  // Filter exercises based on search input
  const filteredExercises = exerciseOptions.filter((ex) =>
    ex.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Handle the select
  const handleSelect = (exercise: Exercise): void => {
    setExerciseName(exercise.name);
    setExerciseId(exercise.id);
  };

  return (
    <div className="dropdown dropdown-center w-full px-4">
      <label
        tabIndex={0}
        className={`bg-primary btn w-full ${
          isSetUpdating ? "btn-disabled" : ""
        }`}
      >
        {exerciseName || "Select an Exercise"}
        <ChevronsUpDown size={16} className="absolute right-6" />
      </label>
      {!isSetUpdating && (
        <ul
          tabIndex={0}
          className="dropdown-content menu px-4 shadow-md rounded-box w-full bg-base-300"
        >
          {isSetsEmpty ? (
            <div>
              <input
                type="text"
                placeholder="Search exercises"
                className="input input-bordered w-full mb-2"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <div className="overflow-y-auto max-h-64">
                {filteredExercises.map((exercise) => (
                  <li key={exercise.id}>
                    <button
                      className="btn btn-primary my-1 w-full"
                      disabled={exercisesInWorkout.some(
                        (ex) => ex.name === exercise.name
                      )}
                      onClick={() => handleSelect(exercise)}
                    >
                      {exercise.name}
                    </button>
                  </li>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-center px-2">
              Please add this exercise to the workout or remove the sets to
              switch exercises.
            </p>
          )}
        </ul>
      )}
    </div>
  );
};

export default ExerciseSelector;

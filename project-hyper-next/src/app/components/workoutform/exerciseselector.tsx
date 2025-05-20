import { useState, useEffect } from "react";
import supabase from "@/app/lib/supabaseClient";
import { ChevronsUpDown } from "lucide-react";

const ExerciseSelector = ({
  exerciseName,
  setExerciseName,
  setExerciseId,
  isSetUpdating,
  isSetsEmpty,
  exercisesInWorkout,
}) => {
  const [exerciseOptions, setExerciseOptionsState] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  // Get the list of exercises from the database
  const fetchExercises = async () => {
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
  const handleSelect = (exercise) => {
    setExerciseName(exercise.name);
    setExerciseId(exercise.id);
  };

  return (
    <div className="my-3 dropdown dropdown-center w-full px-4">
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
          className="dropdown-content menu px-4 shadow rounded-box overflow-y-auto w-full"
        >
          {isSetsEmpty ? (
            <>
              <input
                type="text"
                placeholder="Search exercises"
                className="input input-bordered w-full mb-2"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
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
            </>
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

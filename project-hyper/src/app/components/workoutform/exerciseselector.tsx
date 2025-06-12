import { useState, useEffect } from "react";
import supabase from "@/app/lib/supabaseClient";
import { Dumbbell } from "lucide-react";
import { ExercisesInWorkout, Exercise } from "@/types/workout";
import { toast } from "sonner";
import debounce from "lodash/debounce";

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
  category: string;
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
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  // TODO: Potentially filter out exercisesInWorkout from the list instead of disabling

  const fetchExercises = async (
    searchTerm: string,
    filter: string
  ): Promise<void> => {
    try {
      let query = supabase.from("exercise_library").select("*");

      if (filter === "Arms") {
        query = query.in("category", ["Biceps", "Triceps", "Shoulders"]);
      } else if (filter) {
        query = query.eq("category", filter);
      }

      const { data, error } = await query
        .ilike("name", `%${searchTerm}%`)
        .range(0, 30); // Limit to 30 results

      if (error) {
        console.error("Error fetching exercises:", error.message);
        return;
      }

      setExerciseOptionsState(data);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  // Debounce the search input to avoid too many requests
  const debouncedFetch = debounce((term: string, filter: string) => {
    fetchExercises(term, filter);
  }, 300);

  useEffect(() => {
    debouncedFetch(searchValue, selectedFilter);
  }, [searchValue, selectedFilter, debouncedFetch]);

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

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
    <div className="w-full px-4">
      <button
        tabIndex={0}
        type="button"
        onClick={() => {
          if (!isSetsEmpty) {
            toast.error(
              "Finish or remove current sets before selecting a new exercise."
            );
            return;
          }

          (
            document.getElementById("exercise_modal") as HTMLDialogElement
          )?.showModal();
        }}
        className={`bg-primary btn w-full ${
          isSetUpdating ? "btn-disabled" : ""
        }`}
        disabled={isSetUpdating}
      >
        {exerciseName || "Select an Exercise"}
        <Dumbbell size={16} className="absolute right-10" />
      </button>

      <dialog id="exercise_modal" className="modal">
        <div className="modal-box h-screen rounded-none w-full flex flex-col">
          <h3 className="font-bold text-center mb-3">Select an Exercise</h3>
          <div>
            <div>
              <input
                type="text"
                placeholder="Search exercises"
                className="input input-bordered w-full"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="divider">Filters</div>
            <div className="flex justify-center my-3">
              <div className="filter">
                <input
                  className="btn btn-square btn-primary"
                  type="reset"
                  value="×"
                  onClick={() => setSelectedFilter("")}
                />
                <input
                  className="btn btn-primary"
                  type="radio"
                  name="musclegroup"
                  aria-label="Chest"
                  onClick={() => setSelectedFilter("Chest")}
                />
                <input
                  className="btn btn-primary"
                  type="radio"
                  name="musclegroup"
                  aria-label="Back"
                  onClick={() => setSelectedFilter("Back")}
                />
                <input
                  className="btn btn-primary"
                  type="radio"
                  name="musclegroup"
                  aria-label="Legs"
                  onClick={() => setSelectedFilter("Legs")}
                />
                <input
                  className="btn btn-primary"
                  type="radio"
                  name="musclegroup"
                  aria-label="Arms"
                  onClick={() => setSelectedFilter("Arms")}
                />
              </div>
            </div>
            <div className="divider"></div>
            {!isSetUpdating && (
              <div className="max-h-96 overflow-y-auto rounded">
                <ul tabIndex={0} className="">
                  {isSetsEmpty && (
                    <div>
                      <div>
                        {filteredExercises.map((exercise) => (
                          <li key={exercise.id}>
                            <button
                              className="btn btn-primary my-1 w-full"
                              type="button"
                              disabled={exercisesInWorkout.some(
                                (ex) => ex.name === exercise.name
                              )}
                              onClick={() => {
                                handleSelect(exercise);
                                (
                                  document.getElementById(
                                    "exercise_modal"
                                  ) as HTMLDialogElement
                                )?.close();
                              }}
                            >
                              {exercise.name}
                            </button>
                          </li>
                        ))}
                      </div>
                    </div>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ExerciseSelector;
